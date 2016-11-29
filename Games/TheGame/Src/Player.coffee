class Player extends Torch.Sprite
    VELOCITY: 0.4
    stoppped: false
    touching: null
    constructor: (game) ->
        @touching = {}
        @InitSprite(game, 0, 0)
        @Bind.Texture("player")

        @Center().CenterVertical()
        @Position("y", window.innerHeight - 100)

        @On "Collision", (event) =>
            @touching = @Collisions.SimpleCollisionHandle(event, 2)
            @Velocity("x", 0).Velocity("y", 0)


    Update: ->
        super()

        @Move()

    Move: ->
        keys = @game.Keys
        @Velocity("x", 0).Velocity("y", 0)

        if keys.D.down and @touching and not @touching.right
            @Velocity("x", @VELOCITY)
        else @touching.right = false

        if keys.A.down and @touching and not @touching.left
            @Velocity("x", -@VELOCITY)
        else @touching.left = false

        if keys.S.down and @touching and not @touching.bottom
            @Velocity("y", @VELOCITY)
        else @touching.bottom = false

        if keys.W.down and @touching and not @touching.top
            @Velocity("y", -@VELOCITY)
        else @touching.top = false





window.Player = Player
