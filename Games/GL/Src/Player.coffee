exports = this
class Player extends Torch.Sprite
    VELOCITY: 1
    constructor: (game) ->
        @InitSprite(game, 0, 0)
        @Bind.WebGLTexture("player")

    Update: ->
        super()
        keys = @game.Keys
        @Velocity("x", 0)
        @Velocity("y", 0)
        @Velocity("x", @VELOCITY) if keys.D.down
        @Velocity("x", -@VELOCITY) if keys.A.down
        @Velocity("y", -@VELOCITY) if keys.S.down
        @Velocity("y", @VELOCITY) if keys.W.down


exports.Player = Player
