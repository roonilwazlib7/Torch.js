exports = this
class Player extends Torch.Sprite
    VELOCITY: 1
    constructor: (game) ->
        @InitSprite(game, 0, 0)
        @Bind.WebGLTexture("player")

        # internal light
        @internalLight = new Torch.PointLight( 0xffffff, 2, 500)

        @Attatch(@internalLight)

    Update: ->
        super()
        keys = @game.Keys
        @Velocity("x", 0)
        @Velocity("y", 0)
        @Velocity("x", @VELOCITY) if keys.D.down
        @Velocity("x", -@VELOCITY) if keys.A.down
        @Velocity("y", @VELOCITY) if keys.S.down
        @Velocity("y", -@VELOCITY) if keys.W.down
        #
        @Position("x", @game.Mouse.x)
        @Position("y", @game.Mouse.y)

        @internalLight.Position("x", @Position("x"))
        @internalLight.Position("y", -@Position("y"))



exports.Player = Player
