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

        @touching = {}
        @drawIndex = 11
        @position.y = window.innerHeight - 100

        @SetUpCollisions()

    @Load: (game) ->
        game.Load.Texture("Assets/Art/player.png", "player")

    Update: ->
        super()

    SetUpCollisions: ->
        @Collisions.Monitor()
        @On "Collision", (event) =>
            @HandleCollision(event)

    HandleCollision: (event) ->
        return if not event.collisionData.collider.hardBlock
        @touching = @Collisions.SimpleCollisionHandle(event, 0.5)
        #@movementStateMachine.Switch("idle")



idleState =
    Execute: (player) ->
        if @game.Keys.W.down
            @stateMachine.Switch("move", "W", {x: 0, y: -1})
        else if @game.Keys.S.down
            @stateMachine.Switch("move", "S", {x: 0, y: 1})
        else if @game.Keys.D.down
            @stateMachine.Switch("move", "D", {x: 1, y: 0})
        else if @game.Keys.A.down
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




window.Player = Player
