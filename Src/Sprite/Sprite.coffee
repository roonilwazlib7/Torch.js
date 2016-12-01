###
    @class Torch.Sprite
    @author roonilwazlib

    @constructor
        @param game, Torch.Game, REQUIRED
        @param x, number, REQUIRED
        @param y, number, REQUIRED

    @description
        Torch.Sprite defines practically everything that can be in the game.
        Think anything that moves or performs any action, anything that you
        can see. Torch.Sprite is semi-abstract, it can be inherited or used on
        its own.
    @usage
        CoffeeScript:
            sprite = new Torch.Sprite(game, 0, 0)

        JavaScript:
            var sprite = new Torch.Sprite(game, 0, 0)
###
class Sprite

    constructor: (game, x, y)->
        @InitSprite(game, x, y)

    Sprite.MixIn(Torch.EventDispatcher)
          .MixIn(Torch.Trashable)

    InitSprite: (game, x = 0, y = 0)->
        if game is null or game is undefined
            Torch.FatalError("Unable to initialize sprite without game")

        @InitEventDispatch()
        @game = game
        @GL = @game.graphicsType is Torch.WEBGL

        @rectangle = new Torch.Rectangle(x, y, 0, 0)
        @position = new Torch.Point(x,y)

        @Bind = new Torch.Bind(@)
        @Collisions = new Torch.CollisionManager(@)
        @Body = new Torch.Body(@)
        @Size = new Torch.Size(@)
        @Events = new Torch.EventManager(@)

        @DrawTexture = null
        @TexturePack = null
        @TextureSheet = null

        @fixed = false
        @draw = true

        @drawIndex = 0
        @rotation = 0
        @opacity = 1

        @_torch_add = "Sprite"
        @_torch_uid = ""

        @events = {}
        @tasks = {}
        @children = []
        @stateMachines = []
        if not @GL then @renderer = new CanvasRenderer(@)

        game.Add(@)

    Fixed: (tog) ->
        if tog isnt undefined
            if @fixed
                @fixed = false
            else
                @fixed = true
        else
            @fixed = tog
        return @

    UpdateSprite: ->
        @UpdateBody()
        @Size.Update()
        @Events.Update()

        @rectangle.x = @position.x
        @rectangle.y = @position.y

        @Collisions.Update() # this needs to be after the rectangle thing, God knows why

    UpdateEvents: ->
        if not @game.Mouse.GetRectangle(@game).Intersects(@rectangle) and @mouseOver
            @mouseOver = false
            @Emit("MouseLeave", new Torch.Event(@game, {sprite: @}))

        if @game.Mouse.GetRectangle(@game).Intersects(@rectangle)
            if not @mouseOver
                @Emit("MouseOver", new Torch.Event(@game, {sprite: @}))
            @mouseOver = true

        else if @fixed
            mouseRec = @game.Mouse.GetRectangle()
            reComputedMouseRec = new Torch.Rectangle(mouseRec.x, mouseRec.y, mouseRec.width, mouseRec.height)
            reComputedMouseRec.x += @game.Viewport.x
            reComputedMouseRec.y += @game.Viewport.y
            if reComputedMouseRec.Intersects(@rectangle)
                @mouseOver = true
            else
                @mouseOver = false
        else
            @mouseOver = false

        if @mouseOver and @game.Mouse.down and not @clickTrigger
            @clickTrigger = true

        if @clickTrigger and not @game.Mouse.down and @mouseOver
            @wasClicked = true

            @Emit("Click",new Torch.Event(@game, {sprite: @}))

            @clickTrigger = false

        if @clickTrigger and not @game.Mouse.down and not @mouseOver
            @clickTrigger = false

        if not @game.Mouse.down and not @mouseOver and @clickAwayTrigger
            @Emit("ClickAway", new Torch.Event(@game, {sprite: @}))
            @wasClicked = false
            @clickAwayTrigger = false

        else if @clickTrigger and not @game.Mouse.down and @mouseOver
            @clickAwayTrigger = false

        else if @game.Mouse.down and not @mouseOver
            @clickAwayTrigger = true

        if not @rectangle.Intersects(@game.BoundRec)
            @Emit("OutOfBounds", new Torch.Event(@game, {sprite: @}))

    UpdateBody: ->
        velX = @Body.x.velocity
        velY = @Body.y.velocity
        deltaTime = @game.deltaTime

        if @Body.x.acceleration isnt @Body.x.la
            @Body.x.la = @Body.x.acceleration
            @Body.x.aTime = 0

        if @Body.x.acceleration isnt 0
            @Body.x.aTime += deltaTime
            velX += @Body.x.aTime * @Body.x.acceleration

        if @Body.y.acceleration isnt @Body.y.la
            @Body.y.la = @Body.y.acceleration
            @Body.y.aTime = 0

        if @Body.y.acceleration isnt 0
            @Body.y.aTime += deltaTime
            velY += @Body.y.aTime * @Body.y.acceleration

        if Math.abs(velX) < Math.abs(@Body.x.maxVelocity)
            @position.x += velX * deltaTime

        else
            dir = velX < 0 ? -1 : 1
            @position.x += dir * @Body.x.maxVelocity * deltaTime

        @position.y += velY * deltaTime

    UpdateGLEntities: ->
        return if not @GL
        # send all graphics-related information to
        # the corresponding three.js mesh being rendered

        # we should have something like this: @Three.Update()

        transform = @GetThreeTransform()
        if @GL and @gl_three_sprite
            @Three().Position("x",  transform.x )
                    .Position("y", transform.y)
                    .Position("z", @rectangle.z)
                    .Rotation(@rotation)
                    .DrawIndex(@drawIndex)
                    .Opacity(@opacity)
                    .Width( @Width() )
                    .Height( @Height() )

    Update: ->
        @UpdateSprite()

    GetCurrentDraw: ->
        if @TexturePack
            return @TexturePackAnimation.GetCurrentFrame()

        else if @TextureSheet
            return @TextureSheetAnimation.GetCurrentFrame()

        else if @DrawTexture
            return @DrawTexture

    Draw: ->
        if @renderer isnt null
            @renderer.Draw()

    Hide: ->
        @draw = false
        return @

    Show: ->
        @draw = true
        return @

    Clone: (x,y) ->
        proto = @constructor
        return new proto(@game, x, y)

    NotSelf: (otherSprite) ->
        return (otherSprite._torch_uid isnt @_torch_uid)

    Three: ->
        throw "Unable to access three.js object" if not @GL

        return @gl_three_sprite

    Rotation: (rotation) ->
        if (rotation is undefined)
            return @rotation
        else
            if (typeof(rotation) isnt "number")
                @game.FatalError("Rotation values must be a number. Provided was '#{typeof(rotation)}'")
            @rotation = rotation
            return @

    Opacity: (opacity) ->
        if (opacity is undefined)
            return @opacity
        else
            if (typeof(opacity) isnt "number")
                @game.FatalError("Opacity values must be a number. Provided was '#{typeof(opacity)}'")
            @opacity = opacity
            return @

    DrawIndex: (drawIndex) ->
        if drawIndex is undefined
            return @drawIndex
        else
            if typeof(drawIndex) isnt "number"
                @game.FatalError("DrawIndex values must be a number. Provided was '#{typeof(drawIndex)}'")
            @drawIndex = drawIndex
            return @

    Scale: (scale) ->
        if scale is undefined
            return @scale
        else
            @scale = scale

    GetDirectionVector: (otherSprite) ->
        vec = new Torch.Vector( (otherSprite.Rectangle.x - @position.x), (otherSprite.Rectangle.y - @position.y) )
        vec.Normalize()
        return vec

    GetDistance: (otherSprite) ->
        thisVec = new Torch.Vector(@position.x, @position.y)
        otherVec = new Torch.Vector(otherSprite.rectangle.x, otherSprite.rectangle.y)
        return thisVec.GetDistance(otherVec)

    GetAngle: (otherSprite) ->
        directionVector = @GetDirectionVector(otherSprite)
        angle = Math.atan2(directionVector.y, directionVector.x)
        return angle + (Math.PI + (Math.PI/2) )

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
        return new Torch.Collider.CollisionDetector(@, otherSprite)

    Attatch: (otherItem) ->
        @children.push(otherItem)
        @game.Add(otherItem)

    GetThreeTransform: () ->
        point = @game.GetThreeTransform( ( @Position("x") + @Width() / 2 ), ( @Position("y") + @Height() / 2) )
        point.x -= @Width() / 4
        return point
###
    @class Torch.GhostSprite @extends Torch.Sprite
    @author roonilwazlib

    @abstract

    @description
        DEPRECATED. Use Torch.Task instead
        Used to create an 'invisible' sprite, i.e a sprite that is
        updated and not drawn.
###
class GhostSprite extends Sprite
    GHOST_SPRITE: true

# expose to Torch
Torch.Sprite = Sprite
Torch.GhostSprite = GhostSprite
