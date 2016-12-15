class BodyManager
    constructor: (@sprite)->

        Torch.Assert(@sprite isnt null and @sprite.__torch__ is Torch.Types.Sprite)

        @game = @sprite.game
        @velocity = new Torch.Vector(0,0)
        @acceleration = new Torch.Vector(0,0)
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
        thisVec = new Torch.Vector(@sprite.position.x, @sprite.position.y)
        otherVec = new Torch.Vector(otherSprite.position.x, otherSprite.position.y)
        otherVec.SubtractVector(thisVec)
        return otherVec.magnitude

    DirectionTo: (otherSprite) ->
        vec = new Torch.Vector( (otherSprite.position.x - @sprite.position.x), (otherSprite.position.y - @sprite.position.y) )
        vec.Normalize()
        return vec
