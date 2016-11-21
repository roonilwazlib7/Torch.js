exports = this
class Player extends Torch.Sprite
    VELOCITY: 1

    constructor: (game) ->
        @InitSprite(game, 0, 0)
        @Bind.WebGLTexture("player")
        @bullets = new Torch.SpriteGroup(null, game).Factory(Bullet)
        @lock = false

        @On "Click", (event) ->
            alert("click")
        @On "Collision", (event) =>
            # @Position("x", 2)

    Update: ->
        super()
        keys = @game.Keys
        @Velocity("x", 0)
        @Velocity("y", 0)
        @Velocity("x", @VELOCITY) if keys.D.down
        @Velocity("x", -@VELOCITY) if keys.A.down
        @Velocity("y", @VELOCITY) if keys.S.down
        @Velocity("y", -@VELOCITY) if keys.W.down

        @Position("x",@game.Mouse.x)
        @Position("y",@game.Mouse.y)

        if keys.Space.down
            if not @lock
                @Shoot()
                @lock = true
        else @lock = false

    Shoot: ->
        @bullets.Add(null, @Position("x") + @Width() / 2, @Position("y") - @Height() / 2, @)

exports.Player = Player
