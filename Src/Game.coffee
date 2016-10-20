class Game
    constructor: (@canvasId, @width, @height, @name, @graphicsType = Torch.CANVAS) ->
        console.log("%c   " + Torch.version + "-" + name + "  ", "background-color:#cc5200 color:white")

        if @graphicsType is Torch.CANVAS
            @canvasNode = document.getElementById(@canvasId)
            @canvas = @canvasNode.getContext("2d")
            @Clear("#cc5200")
        else
            @gl_rendererContainer = document.getElementById(@canvasId)
            light = new THREE.DirectionalLight("#fff")
            light.position.set(0,1,0)

            @gl_scene = new THREE.Scene()
            @gl_camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 )
            @gl_camera.position.y = 400
            @gl_renderer = new THREE.WebGLRenderer( { antialias: true } )
            @gl_renderer.setSize( window.innerWidth, window.innerHeight )
            @gl_renderer.setPixelRatio( window.devicePixelRatio )

            @gl_scene.add(light)

            @gl_rendererContainer.appendChild(@gl_renderer.domElement)

            # @gl_scene.add( new THREE.AmbientLight( 0x404040 ) )


        @Load = new Torch.Load(@)
        @Viewport = new Torch.Viewport(@)
        @Mouse = new Torch.Mouse(@)
        @Timer = new Torch.Timer(@)
        @Camera = new Torch.Camera()
        @Keys = new Torch.Keys()

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
        @taskList = []
        @animations = []
        @DrawStack = []
        @AddStack = []
        @GamePads = []

        @events = {}

    On: (eventName, eventHandle) ->
        @events[eventName] = eventHandle
        return @

    Emit: (eventName, eventArgs) ->
        if @events[eventName] isnt undefined
            @events[eventName](eventArgs)
        return @

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
            console.log("init game")
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

        o._torch_uid = "TORCHSPRITE" + @uidCounter.toString()

        @AddStack.push(o)
        @uidCounter++

    Task: (task) ->
        @taskList.push(task)
        return @

    RunGame: (timestamp) ->
        if @time is undefined
            @time = timestamp

        @deltaTime = Math.round(timestamp - @time)
        @time = timestamp

        @draw(@)
        @update(@)
        @Viewport.Update()
        @Camera.Update()
        @Timer.Update()
        @UpdateAndDrawSprites()
        @UpdateAnimations()
        @UpdateTimeInfo()
        @UpdateTasks()
        @UpdateGamePads()

        if @graphicsType is Torch.WEBGL

            @gl_renderer.render( @gl_scene, @gl_camera )

        window.requestAnimationFrame (timestamp) =>
            @RunGame(timestamp)

    Run: (timestamp) ->
        @RunGame(0)

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
        $("body").empty()
        $("body").prepend("<code style='color:#C9302Cfont-size:18px'>Time: #{@time}</code>")
        $("body").prepend("<code style='color:#C9302Cfont-size:20px'>#{stack}</code><br>")
        $("body").prepend("<code style='color:#C9302Cmargin-left:15%font-size:24px'>
                                #{error}
                          </code><br>
                          <code style='color:#C9302Cfont-size:20pxfont-weight:bold'>Stack Trace:</code><br>")
        @RunGame = ->
        @Run = ->
        @Emit("FatalError")
        throw error

    UpdateTasks: ->
        for task in @taskList then task()

    UpdateSprites: ->
        cleanedSprites = []
        for sprite in @spriteList
            if not sprite.trash
                if not sprite.game.paused then sprite.Update()
                cleanedSprites.push(sprite)
            else
                sprite.trashed = true
                sprite.Emit("Trash")
        @spriteList = cleanedSprites

    DrawSprites: ->
        @canvas.clearRect(0, 0, @Viewport.width, @Viewport.height)
        @spriteList.sort (a, b) ->
            return a.drawIndex - b.drawIndex
        for sprite in @spriteList
            if sprite.draw and not sprite.trash and not sprite.GHOST_SPRITE
                sprite.Draw()

    UpdateAndDrawSprites: ->
        if @loading
            return

        @DrawSprites()
        @UpdateSprites()

        for o in @AddStack then @spriteList.push(o)
        @AddStack = []

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

    Draw: (texture, rectangle, params = {}) ->
        viewRect = @Viewport.GetViewRectangle()

        if not rectangle.Intersects(viewRect)
            return

        @canvas.save()

        x = Math.round(rectangle.x + @Viewport.x)
        y = Math.round(rectangle.y + @Viewport.y)
        width = rectangle.width
        height = rectangle.height

        rotation = params.rotation ? 0
        rotation += @Viewport.rotation

        @canvas.globalAlpha = params.alpha ? @canvas.globalAlpha

        @canvas.translate(x + width / 2, y + height / 2)

        @canvas.rotate(rotation)

        if params.IsTextureSheet
            @canvas.drawImage(texture.image, params.clipX, params.clipY, params.clipWidth, params.clipHeight, -width/2, -height/2, rectangle.width, rectangle.height)
        else
            @canvas.drawImage(texture.image, -width/2, -height/2, rectangle.width, rectangle.height)

        @canvas.rotate(0)
        @canvas.globalAlpha = 1

        @canvas.restore()

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
            ],
            [
                "mousedown", (e) =>
                    @Mouse.down = true
            ],
            [
                "mouseup", (e) =>
                    @Mouse.down = false
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
                    return false
            ]
        ]

        return evts

    WireUpEvents: ->
        bodyEvents =
        [
            [
                "keydown", (e) =>
                    c = e.keyCode
                    if c is 32
                        @Keys.Space.down = true

                    else if c is 37
                        @Keys.LeftArrow.down = true

                    else if c is 38
                        @Keys.UpArrow.down = true

                    else if c is 39
                        @Keys.RightArrow.down = true

                    else if c is 40
                        @Keys.DownArrow.down = true

                    else
                        @Keys[String.fromCharCode(e.keyCode).toUpperCase()].down = true


            ],
            [
                "keyup", (e) =>
                    c = e.keyCode
                    if c is 32
                        @Keys.Space.down = false

                    else if c is 37
                        @Keys.LeftArrow.down = false

                    else if c is 38
                        @Keys.UpArrow.down = false

                    else if c is 39
                        @Keys.RightArrow.down = false

                    else if c is 40
                        @Keys.DownArrow.down = false

                    else
                        @Keys[String.fromCharCode(e.keyCode).toUpperCase()].down = false
            ]
        ]

        for eventItem in @getCanvasEvents()
            @canvasNode.addEventListener(eventItem[0], eventItem[1], false)

        for eventItem in bodyEvents
            document.body.addEventListener(eventItem[0], eventItem[1], false)

        window.addEventListener "gamepadconnected", (e) =>
            gp = navigator.getGamepads()[e.gamepad.index]
            @GamePads.push(new Torch.GamePad(gp))
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length)

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
Torch.Game = Game
