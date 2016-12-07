###
    @class Torch.Game
    @author roonilwazlib

    @constructor
        @param canvasId, string, REQUIRED
        @param width, number|string, REQUIRED
        @param height, number|string, REQUIRED
        @param name, string, REQUIRED
        @param graphicsType, enum, REQUIRED
        @param pixel, enum

    @description
        Torch.Canvas game controls the base behavior of a Torch game. The gameloop,
        asset loading, and initialization are handled here. Torch.CanvasGame
        dictates the HTML5 2d canvas be used for rendering, as opposed to WEBGL
###
class CanvasGame

    constructor: (@canvasId, @width, @height, @name, @graphicsType, @pixel = 0) ->
        @InitGame()

    CanvasGame.MixIn(Torch.EventDispatcher)

    InitGame: ->
        @InitEventDispatch()
        @InitGraphics()
        @InitComponents()

    InitComponents: ->
        styleString = "background-color:orange; color:white; padding:2px; padding-right:5px;padding-left:5px"
        graphicsString = "WebGL"

        if @graphicsType is Torch.CANVAS then graphicsString = "Canvas"

        console.log("%c Torch v#{Torch.version} |#{graphicsString}| - #{@name}", styleString)

        @Loop = new Torch.Loop(@)
        @Load = new Torch.Load(@)
        @Viewport = new Torch.Viewport(@)
        @Mouse = new Torch.Mouse(@)
        @Timer = new Torch.Timer(@)
        @Camera = new Torch.Camera(@)
        @Layers = new Torch.Layers(@)
        @Debug = new Torch.Debug(@)
        @Keys = new Torch.Keys(@)
        # @Audio = new Torch.Audio(@) not ready for this yet

        Torch.Style()

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
        @canvas.webkitImageSmoothingEnabled = false
        @canvas.mozImageSmoothingEnabled = false
        @canvas.imageSmoothingEnabled = false

        return @

    Bounds: (boundRec) ->
        if boundRec is undefined
            @BoundRec = @Viewport.GetViewRectangle()
        return @

    Start: (load, update, draw, init) ->
        if load is undefined
            @FatalError("Unable to start game '#{@name}' without load function")
        if update is undefined
            @FatalError("Unable to start game '#{@name}' without update function")
        if draw is undefined
            @FatalError("Unable to start game '#{@name}' without draw function")
        if init is undefined
            @FatalError("Unable to start game '#{@name}' without update function")

        @load = load
        @update = update
        @draw = draw
        @init = init

        @load(@)

        @Load.Load =>
            @init(@)
            @WireUpEvents()
            @Run()

        if @graphicsType is Torch.WEBGL then return

        @canvasNode.width = @width
        @canvasNode.height = @height

        if typeof(@width) is "string"
            @canvasNode.width = document.body.clientWidth - 50

        if typeof(@height) is "string"
            @canvasNode.height = document.body.clientHeight - 25

        @Viewport.width = @canvasNode.width
        @Viewport.height = @canvasNode.height

    Add: (o) ->
        if o is undefined or o._torch_add is undefined
            @FatalError("Cannot add object: #{o.constructor.name} to game")

        if o._torch_add is "Sprite"
            o._torch_uid = "TORCHSPRITE" + @uidCounter.toString()

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

    Tween: (object, timeTweenShouldTake) ->
        return new Torch.TweenSetup(@, object, timeTweenShouldTake)

    UpdateTasks: ->
        cleanedTasks = []
        for task in @taskList
            task.Execute(@)

            if not task.trash then cleanedTasks.push(task)
        @taskList = cleanedTasks

    UpdateSprites: ->
        cleanedSprites = []
        for sprite in @spriteList
            if not sprite.trash
                if not sprite.game.paused
                    sprite.Update()
                cleanedSprites.push(sprite)
            else
                sprite.trashed = true
                sprite.Emit "Trash", new Torch.Event(@)
        @spriteList = cleanedSprites

        for o in @AddStack then @spriteList.push(o)
        @AddStack = []

    DrawSprites: ->
        @canvas.clearRect(0, 0, @Viewport.width, @Viewport.height)

        @spriteList.sort (a, b) ->
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

    UpdateTweens: ->
        cleanedTweens = []
        for tween in @tweens
            if not tween.trash
                cleanedTweens.push(tween)
                tween.Update()

    Clear: (color) ->
        if color is undefined
            @FatalError("Cannot clear undefined color")
        if typeof color is "object"
            color = color.hex

        @canvasNode.style.backgroundColor = color
        return @

    File: (fileId) ->
        if (@Files[fileId] is undefined)
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
            ],
            [
                "mousedown", (e) =>
                    @Mouse.down = true
                    @Emit "MouseDown", new Torch.Event @,
                        nativeEvent: e
            ],
            [
                "mouseup", (e) =>
                    @Mouse.down = false
                    @Emit "MouseUp", new Torch.Event @,
                        nativeEvent: e
            ],
            [
                "touchstart", (e) =>
                    @Mouse.down = true

            ],
            [
                "touchend", (e) =>
                    @Mouse.down = false
            ],
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
                    if c is 32
                        @Keys.Space.down = true
                        @Keys.Space.Emit("KeyDown", new Torch.Event(@, {nativeEvent: e}))

                    else if c is 37
                        @Keys.LeftArrow.down = true
                        @Keys.LeftArrow.Emit("KeyDown", new Torch.Event(@, {nativeEvent: e}))

                    else if c is 38
                        @Keys.UpArrow.down = true
                        @Keys.UpArrow.Emit("KeyDown", new Torch.Event(@, {nativeEvent: e}))

                    else if c is 39
                        @Keys.RightArrow.down = true
                        @Keys.RightArrow.Emit("KeyDown", new Torch.Event(@, {nativeEvent: e}))

                    else if c is 40
                        @Keys.DownArrow.down = true
                        @Keys.DownArrow.Emit("KeyDown", new Torch.Event(@, {nativeEvent: e}))

                    else
                        @Keys[String.fromCharCode(e.keyCode).toUpperCase()].down = true
                        @Keys[String.fromCharCode(e.keyCode).toUpperCase()].Emit("KeyDown", new Torch.Event(@, {nativeEvent: e}))


            ],
            [
                "keyup", (e) =>
                    c = e.keyCode
                    if c is 32
                        @Keys.Space.down = false
                        @Keys.Space.Emit("KeyUp", new Torch.Event(@, {nativeEvent: e}))

                    else if c is 37
                        @Keys.LeftArrow.down = false
                        @Keys.LeftArrow.Emit("KeyUp", new Torch.Event(@, {nativeEvent: e}))

                    else if c is 38
                        @Keys.UpArrow.down = false
                        @Keys.UpArrow.Emit("KeyUp", new Torch.Event(@, {nativeEvent: e}))

                    else if c is 39
                        @Keys.RightArrow.down = false
                        @Keys.RightArrow.Emit("KeyUp", new Torch.Event(@, {nativeEvent: e}))

                    else if c is 40
                        @Keys.DownArrow.down = false
                        @Keys.DownArrow.Emit("KeyUp", new Torch.Event(@, {nativeEvent: e}))

                    else
                        @Keys[String.fromCharCode(e.keyCode).toUpperCase()].down = false
                        @Keys[String.fromCharCode(e.keyCode).toUpperCase()].Emit("KeyUp", new Torch.Event(@, {nativeEvent: e}))
            ]
        ]
        return bodyEvents

    WireUpEvents: ->
        for eventItem in @getCanvasEvents()
            @canvasNode.addEventListener(eventItem[0], eventItem[1], false)

        for eventItem in @getBodyEvents()
            document.body.addEventListener(eventItem[0], eventItem[1], false)

        # document.body.addEventListener("keypress", RecordKeyPress, false)

        window.addEventListener "gamepadconnected", (e) =>
            gp = navigator.getGamepads()[e.gamepad.index]
            @GamePads.push(new Torch.GamePad(gp))
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length)

        # window resize event
        resize = (event) =>
            @Viewport.width = window.innerWidth
            @Viewport.height = window.innerHeight
            @Emit "Resize", new Torch.Event @,
                nativeEvent: event

        window.addEventListener( 'resize', resize, false )

        pads = navigator.getGamepads()

        ###
        for (var i = 0 i < pads.length i++)
        {
            @GamePads.push(new Torch.GamePad(pads[i]))
        }
        ###

    TogglePause: ->
        if not @paused
            @paused = true
        else
            @paused = false
        return @


# expose to Torch
Torch.CanvasGame = CanvasGame
