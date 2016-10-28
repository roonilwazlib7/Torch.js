class AABB
    constructor: (@sprite, @otherSprite) ->

    Execute: ->
        return @sprite.Rectangle.Intersects(@otherSprite.Rectangle)

Torch.Collider.AABB = AABB
