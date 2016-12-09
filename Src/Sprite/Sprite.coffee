class Sprite
    Sprite.MixIn(Torch.EventDispatcher)
          .MixIn(Torch.Trashable)

    __torch__: Torch.Types.Sprite

    constructor: (game, x, y)->
        @InitSprite(game, x, y)

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
        @Effects = new Torch.EffectManager(@)
        @States = new Torch.StateMachineManager(@)
        @Grid = new Torch.GridManager(@)

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

        @rectangle.x = @position.x
        @rectangle.y = @position.y

        @Collisions.Update() # this needs to be after the rectangle thing, God knows why

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

    Clone: (x,y) ->
        proto = @constructor
        return new proto(@game, x, y)

    NotSelf: (otherSprite) ->
        return (otherSprite._torch_uid isnt @_torch_uid)

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
###
gonna kill this...
###
class GhostSprite extends Sprite
    GHOST_SPRITE: true

# expose to Torch
Torch.Sprite = Sprite
Torch.GhostSprite = GhostSprite
