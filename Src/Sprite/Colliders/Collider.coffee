Torch.Collider = {}

class CollisionDetector
    constructor: (@sprite, @otherSprite) ->

    AABB: ->
        return new Torch.Collider.AABB(@sprite, @otherSprite).Execute()

    Circle: ->
        return new Torch.Collider.Circle(@sprite, @otherSprite).Execute()

    SAT: ->
        return new Torch.Collider.SAT(@sprite, @otherSprite).Execute()

Torch.Collider.CollisionDetector = CollisionDetector
