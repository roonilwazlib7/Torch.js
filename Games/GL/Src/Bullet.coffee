exports = this
class Bullet extends Torch.Sprite
    constructor: (game, x, y, @shooter) ->
        @InitSprite(game, x, y)
        @Bind.WebGLTexture("bullet")
        @Velocity("y", -1)
        @Move("x", -@Width() / 2)

        @On "Collision", (event) =>
            #if @shooter.NotSelf(event.collider)
                # @Trash()
        @On "OutOfBounds", (event) =>
            # @Trash()

    Update: ->
        super()

exports.Bullet = Bullet
