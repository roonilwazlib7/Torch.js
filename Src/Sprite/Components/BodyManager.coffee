class BodyManager
    constructor: (@sprite)->
        @game = @sprite.game
        @velocity = new Vector(0,0)
        @acceleration = new Vector(0,0)
        @omega = 0
        @alpha = 0
        @distance = 0

    Update: ->
        dX = @velocity.x * @game.Loop.updateDelta
        dY = @velocity.y * @game.Loop.updateDelta
        @distance += Math.sqrt( (dX * dX) + (dY * dY) )

        @sprite.position.x += dX
        @sprite.position.y += dY

        @velocity.x += @acceleration.x * @game.Loop.updateDelta
        @velocity.y += @acceleration.y * @game.Loop.updateDelta

        @sprite.rotation += @omega * @game.Loop.updateDelta
        @sprite.omega += @alpha * @game.Loop.updateDelta

    Debug: (color = "red") ->
        @DEBUG = color

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
