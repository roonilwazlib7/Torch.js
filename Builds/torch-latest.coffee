# Catch all errors
window?.onerror = (args...) ->
    return if not window.Torch.STRICT_ERRORS

    document.body.style.backgroundColor = "black"

    errorObj = args[4]

    if errorObj isnt undefined
        Torch.FatalError(errorObj)
    else
        Torch.FatalError("An error has occured")

# Modify some core js prototypes
Function::MixIn = Function::is = (otherFunction) ->
    proto = this.prototype
    items = Object.create(otherFunction.prototype)

    for key,value of items
        proto[key] = value

    return this #allow chaining

String::format = (args...) ->
    replacer = (match, number) ->
        return args[number] if typeof args[number] isnt undefined
        return match        if typeof args[number] is undefined

    return @replace(/{(\d+)}/g, replacer)

String::capitalize = ->
    return this.charAt(0).toUpperCase() + this.slice(1)

String::unCapitalize = ->
    return this.charAt(0).toLowerCase() + this.slice(1)

class EventDispatcher
    @dispatchers: []

    InitEventDispatch: ->
        @events = {}
        EventDispatcher.dispatchers.push(@)

    On: (eventName, eventHandle) ->
        if not @events[eventName]
            eventNest = []
            eventNest.triggers = 0

            @events[eventName] = eventNest

        @events[eventName].push(eventHandle)

        return @

    Emit: (eventName, eventArgs) ->
        if @events[eventName] isnt undefined
            for ev in @events[eventName]
                @events[eventName].triggers++
                ev(eventArgs)
        return @

    Off: (eventName = "") ->
        if eventName isnt ""
            @events[eventName] = undefined
        else
            for key,val of @events
                @events[key] = undefined
        return @

class Trashable
    trash: false
    Trash: ->
        @trash = true
        return @

class DebugConsole
    enabled: false
    console: null
    consoleInput: null
    consoleOutput: null
    commands: null
    variables: null
    constructor: (@game) ->
        html = """
                <div id = "torch-console" style = "position: absolute;z-index: 100;top:0;border: 1px solid orange;background-color:black">
                    <p style = "color:white;margin-left:1%;font-family:monospace">Torch Dev Console. Type /HELP for usage</p>
                    <input type="text" id = "torch-console-input" placeholder="Torch Dev Console, type /HELP for usage"/ style = "outline: none;border: none;font-family: monospace;color: white;background-color: black;font-size: 16px;padding: 3%;width: 100%;" />
                    <div id = "torch-console-output" style = "overflow:auto;outline: none;border: none;font-family: monospace;color: white;background-color: black;font-size: 14px;padding: 1%;width: 98%;height:250px"></div>
                </div>
        """
        div = document.createElement("div")

        div.innerHTML = html
        div.style.display = "none"

        document.body.appendChild(div)

        @console = div
        @consoleInput = document.getElementById("torch-console-input")
        @consoleOutput = document.getElementById("torch-console-output")
        @commands = {}
        @variables = {}

        @LoadDefaultCommands()

        document.addEventListener "keypress", (e) =>
            if e.keyCode is 47
                @Toggle(true)

            else if e.keyCode is 13
                @ParseCommand()

        document.addEventListener "keydown", (e) =>
            if e.keyCode is 27
                @Toggle(false)

    Toggle: (tog = true) ->

        if tog
            @console.style.display = "block"
            @consoleInput.focus()
            @enabled = true
        else
            @console.style.display = "none"
            @consoleInput.value = ""
            @enabled = false

    Output: (content, color = "white") ->
        content = content.replace(/\n/g, "<br>")
        @consoleOutput.innerHTML += "<p style='color:orange'>TorchDev$</p><p style='color:#{color}'>#{content}</p>"

    ParseCommand: ->
        return if not @enabled

        commandText = @consoleInput.value

        # put in environment vars
        commandText = commandText.replace /\$(.*?)\$/g, (text) =>
             clippedText = text.substring(1,text.length-1)
             return @variables[clippedText]

        command = commandText.split(" ")[0].split("/")[1]
        args = []

        for option,index in commandText.split(" ")
            args.push(option) if index isnt 0

        @ExecuteCommand(command, args)

    ExecuteCommand: (command, args) ->
        if not @commands[command]
            @Output("Command '#{command}' does not exist.", "red")
            return
        else
            @commands[command]( @, args... )

    AddCommand: (name, callback) ->
        @commands[name] = callback

    LoadDefaultCommands: ->
        @AddCommand "HELP", (tConsole) =>
            tConsole.Output """
            type '/HELP' for help
            type '/FPS' for frame rate
            type '/TIME' for game time
            type '/E [statement]' to execute a JavaScript statement
            type '/RUN [path] to load and execute a JavaScript file'
            """
        @AddCommand "CLEAR", (tConsole) =>
            @consoleOutput.innerHTML = ""
        @AddCommand "FPS", (tConsole) =>
            tConsole.Output """
            Current FPS: #{@game.fps}
            Average FPS: #{0}
            """
        @AddCommand "TIME", (tConsole) =>
            tConsole.Output """
            Total Game Time: #{@game.time}
            Delta Time: #{@game.deltaTime}
            """
        @AddCommand "RUN", (tConsole, filePath) =>
            loader = new Torch.AjaxLoader(filePath, Torch.AjaxData.Text)
            loader.Finish (data) =>
                try
                    eval(data)
                    tConsole.Output("File Executed", "green")
                catch error
                    tConsole.Output("File: '#{statement}' caused an error. #{error}", "red")

            loader.Load()

        @AddCommand "SET", (tConsole, name, value) =>
            if isNaN(value)
                @variables[name] = value
            else
                @variables[name] = parseFloat(value)

            @Output("Set #{name} to #{value}", "green")

        @AddCommand "E", (tConsole, statement) =>
            try
                eval(statement)
                tConsole.Output("Statment Executed", "green")
            catch error
                tConsole.Output("Statement: '#{statement}' caused an error. #{error}", "red")

class BodyManager
    constructor: (@sprite)->
        @game = @sprite.game
        @velocity = new Vector(0,0)
        @acceleration = new Vector(0,0)
        @omega = 0
        @alpha = 0

    Update: ->
        @sprite.position.x += @velocity.x * @game.Loop.updateDelta
        @sprite.position.y += @velocity.y * @game.Loop.updateDelta

        @velocity.x += @acceleration.x * @game.Loop.updateDelta
        @velocity.y += @acceleration.y * @game.Loop.updateDelta

        @sprite.rotation += @omega * @game.Loop.updateDelta

    Debug: (turnOn = true) ->
        @DEBUG = turnOn

    AngleTo: (otherSprite) ->
        directionVector = @DirectionTo(otherSprite)
        return directionVector.angle

    DistanceTo: (otherSprite) ->
        thisVec = new Vector(@sprite.position.x, @sprite.position.y)
        otherVec = new Vector(otherSprite.position.x, otherSprite.position.y)
        otherVec.SubtractVector(thisVec)
        return otherVec.magnitude

    DirectionTo: (otherSprite) ->
        vec = new Vector( (otherSprite.position.x - @sprite.position.x), (otherSprite.position.y - @sprite.position.y) )
        vec.Normalize()
        return vec

class SizeManager
    width: 0
    height: 0
    scale: null

    constructor: (@sprite) ->
        rect = @sprite.rectangle
        @width = rect.width
        @height = rect.height
        @scale = {width: 1, height: 1}

    Update: ->
        rect = @sprite.rectangle

        rect.width = @width * @scale.width
        rect.height = @height * @scale.height

    Set: (width, height) ->
        @width = width
        @height = height

    Scale: (widthScale, heightScale) ->
        @scale.width = widthScale
        @scale.height = heightScale

class EventManager
    mouseOver: false
    clickTrigger: false
    clickAwayTrigger: false
    draw: true
    wasClicked: false

    constructor: (@sprite) ->
        @game = @sprite.game

    Update: ->
        if not @game.Mouse.GetRectangle().Intersects(@sprite.rectangle) and @mouseOver
            @mouseOver = false
            @sprite.Emit("MouseLeave", new Torch.Event(@game, {sprite: @sprite}))

        if @game.Mouse.GetRectangle(@game).Intersects(@sprite.rectangle)
            if not @mouseOver
                @sprite.Emit("MouseOver", new Torch.Event(@game, {sprite: @sprite}))
            @mouseOver = true

        else if @sprite.fixed
            mouseRec = @game.Mouse.GetRectangle()
            reComputedMouseRec = new Rectangle(mouseRec.x, mouseRec.y, mouseRec.width, mouseRec.height)
            reComputedMouseRec.x += @game.Camera.position.x
            reComputedMouseRec.y += @game.Camera.position.y
            if reComputedMouseRec.Intersects(@sprite.rectangle)
                @mouseOver = true
            else
                @mouseOver = false
        else
            @mouseOver = false

        if @mouseOver and @game.Mouse.down and not @clickTrigger
            @clickTrigger = true

        if @clickTrigger and not @game.Mouse.down and @mouseOver
            @wasClicked = true

            @sprite.Emit("Click",new Torch.Event(@game, {sprite: @sprite}))

            @clickTrigger = false

        if @clickTrigger and not @game.Mouse.down and not @mouseOver
            @clickTrigger = false

        if not @game.Mouse.down and not @mouseOver and @clickAwayTrigger
            @sprite.Emit("ClickAway", new Torch.Event(@game, {sprite: @sprite}))
            @wasClicked = false
            @clickAwayTrigger = false

        else if @clickTrigger and not @game.Mouse.down and @mouseOver
            @clickAwayTrigger = false

        else if @game.Mouse.down and not @mouseOver
            @clickAwayTrigger = true

class EffectManager
    tint: null
    mask: null

    constructor: (@sprite) ->
        @tint = {color: null, opacity: 0.5}
        @mask = {texture: null, in: false, out: false} # destination-in, destination-out

class StateMachineManager
    constructor: (@sprite) ->
        @stateMachines = {}

    CreateStateMachine: (name) ->
        @stateMachines[name] = new StateMachine(@sprite)
        return @stateMachines[name]

    GetStateMachine: (name) ->
        return @stateMachines[name]

    Update: ->
        for key,sm of @stateMachines
            sm.Update()

class GridManager
    parent: null
    children: null

    centered: false
    centerVertical: false

    alignLeft: false
    alignRight: false
    alignTop: false
    alignBottom: false

    constructor: (@sprite) ->
        @position = new Point(0,0)
        @children = []

    Align: (positionTags...) ->
        for tag in positionTags
            switch tag
                when "left"
                    @alignLeft = true
                when "right"
                    @alignRight = true
                when "top"
                    @alignTop = true
                when "bottom"
                    @alignBottom = true

    Center: (turnOn = true)->
        @centered = turnOn

    CenterVertical: (turnOn = true)->
        @centerVertical = turnOn

    Append: (sprite) ->
        sprite.Grid.parent = @sprite
        sprite.drawIndex = @sprite.drawIndex + 1
        sprite.fixed = @sprite.fixed

    Parent: ->
        return @parent

    Children: (matcher) ->
        return @children if not matcher

        children = []

        for child in @children
            matching = true
            for key,value of matcher
                if not child[key] is value
                    matching = false

            children.append(child) if matching

        return children

    Ancestors: (matcher) ->
        return null if not @parent
        ancestors = []

        ancestor = @parent

        while ancestor.Parent() isnt null
            if not matcher
                ancestors.push(ancestor)
            else
                matched = true
                for key,value of matcher
                    if ancestor[key] isnt value
                        matched = false
                ancestors.push(ancestor) if matched

            ancestor = ancestor.Parent()

    ApplyCentering: (point) ->
        if @centered
            point.x = (point.x + @parent.rectangle.width / 2) - (@sprite.rectangle.width / 2)

        if @centerVertical
            point.y = (point.y + @parent.rectangle.height / 2) - (@sprite.rectangle.height / 2)

        return point

    ApplyAlignment: (point) ->
        if @alignLeft
            point.x = 0
        if @alignRight
            point.x = point.x + (@parent.rectangle.width - @sprite.rectangle.width)
        if @alignTop
            point.y = 0
        if @alignBottom
            point.y = point.y + (@parent.rectangle.height - @sprite.rectangle.height)

        return point

    ResolveAbosolutePosition: ->
        if @parent is null
            return @sprite.position

        basePoint = @parent.position.Clone()

        basePoint = @ApplyCentering(basePoint)
        basePoint = @ApplyAlignment(basePoint)
        basePoint.Apply(@position)

        return basePoint;

    Update: ->
        @sprite.position = @ResolveAbosolutePosition()
        if @parent isnt null
            @sprite.drawIndex = @parent.drawIndex + 1
            @sprite.fixed = @parent.fixed

class Animation extends Trashable
    loop: false
    stopped: false
    intervalTime: 0
    stepTime: 0


class AnimationManager
    animations: null
    constructor: (@sprite) ->
        @animations = []

    Update: ->
        cleanedAnims = []
        for anim in @animations
            anim.Update()
            cleanedAnims.push(anim) if not anim.trash
        @animations = cleanedAnims

    SpriteSheet: (width, height, numberOfFrames, config = {step: 200}) ->
        anim = new SpriteSheetAnimation(@sprite, width, height, numberOfFrames, config.step)
        @animations.push( anim )
        return anim

class SpriteSheetAnimation extends Animation
    index: -1
    clipX: 0
    clipY: 0
    game: null
    clipWidth: null
    clipHeight: null
    numberOfFrames: null
    stepTime: null

    constructor: (@sprite, @clipWidth, @clipHeight, @numberOfFrames, @stepTime) ->
        @loop = true
        @game = @sprite.game
        @Reset()

    Update: ->
        return if @stopped
        @intervalTime += @game.Loop.updateDelta

        if @intervalTime >= @stepTime
            @AdvanceFrame()

    AdvanceFrame: ->
        @intervalTime = 0
        @index += 1

        @sprite.DrawTexture.drawParams.clipX = @index * @clipWidth

        if @index >= @numberOfFrames - 1

            if @loop
                @index = -1
            else
                @Trash()

    Stop: ->
        @stopped = true

    Start: ->
        @stopped = false

    Index: (index) ->
        @index = index - 1
        @sprite.DrawTexture.drawParams.clipX = ( @index + 1) * @clipWidth

    Reset: ->
        @intervalTime = 0
        @index = -1

        @sprite.DrawTexture.drawParams.clipX = 0
        @sprite.DrawTexture.drawParams.clipY = 0
        @sprite.DrawTexture.drawParams.clipWidth = @clipWidth
        @sprite.DrawTexture.drawParams.clipHeight = @clipHeight
        @sprite.Size.width = @clipWidth
        @sprite.Size.height = @clipHeight

    SyncFrame: ->
        @sprite.DrawTexture.drawParams.clipX = 0
        @sprite.DrawTexture.drawParams.clipY = 0
        @sprite.DrawTexture.drawParams.clipWidth = @clipWidth
        @sprite.DrawTexture.drawParams.clipHeight = @clipHeight
        @sprite.Size.width = @clipWidth
        @sprite.Size.height = @clipHeight

class Sprite
    Sprite.MixIn(EventDispatcher)
          .MixIn(Trashable)

    constructor: (game, x, y)->
        @InitSprite(game, x, y)

    InitSprite: (game, x = 0, y = 0)->
        if game is null or game is undefined
            Torch.FatalError("Unable to initialize sprite without game")

        @InitEventDispatch()
        @game = game

        @rectangle = new Rectangle(x, y, 0, 0)
        @position = new Point(x,y)

        @Bind = new Bind(@)
        @Collisions = new CollisionManager(@)
        @Body = new BodyManager(@)
        @Size = new SizeManager(@)
        @Events = new EventManager(@)
        @Effects = new EffectManager(@)
        @States = new StateMachineManager(@)
        @Grid = new GridManager(@)
        @Animations = new AnimationManager(@)

        @DrawTexture = null
        @TexturePack = null
        @TextureSheet = null
        @TextureSimple = null

        @fixed = false
        @draw = true

        @drawIndex = 0
        @rotation = 0
        @opacity = 1

        @_torch_add = "Sprite"
        @_torch_uid = ""

        @events = {}
        @renderer = new CanvasRenderer(@)

        game.Add(@)

    UpdateSprite: ->
        @Body.Update()
        @Size.Update()
        @Events.Update()
        @States.Update()
        @Grid.Update()
        @Animations.Update()

        @rectangle.x = @position.x
        @rectangle.y = @position.y

        @Collisions.Update() # this needs to be after the rectangle thing, God knows why

    Update: ->
        @UpdateSprite()

    Draw: ->
        @renderer.Draw()

    GetCurrentDraw: ->
        if @TexturePack
            return @TexturePackAnimation.GetCurrentFrame()

        else if @TextureSheet
            return @TextureSheetAnimation.GetCurrentFrame()

        else if @DrawTexture
            return @DrawTexture

    Clone: (args...) ->
        proto = @constructor
        return new proto(args...)

    NotSelf: (otherSprite) ->
        return (otherSprite._torch_uid isnt @_torch_uid)

    Center: ->
        width = @game.canvasNode.width
        x = (width / 2) - (@rectangle.width/2)
        @position.x = x
        return @

    CenterVertical: ->
        height = @game.canvasNode.height
        y = (height / 2) - (@rectangle.height/2)
        @position.y = y
        return @

    CollidesWith: (otherSprite) ->
        return new CollisionDetector(@, otherSprite)
###
gonna kill this...
###
class GhostSprite extends Sprite
    GHOST_SPRITE: true

if document?
    _measureCanvas = document.createElement("CANVAS")
    _measureCanvas.width = 500
    _measureCanvas.height = 500
else
    _measureCanvas =
        getContext: ->

class Text extends Sprite
    TEXT: true
    @measureCanvas: _measureCanvas.getContext("2d")

    constructor: (game, x, y, data) ->
        @InitText(game, x, y, data)

    InitText: (game, x, y, data) ->
        @InitSprite(game,x,y)
        @data = data
        @font = "Arial"
        @fontSize = 16
        @fontWeight = ""
        @color = "#2b4531"
        @text = ""
        @lastText = ""
        @width = 100
        @height = 100
        @Size.scale = {width: 1, height: 1}
        @Init()

    Init: ->
        if @data.font            then @font =           @data.font
        if @data.fontSize        then @fontSize =       @data.fontSize
        if @data.fontWeight      then @fontWeight =     @data.fontWeight
        if @data.color           then @color =          @data.color
        if @data.text            then @text =           @data.text
        if @data.rectangle       then @rectangle =      @data.rectangle
        if @data.buffHeight      then @buffHeight =     @data.buffHeight

        @Render()

    Render: ->
        cnv = document.createElement("CANVAS")
        Text.measureCanvas.font = @fontSize + "px " + @font
        cnv.width = Text.measureCanvas.measureText(@text).width
        cnv.height = @fontSize

        if @buffHeight
            cnv.height += @buffHeight

        canvas = cnv.getContext("2d")
        canvas.fillStyle = @color
        canvas.font = @fontWeight + " " + @fontSize + "px " + @font
        canvas.fillText(@text,0,cnv.height)

        # generate the image
        image = new Image()
        image.src = cnv.toDataURL()
        image.onload = =>
            if @GL
                # we need to get rid of the old one
                if @Three() then @Three().Remove()

                @Bind.WebGLTexture
                            gl_2d_canvas_generated_image: true
                            width: image.width
                            height: image.height
                            texture: new THREE.TextureLoader().load( image.src )
            else
                @Bind.Texture(image)

        @rectangle.width = cnv.width
        @rectangle.height = @fontSize

    Update: ->
        super()
        @UpdateText()

    UpdateText: ->
        if @text isnt @lastText
            @Render()
            @lastText = @text

class SpriteGroup
    constructor: (@sprites = [], @game) ->
        for sprite in @sprites
            sprite.anchorX = sprite.Rectangle.x
        return @

    Factory: (spriteClass) ->
        @spriteFactory = spriteClass
        return @

    Add: (sprites, x, y, args...) ->
        if sprites is null or sprites is undefined and @spriteFactory isnt undefined
            newSprite = new @spriteFactory(@game, x, y, args...)
            @sprites.push(newSprite)
            return newSprite
        else
            @sprites = @sprites.concat(sprites)
        return @

    Trash: ->
        for sprite in @sprites then sprite.Trash()
        return @

    Shift: (transition) ->
        for sprite in @sprites
            if transition.x
                sprite.Rectangle.x = sprite.anchorX + transition.x
                #if (transition.y) sprite.Rectangle.y = sprite.Rectangle.y + transition.y;

    Hide: ->
        for sprite in @sprites then sprite.draw = false
        return @

    Show: ->
        for sprite in @sprites then sprite.draw = true
        return @

    Center: ->
        for sprite in @sprites then sprite.Center()
        return @

    ToggleFixed: ->
        for sprite in @sprites then sprite.ToggleFixed()
        return @

class SpriteGrid
    constructor: (@game, @gridXml) ->
        @ParseXml()

    ParseXml: ->
        parser = new DOMParser()
        xmlDoc = parser.parseFromString(@gridXml, "text/xml")

        root = xmlDoc.getElementsByTagName("SpriteGrid")[0]

        if root is null
            @game.FatalError("Unable to parse SpriteGrid XML, no SpriteGrid tag")

        sprites = root.getElementsByTagName("Sprite")

        #for sprite in sprites
            # TODO make stuff happen here

class CollisionDetector
    constructor: (@sprite, @otherSprite) ->

    AABB: ->
        return new AABB(@sprite, @otherSprite).Execute()

    Circle: ->
        return new Circle(@sprite, @otherSprite).Execute()

    SAT: ->
        return new SAT(@sprite, @otherSprite).Execute()

class AABB
    constructor: (@sprite, @otherSprite) ->

    Execute: ->
        return @sprite.rectangle.Intersects(@otherSprite.rectangle)

class Circle
    constructor: (@sprite, @otherSprite) ->

    Execute: ->
        circle1 =
            radius: @sprite.Width()
            x: @sprite.Position("x")
            y: @sprite.Position("y")

        circle2 =
            radius: @otherSprite.Width()
            x: @otherSprite.Position("x")
            y: @otherSprite.Position("y")

        dx = circle1.x - circle2.x
        dy = circle1.y - circle2.y
        distance = Math.sqrt(dx * dx + dy * dy)

        if distance < circle1.radius + circle2.radius
            #collision detected!
            return true
        return false


Collision =
    AABB: 1
    Circle: 2
    SAT: 3

class CollisionManager
    mode: Collision.AABB
    sprite: null
    filter: null
    limit: null
    enabled: false

    constructor: (@sprite) ->
        @filter = {}
        @game = @sprite.game

    Monitor: ->
        @enabled = true

    NotFiltered: (sprite) ->
        # evaluate the sprite to see if it is filtered out
        # by comparing its attributes with filter objects

        # check game-wide filters
        for key,value of @game.filter
            # check special flag
            if key is "__type__"
                return false if value.constructor.name is sprite.constructor.name
            else
                return false if value is sprite[key]

        # check sprite-specific filters
        for key,value of @filter
            # check special flag
            if key is "__type__"
                return false if value.constructor.name is sprite.constructor.name
            else
                return false if value is sprite[key]

        return true

    InLimit: (sprite) ->
        # evaluate sprite to make sure it has attributes
        # that match limit object

        # check sprite-specific limits
        for key,value of @limit
            # check special flag
            if key is "__type__"
                return true if value.constructor.name is sprite.constructor.name
            else
                return true if value is sprite[key]

        return false

    Valid: (sprite) ->
        if @limit isnt null
            return @InLimit(sprite)

        return @NotFiltered(sprite)

    Filter: (_filter) ->
        @filter = _filter

    Limit: (_limit) ->
        @limit = _limit

    Mode: (_mode) ->
        mode = _mode

    Update: ->
        return if not @sprite.game or not @enabled
        @game = @sprite.game
        anyCollisions = false

        for otherSprite in @game.spriteList
            if @sprite.NotSelf(otherSprite) and @Valid(otherSprite)
                collisionDetected = false
                collisionData = {}
                switch @mode
                    when Collision.AABB
                        collisionData = @sprite.CollidesWith(otherSprite).AABB()
                        collisionDetected = collisionData isnt false

                if collisionDetected
                    collisionData.self = @sprite
                    collisionData.collider = otherSprite
                    anyCollisions == true
                    @sprite.Emit("Collision", new Torch.Event(@game, {collisionData: collisionData}))

        @sprite.Emit("NoCollision", new Torch.Event(@game, {}))


    SimpleCollisionHandle: (event, sink = 1) ->
        offset = event.collisionData
        touching = {left: false, right: false, top: false, bottom: false}
        if offset.vx < offset.halfWidths and offset.vy < offset.halfHeights
            if offset.x < offset.y

                if offset.vx > 0
                    event.collisionData.self.position.x += offset.x * sink
                    touching.left = true
                    #colDir = "l"
                else if offset.vx < 0
                    #colDir = "r"
                    event.collisionData.self.position.x -= offset.x * sink
                    touching.right = true

            else if offset.x > offset.y

                if offset.vy > 0
                    #colDir = "t"
                    event.collisionData.self.position.y += offset.y * sink
                    touching.top = true

                else if  offset.vy < 0
                    #colDir = "b"
                    event.collisionData.self.position.y -= offset.y * sink
                    touching.bottom = true

        return touching

class Loop
    constructor: (@game) ->
        @fps = 50
        @frameTime = 1000/@fps
        @lag = 0
        @updateDelta = 0
        @drawDelta = 0
        @lagOffset
    Update: ->
        @game.update(@)

        @game.Camera.Update()
        @game.Timer.Update()
        @game.Debug.Update()
        @game.Tweens.Update()

        @game.UpdateAnimations()
        @game.UpdateTimeInfo()
        @game.UpdateTasks()
        @game.UpdateGamePads()
        @game.UpdateSprites()

    Draw: ->
        @game.draw(@)
        @game.DrawSprites()


    AdvanceFrame: (timestamp) ->
        if @game.time is undefined
            @game.time = timestamp

        @game.deltaTime = Math.round(timestamp - @game.time)
        @game.time = timestamp
        elapsed = @game.deltaTime
        @drawDelta = elapsed
        @updateDelta = @frameTime

        if elapsed > 1000
            elapsed = @frameTime

        @lag += elapsed

        while @lag >= @frameTime
            @Update()

            @lag -= @frameTime

        @lagOffset = @lag / @frameTime

        @Draw()

        window.requestAnimationFrame (timestamp) =>
            @AdvanceFrame(timestamp)

    Run: (timestamp) ->
        @AdvanceFrame(0)

class Load
    constructor: (@game) ->
        @game.Assets =
            game: @game
            GetTexture: (id) -> return @game.Assets.Textures[id]

            GetTexturePack: (id) ->return @game.Assets.TexturePacks[id]

            GetTextureSheet: (id) ->return @game.Assets.TextureSheets[id]

            GetSound: (id) ->return @game.Assets.Sounds[id].audio

        @game.Files = {}
        @textures = @game.Assets.Textures = {}
        @texturePacks = @game.Assets.TexturePacks = {}
        @textureSheets = @game.Assets.TextureSheets = {}
        @sound = @game.Assets.Sounds = {}
        @audio = @game.Assets.Audio = {}
        @Stack = []
        @finish_stack = 0
        @progress = 0
        @loaded = false
        @loadLog = ""

    Sound: (path, id) ->

        if @sound[id]
            Torch.Error("Asset ID '" + id + "' already exists")

        @Stack.push
            _torch_asset: "sound"
            id: id
            path: path

        @finish_stack++;

    Audio: (path, id) ->

        if @audio[id]
            Torch.Error("Asset ID '" + id + "' already exists")

        @Stack.push
            _torch_asset: "audio"
            id: id
            path: path

        @finish_stack++

    Texture: (path, id) ->
        if typeof(path) is "string"

            @Stack.push
                _torch_asset: "texture"
                id: id
                path: path
            @finish_stack++

        else
            for p,i in path
                @Texture(path[i][0], path[i][1]);

    PixlTexture: (pattern, pallette, id) ->
        imSrc = pixl(pattern, pallette).src
        @Stack.push
            _torch_asset: "texture"
            id: id
            path: imSrc

    TexturePack: (path, id, range, fileType) ->
        pack = []
        i = 1 # this might be the bug
        while i <= range
            packPath = path + "_" + i.toString() + "." + fileType
            packId = id + "_" + i.toString()

            @Stack.push
                _torch_asset: "texture"
                id: packId
                path: packPath

            pack.push(packId)

            @finish_stack++;
            i++

        @texturePacks[id] = pack;

    TextureSheet: (path, id, totalWidth, totalHeight, clipWidth, clipHeight) ->
        totalWidth += clipWidth
        rows = totalHeight / clipHeight
        columns = totalWidth / clipWidth
        sheet = []

        @Stack.push
            _torch_asset: "texture"
            id: id
            path: path

        i = j = 0

        while i < columns

            while j < rows
                sheetClip =
                    clipX: i * clipWidth
                    clipY: j * clipHeight
                    clipWidth: clipWidth
                    clipHeight: clipHeight
                sheet.push(sheetClip)

                j++
            i++

        @textureSheets[id] = sheet;

    File: (path, id) ->
        @finish_stack++
        @Stack.push
            _torch_asset: "file"
            id: id
            path: path

    LoadItemFinished: ->
        @finish_stack--

        @progress = (@totalLoad - @finish_stack) / @totalLoad

        # could potentially listen in to update some sort of loading
        # bar
        @game.Emit "LoadProgressed", new Torch.Event @game,
            progress: @progress

        if @finish_stack <= 0
            # load has finished
            document.getElementsByClassName("font-loader")[0].remove()

            @loadFinished()

            timeToLoad = (new Date().getTime() - @startTime) / 1000

            # successful load
            console.log("%c#{@game.name} loaded in #{timeToLoad}s", "background-color:green; color:white; padding:2px;padding-right:5px;padding-left:5px")

    Load: (finishFunction) ->
        @loadFinished = finishFunction
        @totalLoad = @finish_stack
        @startTime = new Date().getTime()

        try
            for stackItem in @Stack

                switch stackItem._torch_asset

                    when "texture"
                        im = new Image()
                        im.src = stackItem.path

                        stackItem.image = im

                        @textures[stackItem.id] = stackItem

                        im.refId = stackItem.id
                        im.stackItem = stackItem
                        im.loader = this

                        im.onload = ->
                            this.loader.textures[this.stackItem.id].width = this.width
                            this.loader.textures[this.stackItem.id].height = this.height

                            this.loader.LoadItemFinished()

                    when "sound"
                        aud = new Audio()
                        aud.src = stackItem.path
                        stackItem.audio = aud
                        @sound[stackItem.id] = stackItem
                        @LoadItemFinished()
                        aud.toggle = ->
                            @currentTime = 0
                            @play()

                    when "audio"
                        loader = new Torch.AjaxLoader(stackItem.path, Torch.AjaxData.ArrayBuffer)
                        loader.stackItem = stackItem
                        loader.Finish (data, loader) =>
                            @audio[loader.stackItem.id] = {}
                            @audio[loader.stackItem.id].encodedAudioData = data
                            @game.Audio.DecodeAudioData data, (buffer) =>
                                @audio[loader.stackItem.id].audioData = buffer
                                @LoadItemFinished()
                        loader.Load()

                    when "file"
                        if not Torch.ELECTRON
                            # @game.FatalError(new Error("Torch.Load.File file '{0}' cannot be loaded, you must import Torch.Electron".format(path)))
                            # load with ajax instead
                            loader = new Torch.AjaxLoader(stackItem.path, Torch.AjaxData.Text)
                            loader.stackItem = stackItem
                            loader.Finish (data, loader) =>
                                @LoadItemFinished()
                                @game.Files[loader.stackItem.id] = data
                            loader.Load()
                        else
                            Torch.fs.readFile stackItem.path, 'utf8', (er, data) =>
                                @LoadItemFinished()
                                if (er)
                                    @game.FatalError(new Error("Torch.Load.File file '{0}' could not be loaded".format(stackItem.path)))
                                else
                                    @game.Files[stackItem.id] = data

        catch e
            console.log("%c#{@game.name} could not load!", "background-color:#{Color.Ruby}; color:white; padding:2px;padding-right:5px;padding-left:5px")
            Torch.FatalError(e)

class Timer
    constructor: (@game)->
        @futureEvents = []
    Update: ->
        for event in @futureEvents
            event.Update()
    SetFutureEvent: (timeToOccur, handle) ->
        @futureEvents.push( new FutureEvent(timeToOccur, handle, @game) )

class FutureEvent
    constructor: (@timeToOccur, @handle, @game) ->
        @time = 0
    Update: ->
        @time += @game.deltaTime
        if @time >= @timeToOccur
            if @handle isnt null and @handle isnt undefined
                @handle()
                @handle = null

class Mouse
    constructor: (@game) ->
        @x = 0
        @y = 0
        @down = false

    SetMousePos: (c, evt) ->
        rect = c.getBoundingClientRect()
        @x = evt.clientX - rect.left
        @y = evt.clientY - rect.top

    GetRectangle: ->
        return new Rectangle(@x, @y, 5, 5);

class Camera
    position: null
    _jerkFollow: null
    constructor: (@game) ->
        @position = new Point(0,0)
        @Viewport = new Viewport(@)

    JerkFollow: (sprite, offset = 5, config) ->
        if not config?
            config =
                maxLeft: -500
                maxRight: 2000
                maxTop: -500
                maxBottom: 2000

        @_jerkFollow = new JerkFollow(@, sprite, offset, config)

    Update: ->
        @Viewport.Update()

        if @_jerkFollow?
            @_jerkFollow.Update()

class Viewport
    width: 0
    height: 0
    maxWidth: 0
    maxHeight: 0
    constructor: (@camera) ->
        @maxWidth = @width = window.innerWidth
        @maxHeight = @height = window.innerHeight
        @rectangle = new Rectangle(@camera.position.x, @camera.position.y, @width, @height)

    Update: ->
        @rectangle.x = @camera.position.x
        @rectangle.y = @camera.position.y
        @rectangle.width = @width
        @rectangle.height = @height

class JerkFollow
    boundLeft: 0
    boundRight: 0
    boundTop: 0
    boundBottom: 0
    Inc: 0

    constructor: (@camera, @sprite, offset, @config) ->
        v = @camera.Viewport
        @game = @camera.game
        @Inc = v.width / offset
        @boundLeft = v.width / offset
        @boundRight = v.width - @boundLeft
        @boundTop = 0

    Update: ->
        if @sprite.position.x >= @boundRight

            if @sprite.position.x >= @config.maxRight
                @sprite.position.x = @boundRight
                return

            @boundRight += @Inc
            @boundLeft += @Inc

            @game.Tweens.Tween( @camera.position, 500, Torch.Easing.Smooth ).To({x: @camera.position.x - @Inc})

        if @sprite.position.x <= @boundLeft

            if @sprite.position.x <= @config.maxLeft
                @sprite.position.x = @boundLeft
                return

            @boundRight -= @Inc
            @boundLeft -= @Inc

            @game.Tweens.Tween( @camera.position, 500, Torch.Easing.Smooth ).To({x: @camera.position.x + @Inc})

        if @sprite.position.y <= @boundTop

            if @sprite.position.y <= @config.maxTop
                @sprite.position.y = @boundTop
                return

            @boundTop -= @Inc
            @boundBottom -= @Inc

            @game.Tweens.Tween( @camera.position, 500, Torch.Easing.Smooth ).To({x: @camera.position.y + @Inc})

class Layer
    constructor: (@drawIndex)->
        @children = []
        @mapIndex - @drawIndex

    DrawIndex: (index) ->
        return @drawIndex if not index

        @drawIndex = index
        for child in @children
            child.DrawIndex(index)

        return @

    Add: (child) ->
        child.DrawIndex(@index)
        @children.push(child)

class Layers
    constructor: (@game) ->
        @layers = []
        @layerMap = {}

    Add: (layerName) ->
        layer = null
        if typeof layerName is "string"
            layer = new Layer( @layers.length )
            @layerName[layerName] = layer
            @layers.add( layer )
        else
            for name in layerName
                layer = new Layer( @layers.length )
                @layerMap[name] = layer
                @layers.add( layer )

    Remove: (layerName, tryToFill) ->
        if not @layerMap[layerName]
            Torch.FatalError("Unable to remove layer '#{ layerName }'. Layer does not exist")

        else
            cleanedLayers = []
            layer = layerMap[layerName]
            layer.Trash()

            delete @layerMap[layerName]

            for item,index in @layers
                l = cleanedLayers[index]

                if index isnt layer.mapIndex
                    cleanedLayers.push(l)
                    l.DrawIndex( l.DrawIndex() - 1 ) if tryToFill


    Get: (layerName) ->
        if not @layerMap[layerName]
            Torch.FatalError("Unable to get layer '#{ layerName }'. Layer does not exist")

        else return @layerMap[layerName]

Style = ->

    # a few style fixes to get around having a css file

    body = document.body

    body.style.backgroundColor = "black"
    body.style.overflow = "hidden"

    canvas = document.getElementsByTagName("CANVAS")[0]
    canvas.style.border = "1px solid orange"

    canvas.style.cursor = "pointer"

class Debug
    constructor: (@game) ->
        @text = ""
        @CreateHtmlDisplay()

    CreateHtmlDisplay: ->
        display = document.createElement("DIV")
        display.style.position = "absolute"
        display.style.display = "block"
        display.style.color = "white"
        display.style.font = "monospace"
        display.style.top = 0
        document.body.appendChild(display)
        @display = display

    Update: ->
        # @display.innerHTML = @text
        #
        # @text = @game.name + " Debug Info: <br />"
        # @text += "fps: "  + @game.fps

class Key
    Key.MixIn(EventDispatcher)

    down : false
    constructor: (@keyCode) ->
        @InitEventDispatch()



class Keys
    Keys.MixIn(EventDispatcher)

    constructor: ->
        @specialKeys =
            8: "Delete"
            9: "Tab"
            13: "Enter"
            16: "Shift"
            17: "Control"
            18: "Alt"
            19: "PauseBreak"
            20: "CapsLock"
            27: "Escape"
            32: "Space"
            33: "PageUp"
            34: "PageDown"
            35: "End"
            36: "Home"
            37: "LeftArrow"
            38: "UpArrow"
            39: "RightArrow"
            40: "DownArrow"
            45: "Insert"
            46: "Delete2"
            48: "Num0"
            49: "Num1"
            50: "Num2"
            51: "Num3"
            52: "Num4"
            53: "Num5"
            54: "Num6"
            55: "Num7"
            56: "Num8"
            57: "Num9"
            96: "NumPad0"
            97: "NumPad1"
            98: "NumPad2"
            99: "NumPad3"
            100: "NumPad4"
            101: "NumPad5"
            102: "NumPad6"
            103: "NumPad7"
            104: "NumPad8"
            105: "NumPad9"
            106: "NumPadMultiply"
            107: "NumPadPlus"
            109: "NumPadMinus"
            110: "NumPadPeriod"
            111: "NumPadDivide"
            112: "F1"
            113: "F2"
            114: "F3"
            115: "F4"
            116: "F5"
            117: "F6"
            118: "F7"
            119: "F8"
            120: "F9"
            121: "F10"
            122: "F11"
            123: "F12"
            144: "NumLock"
            145: "ScrollLock"
            186: "Colon"
            187: "NumPlus"
            188: "Comma"
            189: "NumMinus"
            190: "Period"
            191: "ForwardSlash"
            192: "Tilda"
            219: "BracketLeft"
            221: "BracketRight"
            220: "BackSlash"
            222: "Quote"

        @InitKeys()

    SpecialKey: (keyCode) ->
        for key,value of @specialKeys
            if keyCode.toString() is key.toString()
                return @[value]

        return null

    InitKeys: ->
        _keys = @
        i = 0
        while i < 230
            _char = String.fromCharCode(i).toUpperCase()
            _keys[_char] = new Key(i)
            i++

        for keyCode,value of @specialKeys
            _keys[value] = new Key(keyCode)

class Tween
    @MixIn Trashable
    @MixIn EventDispatcher
    objectToTween: null
    tweenProperties: null
    originalObjectValues: null
    elapsedTime: 0
    timeTweenShouldTake: 0
    easing: null

    constructor: (@game, @objectToTween, @tweenProperties, @timeTweenShouldTake, @easing) ->
        @InitEventDispatch()
        @game.Tweens.tweens.push(@)
        @originalObjectValues = {}

        for key,value of @tweenProperties
            @originalObjectValues[key] = @objectToTween[key]
    Update: ->
        normalizedTime = @elapsedTime / @timeTweenShouldTake
        easedTime = @Ease(normalizedTime)

        for key,value of @tweenProperties
            @objectToTween[key] = (@tweenProperties[key] * easedTime) + (@originalObjectValues[key] * (1 - easedTime))

        @elapsedTime += @game.Loop.updateDelta
        if @elapsedTime >= @timeTweenShouldTake
            @Emit "Finish", new Torch.Event(@game, {tween: @})
            @Trash()

    Ease: (normalizedTime) ->
        switch @easing
            when Torch.Easing.Linear
                return normalizedTime

            when Torch.Easing.Square
                return Math.pow(normalizedTime, 2)

            when Torch.Easing.Cube
                return Math.pow(normalizedTime, 3)

            when Torch.Easing.InverseSquare
                return 1 - Math.pow(1 - normalizedTime, 2)

            when Torch.Easing.InverseCube
                return 1 - Math.pow(1 - normalizedTime, 3)

            when Torch.Easing.Smooth
                return normalizedTime * normalizedTime * (3 - 2 * normalizedTime)

            when Torch.Easing.SmoothSquare
                return Math.pow( ( normalizedTime * normalizedTime * ( (3 - 2 * normalizedTime) ) ), 2 )

            when Torch.Easing.SmoothCube
                return Math.pow( ( normalizedTime * normalizedTime * ( (3 - 2 * normalizedTime) ) ), 3 )

            when Torch.Easing.Sine
                return Math.sin(normalizedTime * Math.PI / 2)

            when Torch.Easing.InverseSine
                return 1 - Math.sin( (1 - normalizedTime) * Math.PI / 2 )

class TweenSetup
    constructor: (@game, @object, @timeTweenShouldTake, @easing = Torch.Easing.Smooth) ->

    To: (tweenProperties) ->
        return new Tween(@game, @object, tweenProperties, @timeTweenShouldTake, @easing)

    From: (setProperties) ->
        for key,value of setProperties
            @object[key] = value
        return @

class TweenManager
    constructor: (@game) ->
        @tweens = []

    Update: ->
        cleanedTweens = []
        for tween in @tweens
            if not tween.trash
                cleanedTweens.push(tween)
                tween.Update()

    Tween: (object, timeTweenShouldTake) ->
        return new TweenSetup(@game, object, timeTweenShouldTake)

    All: (callback) ->
        for tween in @game.tweens
            callback(tween)

# # objects or primitives
# game.Tween(sprite.position, 500).To({x: 500, y: 500})
# # or set the properties before tweening
# game.Tween.(sprite.opacity, 500).From(0).To(1)

class ParticleEmitter extends Sprite
    particle: null
    auto: true
    constructor: (@game, x, y, @interval, @loop, @particle, @config) ->
        @InitSprite(@game, x, y)
        @elapsedTime = 0
        @hasEmitted = false

    Update: ->
        super()
        if @interval isnt undefined
            if @hasEmitted
                if @loop then @UpdateParticleEmitter()
            else @UpdateParticleEmitter()


    Particle: (particle) ->
        particle = particle

    UpdateParticleEmitter: ->
        return if not @auto
        @elapsedTime += @game.Loop.updateDelta

        if @elapsedTime >= @interval
            @EmitParticles()
            @hasEmitted = true
            @elapsedTime = 0

    EmitParticles: (removeEmitterWhenDone = false) ->
        i = 0
        while i < @config.spread
            i++
            @EmitParticle()

        if removeEmitterWhenDone then @Trash()

    EmitParticle: ()->
        angle = Torch.Util.Math().RandomInRange(@config.minAngle, @config.maxAngle)
        scale = Torch.Util.Math().RandomInRange(@config.minScale, @config.maxScale)
        alphaDecay = Torch.Util.Math().RandomInRange(@config.minAlphaDecay, @config.maxAlphaDecay)
        radius = Torch.Util.Math().RandomInRange(@config.minRadius, @config.maxRadius)
        x = @position.x
        y = @position.y

        if typeof @particle isnt "string"
            p = new @particle(@game, x, y)
        else
            p = new Sprite(@game, x, y)
            p.Bind.Texture(@particle)

        #p.Body.acceleration.y = @config.gravity
        p.Body.velocity.x = Math.cos(angle) * Torch.Util.Math().RandomInRange(@config.minVelocity, @config.maxVelocity)
        p.Body.velocity.y = Math.sin(angle) * Torch.Util.Math().RandomInRange(@config.minVelocity, @config.maxVelocity)
        p.Body.omega = Torch.Util.Math().RandomInRange(@config.minOmega, @config.maxOmega)
        p.Size.scale.width = scale
        p.Size.scale.height = scale
        p.drawIndex = 1000

        @game.Tweens.Tween(p, alphaDecay, Torch.Easing.Smooth)
            .To({opacity: 0})
            .On "Finish", ->
                p.Trash()

class ParticleManager
    constructor: (@game) ->

    ParticleEmitter: (x, y, interval, shouldLoop, particle, config)->
        return new ParticleEmitter(@game, x, y, interval, shouldLoop, particle, config)


# # usage
# emitter = new Torch.ParticleEmitter game, 0, 0, 1000, true,
#     spread: 20
#     gravity: 0.1
#     minRadius: 1
#     maxRadius: 2
#     minAngle: 0
#     maxAngle: Math.PI * 2
#     minScale: 1
#     maxScale: 2
#     minVelocity: 1
#     maxVelocity: 2
#     minAlphaDecay: 100
#     maxAlphaDecay: 200
#     minOmega: 1
#     maxOmega: 2
# emitter.Particle EffectPieces.Fire, (particle) ->
#     # do something to the particle when it's emitted
#
#
# emitter.Body.velocity.x = 5

class Sound
    volume: 1
    pan: 0
    constructor: (@soundId) ->
class Audio
    audioContext: null
    MasterVolume: 1
    constructor: (@game) ->
        @GetAudioContext()

    GetAudioContext: ->
        try
            window.AudioContext = window.AudioContext or window.webkitAudioContext;
            @audioContext = new AudioContext()

        catch e
            console.warn("Unable to initialize audio...")

    DecodeAudioData: (data, callback) ->
        @audioContext.decodeAudioData data, (buffer) ->
            callback(buffer)

    CreateAudioPlayer: ->
        return new AudioPlayer(@)

class AudioPlayer
    volume: 1
    constructor: (aud) ->
        @audioContext = aud.audioContext
        @game = aud.game

    CreateGain: (gain = 1) ->
        gainNode = @audioContext.createGain()
        gainNode.gain.value = gain
        return gainNode

    Play: (sound) ->
        @game.FatalError("Cannot play sound. sound must be Torch.Sound")

    PlaySound: (id, time = 0, filters = null) ->
        source = @audioContext.createBufferSource()
        source.buffer = @game.Assets.Audio[id].audioData

        if @game.Audio.MasterVolume isnt 1
            if filters is null
                filters = [@CreateGain(@game.Audio.MasterVolume)]
            else
                filters.push(@CreateGain(@game.Audio.MasterVolume))

        if filters is null
            filters = [@CreateGain(@volume)]
        else
            filters = [filters..., @CreateGain(@volume)]

        lastFilter = null

        for filter,index in filters
            if lastFilter is null
                source.connect(filter)
            else
                lastFilter.connect(filter)

            lastFilter = filter

            if index is filters.length - 1
                filter.connect(@audioContext.destination)
                source.start(time)
                return

        source.connect(@audioContext.destination)
        source.start(time)

class HookManager
    positionTransform: null

    constructor: (@game) ->
        @positionTransform = new Point(0,0)

class CanvasGame

    constructor: (@canvasId, @width, @height, @name, @graphicsType, @pixel = 0) ->
        @InitGame()

    CanvasGame.MixIn(EventDispatcher)

    InitGame: ->
        @InitEventDispatch()
        @InitGraphics()
        @InitComponents()

    InitComponents: ->
        styleString = "background-color:orange; color:white; padding:2px; padding-right:5px;padding-left:5px"
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
                if not sprite.game.paused
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

class Game
    constructor: (canvasId, width, height, name, graphicsType, pixel) ->

        return new Torch.CanvasGame(canvasId, width, height, name, graphicsType, pixel) if graphicsType is Torch.CANVAS
        return new Torch.WebGLGame(canvasId, width, height, name, graphicsType, pixel)  if graphicsType is Torch.WEBGL

Game = CanvasGame

class StateMachine
    constructor: (@obj) ->
        @currentState = null
        @states = {}
        @game = @obj.game

    State: (stateName, stateObj) ->
        if stateObj is undefined

            if @states[stateName] is undefined
                Torch.FatalError("Unable to get state. State '#{stateName}' has not been added to the state machine")
            return @states[stateName]

        else
            stateObj.stateMachine = @
            stateObj.game = @game
            @states[stateName] = stateObj

    Switch: (newState, args...) ->
        if @currentState and @currentState.End isnt undefined
            @currentState.End(@obj, args...)

        if @State(newState).Start isnt undefined
            @State(newState).Start(@obj, args...);

        @currentState = @State(newState);

    Update: ->
        if @currentState isnt null and @currentState isnt undefined
            @currentState.Execute(@obj);

class State
    constructor: (@Execute, @Start, @End) ->

class Bind
    constructor: (sprite) ->
        return new WebGLBind(sprite) if sprite.GL
        return new CanvasBind(sprite)



class CanvasBind
    constructor: (@sprite) ->

    Texture: (textureId, optionalParameters) ->
        tex = null
        if typeof(textureId) is "string"
            tex = @sprite.game.Assets.Textures[textureId]
            if not tex
                @sprite.game.FatalError("Sprite.Bind.Texture given textureId '#{textureId}' was not found")
        else
            tex = textureId

        scale = 1

        # if Torch.Scale and not @sprite.TEXT
        #     @sprite.Size.Scale(Torch.Scale, Torch.Scale)

        if typeof(textureId) is "string"
            @sprite.DrawTexture = tex
        else
            @sprite.DrawTexture = {image:textureId}

        @sprite.Size.Set(tex.width, tex.height)
        @sprite.DrawTexture.drawParams =
            clipX: 0
            clipY: 0
            clipWidth: @sprite.DrawTexture.image.width
            clipHeight: @sprite.DrawTexture.image.height

        return @sprite.DrawTexture

class Color
    constructor: (rOrHex, g, b, a) ->
        @hex = ""
        @Red = 0
        @Green = 0
        @Blue = 0
        @Alpha = 1
        @Init(rOrHex, g, b, a)

    Init: (rOrHex, g, b, a) ->
        if g is undefined and g isnt null
            #rgba values
            @GetHexFromRGB(rOrHex, g, b, a)
        else
            #html color hash
            @GetRGBFromHex(rOrHex)

    GetHexadecimal: (dec, a) ->
        hexa = Math.round(dec * a).toString(16)
        if hexa.length is 1
            hexa = "0" + hexa
        return hexa

    GetHexFromRGB: (r, g, b, a) ->
        @Red = r
        @Green = g
        @Blue = b
        @Alpha = a
        @hex = "#" + @GetHexadecimal(r,a) + @GetHexadecimal(g,a) + @GetHexadecimal(b,a)

    GetRGBFromHex: ->
        # @hex = hex.split("#")[1]
        # hexRed = @hex.slice(0,2)
        # hexGreen = @hex.slice(2,4)
        # hexBlue = @hex.slice(4,6)
        # @Red = parseInt(hexRed, 16)
        # @Blue = parseInt(hexBlue, 16)
        # @Green = parseInt(hexGreen, 16)
        # @hex = '#' + @hex

    BlendHex: -> @GetRGBFromHex(@hex)

    BlendRGB: -> @GetHexFromRGB(@Red, @Green, @Blue, @Alpha)

    GetRGBString: -> return "rgba(" + @Red + "," + @Green + "," + @Blue + "," + @Alpha + ");"

Color.Red = new Color(256, 0, 0, 1)
Color.Green = new Color(0, 256, 0, 1)
Color.Blue = new Color(0, 0, 256, 1)
Color.Flame = new Color("#ff8000")
Color.Ruby = new Color("#e60000")

class Electron
    @Import: ->
        Torch.ELECTRON = true
        Torch.fs = require("fs")

class CanvasRenderer
    constructor: (@sprite) ->
        @game = @sprite.game
        @previousPosition = new Point(@sprite.position.x, @sprite.position.y)
    Draw: ->
        drawRec = new Rectangle(@sprite.position.x, @sprite.position.y, @sprite.rectangle.width, @sprite.rectangle.height)

        drawRec.x = ( @sprite.position.x - @previousPosition.x ) * @game.Loop.lagOffset + @previousPosition.x
        drawRec.y = ( @sprite.position.y - @previousPosition.y ) * @game.Loop.lagOffset + @previousPosition.y
        @previousPosition = new Point(@sprite.position.x, @sprite.position.y)

        cameraTransform = new Point(0,0)

        if not @sprite.fixed
            drawRec.x += @game.Camera.position.x + @game.Hooks.positionTransform.x
            drawRec.y += @game.Camera.position.y + @game.Hooks.positionTransform.y

            #return if not drawRec.Intersects(@game.Camera.Viewport.rectangle)

        if @sprite.DrawTexture
            frame = @sprite.DrawTexture
            params = frame.drawParams

            @PreRender(drawRec)

            @game.canvas.drawImage(@sprite.DrawTexture.image, params.clipX, params.clipY,
            params.clipWidth, params.clipHeight,-drawRec.width/2, -drawRec.height/2,
            drawRec.width, drawRec.height)

            if @sprite.Body.DEBUG and false
                @game.canvas.fillStyle = "green"
                @game.canvas.globalAlpha = 0.5
                @game.canvas.fillRect(-drawRec.width/2, -drawRec.height/2, drawRec.width, drawRec.height)

            @PostRender()

    PreRender: (drawRec)->
        canvas = @game.canvas
        canvas.save()
        canvas.translate(drawRec.x + drawRec.width / 2, drawRec.y + drawRec.height / 2)

        if @sprite.Effects.tint.color isnt null
            @game.canvas.fillStyle = @sprite.Effects.tint.color
            @game.canvas.globalAlpha = @sprite.Effects.tint.opacity
            @game.canvas.globalCompositeOperation = "destination-atop"
            @game.canvas.fillRect(-drawRec.width/2, -drawRec.height/2, drawRec.width, drawRec.height)

        canvas.globalAlpha = @sprite.opacity
        canvas.rotate(@sprite.rotation)

    PostRender: ->
        canvas = @game.canvas
        canvas.restore()

class Rectangle
    constructor: (@x, @y, @width, @height) ->
        @z = 0

    GetOffset: (rectangle) ->
        vx = ( @x + ( @width / 2 ) ) - ( rectangle.x + ( rectangle.width / 2 ) )
        vy = ( @y + (@height / 2 ) ) - ( rectangle.y + ( rectangle.height / 2 ) )
        halfWidths = (@width / 2) + (rectangle.width / 2)
        halfHeights = (@height / 2) + (rectangle.height / 2)
        sharedXPlane = (@x + @width) - (rectangle.x + rectangle.width)
        sharedYPlane = (@y + @height) - (rectangle.y + rectangle.height)

        offset =
            x: halfWidths - Math.abs(vx)
            y: halfHeights - Math.abs(vy)
            vx: vx
            vy: vy
            halfWidths: halfWidths
            halfHeights: halfHeights
            sharedXPlane: sharedXPlane
            sharedYPlane: sharedYPlane

        return offset


    Intersects: (rectangle) ->
        a = @
        b = rectangle
        if a.x < (b.x + b.width) && (a.x + a.width) > b.x && a.y < (b.y + b.height) && (a.y + a.height) > b.y
            return a.GetOffset(b)
        else
            return false

    ShiftFrom: (rectangle, transX, transY) ->
        x = null
        y = null

        if transX is undefined then x = rectangle.x
        else x = rectangle.x + transX

        if transY is undefined then y = rectangle.y
        else y = rectangle.y + transY

        @x = x
        @y = y

class Vector
    #__torch__: Torch.Types.Vector
    x: null
    y: null
    angle: null
    magnitude: null

    constructor: (@x, @y) ->
        @ResolveVectorProperties()

    ResolveVectorProperties: ->
        @magnitude = Math.sqrt( @x * @x + @y * @y )
        @angle = Math.atan2(@x, @y)

    Clone: ->
        return new Torch.Vector(@x, @y)

    Set: (x,y) ->
        @x = x
        @y = y
        @ResolveVectorProperties()

    AddScalar: (n) ->
        @x += n
        @y += n
        @ResolveVectorProperties()

    MultiplyScalar: (n) ->
        @x *= n
        @y *= n
        @ResolveVectorProperties()

    DivideScalar: (n) ->
        @x /= n
        @y /= n
        @ResolveVectorProperties()

    SubtractVector: (v) ->
        @x -= v.x
        @y -= v.y
        @ResolveVectorProperties()

    AddVector: (v) ->
        @x += v.x
        @y += v.y
        @ResolveVectorProperties()

    Normalize: ->
        @DivideScalar(@magnitude)

    DotProduct: (v) ->
        return @x * v.x + @y * v.y

    IsPerpendicular: (v) ->
        return @DotProduct(v) is 0

    IsSameDirection: (v) ->
        return @DotProduct(v) > 0


class Point
    constructor: (@x, @y, @z = 0) ->

    Apply: (point) ->
        @x += point.x
        @y += point.y

    Clone: ->
        return new Point(@x, @y)

exports = this


Enum = (parts...) ->
    obj = {}

    for part,i in parts
        obj[part] = i+1

    return obj

class Utilities
    Expose: ->
        window["T"] = @

    RandomInRange: ->

    String: (str) ->
        return new StringUtility(str)

    Array: (array) ->
        return new ArrayUtility(array)

    Function: (func) ->
        return new FunctionUtility(func)

    Object: (obj) ->
        return new ObjectUtility(obj)

    Math: ->
        return new MathUtility()


class StringUtility
    constructor: (@str) ->

    String: ->
        return @str

    Chunk: (chunkLength) ->
        @str = @str.match(new RegExp('.{1,' + chunkLength + '}', 'g'));
        return @str

    Capitalize: ->
        @str[0] = @str[0].toUpperCase()
        return @str

class ArrayUtility
    constructor: (@array) ->

    Array: ->
        return @array

    All: (applier) ->
        for item in @array
            applier(item)

    Find: (selector) ->
        for item in @array
            return item if selector(item)

    Filter: (selector) ->
        selectedItems = []
        for item in @array
            selectedItems.push(item) if selector(item)
        return selectedItems

    Reject: (selector) ->
        selectedItems = []
        for item in @array
            selectedItems.push(item) if not selector(item)
        return selectedItems

    Where: (properties) ->
        items = @Filter (item) ->
            for key,value of properties
                if item[key] isnt value
                    return false
            return true

        return items

    Every: (selector) ->
        for item in @array
            return false if not selector(item)

        return true

    Some: (selector) ->
        for item in @array
            return true if selector(item)

        return false

    Contains: (item, startIndex = 0) ->
        index = @array.indexOf(item)
        return ( index isnt -1 and index >= startIndex )

    Pluck: (propertyName) ->
        properties = []

        for item in @array
            properties.push( item[propertyName] )

        return properties

    Max: (selector) ->
        currentMax = 0
        if not selector?
            selector = (item) -> return item

        for item in @array
            compareValue = selector(item)
            if compareValue > currentMax
                currentMax = item

        return currentMax

    Min: (selector) ->
        currentMin = 0
        if not selector?
            selector = (item) -> return item

        for item in @array
            compareValue = selector(item)
            if compareValue < currentMin
                currentMin = compareValue

        return currentMin

    SortBy: (sorter) ->

    GroupBy: (grouper) ->
        if not grouper?
            grouper = (item) -> return item.toString().length

        groups = {}

        for item in @array
            group = grouper(item)

            if not groups[group]?
                groups[group] = [ item ]
            else
                groups[group].push(item)

        return groups

    CountBy: (grouper) ->
        groups = @GroupBy(grouper)

        for key,value of groups
            groups[key] = value.length

        return groups

    Shuffle: ->
        currentIndex = @array.length
        temporaryValue = currentIndex
        randomIndex = currentIndex

        #While there remain elements to shuffle...
        while 0 isnt currentIndex

            #Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            #And swap it with the current element.
            temporaryValue = @array[currentIndex]
            @array[currentIndex] = @array[randomIndex]
            @array[randomIndex] = temporaryValue

        return @array

    Sample: (n = 1) ->
        sample = []
        while n > 0
            n--
            # needs work

    Partition: (checker) ->
        return [ @Filter(checker), @Reject(checker) ]

    First: (n = 1) ->
        return @array[0] if n is 1

        items = []
        while n <= @array.length
            items.push( @array[ n - 1 ] )
            n++

        return items

    Last: (n = 1) ->
        return @array[ @array.length - 1 ] if n is 1

        items = []
        while n <= @array.length
            items.push( @array[ @array.length - (n - 1) ] )
            n++

        return items

    Flatten: ->
        # reduce 'list of lists' down to one list

    Without: (values...) ->
        filteredItems = []

        for item in @array
            filteredItems.push( item ) if values.indexOf(item) is -1

        return filteredItems

    Union: (arrays...) ->
        ars = [@array, arrays...]
        combinedArray = []

        for ar in ars
            for item in ar
                combinedArray.push(item) if combinedArray.indexOf(item) is -1

        return combinedArray

    Intersection: (arrays...) ->
        ars = [@array, arrays...]
        combinedArray = []
        index = {}

        for ar in ars
            for item in ar
                if not index[item]?
                    index[item] = 1
                else
                    index[item] += 1

        for key,value of index
            if value >= arrays.length
                combinedArray.push(key)

        return combinedArray

    Uniq: ->
        # reduce array to unique values

    Zip: (arrays...) ->
        combinedArray = []

        for item,index in @array
            piece = [ item ]

            for ar in arrays
                piece.push( ar[index] )

            combinedArray.push(piece)

        return combinedArray

    UnZip: (arrays...) ->
        # opposite of Zip...

class FunctionUtility
    constructor: (@func) ->

    Defer: (args...) ->
        f = =>
            @func(args...)
        setTimeout(f , 0)

    Once: ->
        oldFunc = @func
        newFunc = (args...) ->
            return if this.called

            oldFunc(args...)
            this.called = true

        return newFunc

    After: (timesBeforeExecuted) ->
        oldFunc = @func
        newFunc = (args...) ->
            this.timesBeforeExecuted += 1
            return if this.calledCount < timesBeforeExecuted

            oldFunc(args...)
            this.called = true

        newFunc.timesBeforeExecuted = 0

        return newFunc

    Before: (timesExecuted) ->
        oldFunc = @func
        newFunc = (args...) ->
            this.timesExecuted += 1
            return if this.calledCount > timesExecuted

            oldFunc(args...)
            this.called = true

        newFunc.timesExecuted = 0

        return newFunc

    Compose: (funcs...) ->
        allFuncs = [@func, funcs...]

        i = 0

        newFunc = ->
            lastReturn = undefined

            while i < allFuncs.length
                lastReturn = allFuncs[i](lastReturn)
                i++

        return newFunc

class ObjectUtility
    constructor: (@obj) ->

    Keys: ->
        keys = []

        for key,value of @obj
            keys.push(key)

        return keys

    Values: ->
        values = []

        for key,value of @obj
            values.push(value)

        return values

    All: (applier) ->
        for key,value of @obj
            @obj[key] = applier(key,value)

        return @obj

    Invert: ->
        newObj = {}
        for key,value of @obj
            newObj[value] = key

        return newObj

    Functions: ->
        functionList = []

        for key,value of @obj
            functionList.push( value.name ) if typeof(value) is "function"

        return functionList

    Extend: (objects...)->
        for obj in objects

            for key,value of obj
                @obj[key] = value

        return @obj

    Pick: (pickKeys...) ->
        newObj = {}

        if typeof(pickKeys) is "function"
            for key,value of @obj
                newObj[key] = value if pickKeys(key, value, @obj)

        else
            for key in pickKeys
                newObj[key] = @obj[key]

        return newObj

    Omit: (omitKeys...) ->
        newObj = {}

        if typeof(omitKeys) is "function"
            for key,value of @obj
                newObj[key] = value if not omitKeys(key, value, @obj)

        else
            for key,value of @obj
                newObj[key] = @obj[key] if omitKeys.indexOf(key) is -1

        return newObj

    Clone: ->
        #... a good clone

    Has: (key) ->
        return false if not @obj[key]?
        return true

    Matches: (otherObj) ->
        for key,value of otherObj
            return false if @obj[key] isnt value

        return true

    Empty: ->
        return @Keys().length is 0

class MathUtility
    constructor: ->

    RandomInRange: (min,max) ->
        return Math.random() * (max - min + 1) + min

class Task

    Task.MixIn(Trashable)

    _torch_add: "Task"
    constructor: (@func) ->

    Execute: (game) ->
        @func(game)

class AjaxLoader
    onFinish: ->
    onError: ->

    constructor: (url, responseType = window.Torch.AjaxData.Text) ->
        @url = url
        @responseType = @GetResponseTypeString(responseType)

    GetResponseTypeString: (responseType) ->
        switch responseType
            when window.Torch.AjaxData.DOMString then      return ""
            when window.Torch.AjaxData.ArrayBuffer then    return "arraybuffer"
            when window.Torch.AjaxData.Blob then           return "blob"
            when window.Torch.AjaxData.Document then       return "document"
            when window.Torch.AjaxData.Json then           return "json"
            when window.Torch.AjaxData.Text then           return "text"

    Error: (func) -> @onError = func

    Finish: (func) -> @onFinish = func

    Load: ->
        request = new XMLHttpRequest()
        request.open('GET', @url, true)
        request.responseType = @responseType

        request.onload = =>
            @onFinish(request.response, @)

        request.send()

class Event
    constructor: (@game, @data) ->
        if @game isnt null
            @time = @game.time
        for key,value of @data
            @[key] = value

class Torch

    CANVAS: 1
    WEBGL: 2
    PIXEL: 3

    DUMP_ERRORS: false

    @GamePads: Enum("Pad1", "Pad2", "Pad3", "Pad4")
    @AjaxData: Enum("DOMString", "ArrayBuffer", "Blob", "Document", "Json", "Text")
    @Types: Enum("String", "Number", "Object", "Array", "Function", "Sprite", "Game", "Null")
    @Easing: Enum("Linear", "Square", "Cube", "InverseSquare", "InverseCube", "Smooth", "SmoothSquare", "SmoothCube", "Sine", "InverseSine")

    @AjaxLoader: AjaxLoader
    @Event: Event
    @Util: new Utilities() # a static reference for use within torch

    constructor: ->
        @GamePads = Enum("Pad1", "Pad2", "Pad3", "Pad4")
        @AjaxData = Enum("DOMString", "ArrayBuffer", "Blob", "Document", "Json", "Text")
        @Types = Enum("String", "Number", "Object", "Array", "Function", "Sprite", "Game", "Null")
        @Easing = Enum("Linear", "Square", "Cube", "InverseSquare", "InverseCube", "Smooth", "SmoothSquare", "SmoothCube", "Sine", "InverseSine")

        @Event = Event
        @EventDispatcher = EventDispatcher
        @Trashable = Trashable

        @Util = new Utilities()

        # all the modules we want exposed
        @Animation = Animation
        @Bind = Bind
        @CanvasRenderer = CanvasRenderer
        @Color = Color
        @DebugConsole = DebugConsole
        @StateMachine = StateMachine
        @Rectangle = Rectangle
        @Vector = Vector
        @Point = Point
        @Game = Game
        @Debug = Debug
        @Audio = Audio
        @HookManager = HookManager
        @Camera = Camera
        @Keys = Keys
        @Layers = Layers
        @Timer = Timer
        @Mouse = Mouse
        @Loop = Loop
        @ParticleManager = ParticleManager
        @Load = Load
        @Sprite = Sprite
        @TweenManager = TweenManager
        @SpriteGrid = SpriteGrid
        @SpriteGroup = SpriteGroup
        @Text = Text
        @EffectManager = EffectManager
        @Body = BodyManager
        @EventManager = EventManager
        @SizeManager = SizeManager
        @StateMachineManager = StateMachineManager
        @GridManager = GridManager
        @AnimationManager = AnimationManager
        @Collider = {}
        @Collider.CollisionDetector = CollisionDetector
        @Collider.Circle = Circle
        @Collider.AABB = AABB
        @CollisionManager = CollisionManager
        @Collision = Collision
        @Electron = new Electron()

    @FatalError: (error) ->
        return if @fatal
        @fatal = true

        if typeof error is "string"
            error = new Error(error)

        document.body.backgroundColor = "black"

        if @DUMP_ERRORS
            if require isnt undefined
                require("fs").writeFileSync("torch-error.log", error.stack)

        stack = error.stack.replace(/\n/g, "<br><br>")

        errorHtml = """
        <code style='color:#C9302C;margin-left:15%;font-size:24px'>#{error}</code>
        <br>
        <code style='color:#C9302C;font-size:20px;font-weight:bold'>Stack Trace:</code><br>
        <code style='color:#C9302C;font-size:20px'>#{stack}</code><br>
        """
        document.body.innerHTML = errorHtml
        throw error

    StrictErrors: ->
        @STRICT_ERRORS = true

    DumpErrors: ->
        @DUMP_ERRORS = true

    DisableConsoleWarnings: ->
        console.warn = ->

    Assert: (expression, errorTag = "Assertation Failed") ->
        if not expression
            Torch.FatalError(errorTag)

    TypeOf: (obj) ->

        objTypes = []

        objTypes.push(obj.__torch__) if obj.__torch__ isnt undefined


        typeString = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()

        switch typeString
            when "string"
                objTypes.push(Torch.Types.String)
            when "number"
                objTypes.push(Torch.Types.Number)
            when "object"
                objTypes.push(Torch.Types.Object)
            when "array"
                objTypes.push(Torch.Types.Array)
            when "function"
                objTypes.push(Torch.Types.Function)
            else
                objTypes.push(Torch.Types.Null)

        return objTypes

    Is = (obj, torchType) ->
        return Torch.TypeOf(obj).indexOf(torchType) isnt -1

    ExtendObject: (objectToExtend, newObject) ->
        for key,value of newObject
            objectToExtend[key] = value

    ExtendProperties: (Class, properties...) ->
        for prop in properties
            keyProp = prop.unCapitalize()
            func = (arg) ->
                return @[keyProp] if arg is undefined
                @[keyProp] = arg
                return @
            Class.prototype[prop] = func

exports.Torch = new Torch()


Torch::version = '0.6.5'
