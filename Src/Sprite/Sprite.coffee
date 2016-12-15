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

        @rectangle = new Torch.Rectangle(x, y, 0, 0)
        @position = new Torch.Point(x,y)

        @Bind = new Bind(@)
        @Collisions = new CollisionManager(@)
        @Body = new Body(@)
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
        return new Torch.Collider.CollisionDetector(@, otherSprite)
###
gonna kill this...
###
class GhostSprite extends Sprite
    GHOST_SPRITE: true
