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


Torch.Collider.Circle = Circle
