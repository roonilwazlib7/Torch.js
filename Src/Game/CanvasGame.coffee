class CanvasGame

    constructor: (@canvasId, @width, @height, @name, @graphicsType, @pixel = 0) ->
        @InitGame()

    CanvasGame.MixIn(EventDispatcher)

    InitGame: ->
        @InitEventDispatch()
        @InitGraphics()
        @InitComponents()

    InitComponents: ->
        styleString = "background-color:#{Color.Flame.GetHtmlString()}; color:#{Color.Ruby.GetHtmlString()}; font-weight: bold; padding:2px; padding-right:5px;padding-left:5px"
        graphicsString = "WebGL"

        if @graphicsType is Torch.CANVAS then graphicsString = "Canvas"

        console.log("%c Torch v#{Torch::version} |#{graphicsString}| - #{@name}", styleString)

        @Loop = new Loop(@)
        @Load = new Load(@)
        @Mouse = new Mouse(@)
        @Timer = new Timer(@)
        @Camera = new Camera(@)
        @Layers = new Layers(@)
        @Debug = new Debug(@)
        @Keys = new Keys(@)
        @Tweens = new TweenManager(@)
        @Particles = new ParticleManager(@)
        @Audio = new Audio(@) #not ready for this yet
        @Hooks = new HookManager(@)

        Style()

        @deltaTime = 0
        @fps = 0
        @averageFps = 0
        @allFPS = 0
        @ticks = 0
        @zoom = 1
        @uidCounter = 0

        @paused = false

        @time = null
        @LastTimeStamp = null

        @spriteList = []
        @threeList = []
        @taskList = []
        @animations = []
        @tweens = []
        @DrawStack = []
        @AddStack = []
        @GamePads = []

        @events = {}
        @filter = {}

    InitGraphics: ->
        @canvasNode = document.createElement("CANVAS")
        @canvasNode.width = window.innerWidth
        @canvasNode.height = window.innerHeight

        document.getElementById(@canvasId).appendChild(@canvasNode)

        @canvas = @canvasNode.getContext("2d")
        @Clear("#cc5200")

    PixelScale: ->
        @canvas.mozImageSmoothingEnabled = false
        @canvas.imageSmoothingEnabled = false

        return @

    Start: (configObject) ->
        defaultConfigObject =
            Load: ->
            Update: ->
            Draw: ->
            Init: ->

        Util.Object( defaultConfigObject ).Extend(configObject)

        @load = defaultConfigObject.Load
        @update = defaultConfigObject.Update
        @draw = defaultConfigObject.Draw
        @init = defaultConfigObject.Init

        @load(@)

        @Load.Load =>
            @init(@)
            @WireUpEvents()
            @Run()

        @canvasNode.width = @width
        @canvasNode.height = @height

        if typeof(@width) is "string"
            @canvasNode.width = document.body.clientWidth - 50

        if typeof(@height) is "string"
            @canvasNode.height = document.body.clientHeight - 25

    Add: (o) ->
        if o is undefined or o._torch_add is undefined
            @FatalError("Cannot add object: #{o.constructor.name} to game")

        if o._torch_add is "Sprite"
            o._torch_uid = "TORCHSPRITE" + @uidCounter.toString()
            o._torch_add_order = @uidCounter

            @AddStack.push(o)
            @uidCounter++

        else if o._torch_add is "Three"
            o.game = @
            @gl_scene.add(o.entity)

        else if o._torch_add is "Task"
            @taskList.push(o)

    Task: (task) ->
        @taskList.push(task)
        return @

    Run: (timestamp) ->
        @Loop.Run(0)

    FlushSprites: ->
        for sprite in @spriteList then sprite.Trash()

    FatalError: (error) ->
        if @fatal
            return

        @fatal = true

        if typeof error == "string"
            error = new Error(error)

        @Clear("#000")
        stack = error.stack.replace(/\n/g, "<br><br>")
        errorHtml = """
        <code style='color:#C9302Cmargin-left:15%font-size:24px'>#{error}</code>
        <br>
        <code style='color:#C9302Cfont-size:20pxfont-weight:bold'>Stack Trace:</code>
        <br>
        <code style='color:#C9302Cfont-size:20px'>#{stack}</code>
        <br>
        <code style='color:#C9302Cfont-size:18px'>Time: #{@time}</code>
        """
        document.body.innerHTML = errorHtml

        @RunGame = ->
        @Run = ->
        @Emit "FatalError", new Torch.Event @,
            error: error
        throw error

    UpdateTasks: ->
        for task in @taskList
            task.Execute(@)

        @taskList = Torch.Util.Array( @taskList ).Filter (t) -> return not t.trash

    UpdateSprites: ->
        for sprite in @spriteList
            if not sprite.trash
                if not sprite.paused
                    sprite.Update()
            else
                sprite.trashed = true
                sprite.Emit "Trash", new Torch.Event(@)

        @spriteList = Torch.Util.Array( @spriteList ).Filter (s) -> return not s.trash

        @spriteList = @spriteList.concat( @AddStack )
        @AddStack = []

    DrawSprites: ->
        # we need to clear the entire screen
        @canvas.clearRect(0, 0, @Camera.Viewport.maxWidth, @Camera.Viewport.maxHeight)

        @spriteList.sort (a, b) ->
            if a.drawIndex is b.drawIndex
                return a._torch_add_order - b._torch_add_order

            return a.drawIndex - b.drawIndex

        for sprite in @spriteList
            if sprite.draw and not sprite.trash and not sprite.GHOST_SPRITE
                sprite.Draw()

    UpdateAnimations: ->
        for anim in @animations then anim.Run()

    UpdateTimeInfo: ->
        @fps = Math.round(1000 / @deltaTime)
        if @fps is Infinity
            @allFPS += 0
        else
            @allFPS += Math.round(1000 / @deltaTime)
        @ticks++
        @averageFps = Math.round(@allFPS / @ticks)

    UpdateGamePads: ->
        if navigator.getGamepads && typeof(navigator.getGamepads)
            @GamePads = []
            pads = navigator.getGamepads()
            for pad in pads
                if (pad)
                    @GamePads.push(new Torch.GamePad(pad))

    Clear: (color) ->
        if color is undefined
            @FatalError("Cannot clear undefined color")
        if typeof color is "object"
            color = color.hex

        @canvasNode.style.backgroundColor = color
        return @

    File: (fileId) ->
        if @Files[fileId] is undefined
            @FatalError("Unable to access no-existent file: #{fileId}. File does not exist")
        else
            return @Files[fileId]

    Sound: (soundId) ->
        if @Assets.Sounds[soundId] is undefined
            @FatalError("Unable to access no-existent file: #{soundId}. File does not exist")
        else
            return @Assets.Sounds[soundId].audio

    getCanvasEvents: ->
        evts = [
            [
                "mousemove", (e) =>
                    @Mouse.SetMousePos(@canvasNode, e)
                    @Emit "MouseMove", new Torch.Event @,
                        nativeEvent: e
            ]
            [
                "mousedown", (e) =>
                    @Mouse.down = true
                    @Emit "MouseDown", new Torch.Event @,
                        nativeEvent: e
            ]
            [
                "mouseup", (e) =>
                    @Mouse.down = false
                    @Emit "MouseUp", new Torch.Event @,
                        nativeEvent: e
            ]
            [
                "touchstart", (e) =>
                    @Mouse.down = true

            ]
            [
                "touchend", (e) =>
                    @Mouse.down = false
            ]
            [
                "click", (e) =>
                    e.preventDefault()
                    e.stopPropagation()
                    @Emit "Click", new Torch.Event @,
                        nativeEvent: e
                    return false
            ]
        ]

        return evts

    getBodyEvents: ->
        bodyEvents =
        [
            [
                "keydown", (e) =>
                    c = e.keyCode
                    key = @Keys.SpecialKey(c)

                    if key is null
                        key = @Keys[String.fromCharCode(e.keyCode).toUpperCase()]

                    key.down = true
                    key.Emit("KeyDown", new Torch.Event(@, {nativeEvent: e}))

            ]
            [
                "keyup", (e) =>
                    c = e.keyCode
                    key = @Keys.SpecialKey(c)

                    if key is null
                        key = @Keys[String.fromCharCode(e.keyCode).toUpperCase()]

                    key.down = false
                    key.Emit("KeyUp", new Torch.Event(@, {nativeEvent: e}))
            ]
        ]
        return bodyEvents

    WireUpEvents: ->
        for eventItem in @getCanvasEvents()
            @canvasNode.addEventListener(eventItem[0], eventItem[1], false)

        for eventItem in @getBodyEvents()
            document.body.addEventListener(eventItem[0], eventItem[1], false)

        # window resize event
        resize = (event) =>
            @Emit "Resize", new Torch.Event @,
                nativeEvent: event

        window.addEventListener( 'resize', resize, false )

        pads = navigator.getGamepads()


    TogglePause: ->
        if not @paused
            @paused = true
        else
            @paused = false
        return @
