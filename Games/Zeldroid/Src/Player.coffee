class Player extends Torch.Sprite
    VELOCITY: 0.4
    stoppped: false
    touching: null
    constructor: (game) ->
        @InitSprite(game, 0, 0)
        @Bind.Texture("player")
        @Center()

        @movementStateMachine = @States.CreateStateMachine("Movement")
        @movementStateMachine.State("idle", idleState)
        @movementStateMachine.State("move", moveState)
        @movementStateMachine.Switch("idle")

        @drawIndex = 11
        @position.y = window.innerHeight - 100
        @facing = "forward"

        @SetUpCollisions()

        @game.Keys.Space.On "KeyDown", (event) =>
            b = new PlayerBullet(@)

    @Load: (game) ->
        game.Load.Texture("Assets/Art/player.png", "player")
        game.Load.Texture("Assets/Art/particle.png", "player-bullet")

    Update: ->
        super()

    SetUpCollisions: ->
        @Collisions.Monitor()
        @On "Collision", (event) =>
            @HandleCollision(event)

    HandleCollision: (event) ->
        return if not event.collisionData.collider.hardBlock
        @Collisions.SimpleCollisionHandle(event, 0.5)



idleState =
    Execute: (player) ->
        if @game.Keys.W.down
            player.facing = "forward"
            @stateMachine.Switch("move", "W", {x: 0, y: -1})
        else if @game.Keys.S.down
            player.facing = "backward"
            @stateMachine.Switch("move", "S", {x: 0, y: 1})
        else if @game.Keys.D.down
            player.facing = "right"
            @stateMachine.Switch("move", "D", {x: 1, y: 0})
        else if @game.Keys.A.down
            player.facing = "left"
            @stateMachine.Switch("move", "A", {x: -1, y: 0})

    Start: (player) ->
        player.Body.velocity.x = 0
        player.Body.velocity.y = 0

    End: (player) ->
        # ...

moveState =
    Execute: (player) ->
        if not @game.Keys[@triggerKey].down
            @stateMachine.Switch("idle")

    Start: (player, key, velocity) ->
        player.Body.velocity.y = velocity.y * player.VELOCITY
        player.Body.velocity.x = velocity.x * player.VELOCITY
        @triggerKey = key

    End: (player) ->

class PlayerBullet extends Torch.Sprite
    constructor: (shooter) ->
        @InitSprite(shooter.game, shooter.position.x, shooter.position.y)
        @Bind.Texture("player-bullet")
        @drawIndex = shooter.drawIndex + 1

        @VELOCITY = 0.5
        switch shooter.facing
            when "forward"
                @Body.velocity.y = -1 * @VELOCITY
            when "backward"
                @Body.velocity.y = 1 * @VELOCITY
            when "right"
                @Body.velocity.x = 1 * @VELOCITY
            when "left"
                @Body.velocity.x = -1 * @VELOCITY

        @Body.omega = 0.02
        @Size.scale.width = @Size.scale.height = 10
        @game.Tweens.Tween(@, 500, Torch.Easing.Smooth).To({opacity: 0}).On "Finish", =>
            @Trash()

    Update: ->
        super()


window.Player = Player
