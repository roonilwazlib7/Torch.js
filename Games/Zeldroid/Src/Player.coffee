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
            @touching = @Collisions.SimpleCollisionHandle(event, 0.5)
            @Body.Velocity("x", 0)
            @Body.Velocity("y", 0)


    Update: ->
        super()

        @Movement()

    Movement: ->
        keys = @game.Keys
        @Body.Velocity("x", 0)
        @Body.Velocity("y", 0)

        if not keys.A.down and not keys.S.down and not keys.W.down
            if keys.D.down and @touching and not @touching.right
                @Body.Velocity("x", @VELOCITY)
            else @touching.right = false

        else if not keys.D.down and not keys.S.down and not keys.W.down
            if keys.A.down and @touching and not @touching.left
                @Body.Velocity("x", -@VELOCITY)
            else @touching.left = false

        else if not keys.A.down and not keys.D.down and not keys.W.down
            if keys.S.down and @touching and not @touching.bottom
                @Body.Velocity("y", @VELOCITY)
            else @touching.bottom = false

        else if not keys.A.down and not keys.S.down and not keys.D.down
            if keys.W.down and @touching and not @touching.top
                @Body.Velocity("y", -@VELOCITY)
            else @touching.top = false





window.Player = Player
