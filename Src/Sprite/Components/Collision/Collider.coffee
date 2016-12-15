class CollisionDetector
    constructor: (@sprite, @otherSprite) ->

    AABB: ->
        return new AABB(@sprite, @otherSprite).Execute()

    Circle: ->
        return new Circle(@sprite, @otherSprite).Execute()

    SAT: ->
        return new SAT(@sprite, @otherSprite).Execute()
