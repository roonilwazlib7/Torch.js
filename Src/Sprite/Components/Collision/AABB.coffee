class AABB
    constructor: (@sprite, @otherSprite) ->

    Execute: ->
        return @sprite.rectangle.Intersects(@otherSprite.rectangle)
