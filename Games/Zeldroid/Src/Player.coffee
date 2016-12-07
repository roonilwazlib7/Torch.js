class Player extends Torch.Sprite
    VELOCITY: 0.4
    stoppped: false
    touching: null
    constructor: (game) ->
        @InitSprite(game, 0, 0)
        @touching = {}
        @Body.Debug()
        @Bind.Texture("player")
        @Effects.tint.color = "red"

        @Center()
        @position.y = window.innerHeight - 100

        @Collisions.Monitor()
        @On "Collision", (event) =>
            @touching = @Collisions.SimpleCollisionHandle(event, 0.5)
            @Body.Velocity("x", 0)
            @Body.Velocity("y", 0)

    @Load: (game) ->
        game.Load.Texture("Assets/Art/player.png", "player")

    Update: ->
        super()

        @Movement()

    Movement: ->
        keys = @game.Keys
        @Body.velocity.x = 0
        @Body.velocity.y = 0

        if not keys.A.down and not keys.S.down and not keys.W.down
            if keys.D.down and @touching and not @touching.right
                @Body.velocity.x = @VELOCITY
            else @touching.right = false

        else if not keys.D.down and not keys.S.down and not keys.W.down
            if keys.A.down and @touching and not @touching.left
                @Body.velocity.x = -@VELOCITY
            else @touching.left = false

        else if not keys.A.down and not keys.D.down and not keys.W.down
            if keys.S.down and @touching and not @touching.bottom
                @Body.velocity.y = @VELOCITY
            else @touching.bottom = false

        else if not keys.A.down and not keys.S.down and not keys.D.down
            if keys.W.down and @touching and not @touching.top
                @Body.velocity.y = -@VELOCITY
            else @touching.top = false





window.Player = Player
