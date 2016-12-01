class Player extends Torch.Sprite
    VELOCITY: 0.4
    stoppped: false
    touching: null
    constructor: (game) ->
        @touching = {}
        @InitSprite(game, 0, 0)
        @Body.Debug()
        @Bind.Texture("player")

        @Center()
        @position.y = window.innerHeight - 100

        @Collisions.Monitor()
        @On "Collision", (event) =>
            @touching = @Collisions.SimpleCollisionHandle(event, 1.5)
            @Velocity("x", 0).Velocity("y", 0)


    Update: ->
        super()

        @Movement()

    Movement: ->
        keys = @game.Keys
        @Velocity("x", 0).Velocity("y", 0)

        if not keys.A.down and not keys.S.down and not keys.W.down
            if keys.D.down and @touching and not @touching.right
                @Velocity("x", @VELOCITY)
            else @touching.right = false

        else if not keys.D.down and not keys.S.down and not keys.W.down
            if keys.A.down and @touching and not @touching.left
                @Velocity("x", -@VELOCITY)
            else @touching.left = false

        else if not keys.A.down and not keys.D.down and not keys.W.down
            if keys.S.down and @touching and not @touching.bottom
                @Velocity("y", @VELOCITY)
            else @touching.bottom = false

        else if not keys.A.down and not keys.S.down and not keys.D.down
            if keys.W.down and @touching and not @touching.top
                @Velocity("y", -@VELOCITY)
            else @touching.top = false





window.Player = Player
