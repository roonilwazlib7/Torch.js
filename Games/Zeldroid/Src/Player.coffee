class Player extends Torch.Sprite
    VELOCITY: 0.4
    stoppped: false
    touching: null
    constructor: (game) ->
        @InitSprite(game, 0, 0)
        @Bind.Texture("player-right-idle")
        @spriteSheetAnim = @Animations.SpriteSheet(16, 16, 2)
        @spriteSheetAnim.Stop()

        @audioPlayer = @game.Audio.CreateAudioPlayer()
        @audioPlayer.volume = 0.25

        @movementStateMachine = @States.CreateStateMachine("Movement")
        @movementStateMachine.State("idle", idleState)
        @movementStateMachine.State("move", moveState)
        @movementStateMachine.Switch("idle")

        @drawIndex = 11
        @facing = "forward"
        @shootKeyWasDown = false

        @game.Keys.Space.On "KeyUp", =>
            @audioPlayer.PlaySound("shoot")
            b = new PlayerBullet(@)

        @SetUpCollisions()

    @Load: (game) ->
        game.Load.Texture("Assets/Art/player/player-forward-idle.png", "player-forward-idle")
        game.Load.Texture("Assets/Art/player/player-backward-idle.png", "player-backward-idle")
        game.Load.Texture("Assets/Art/player/player-right-idle-sheet.png", "player-right-idle")
        game.Load.Texture("Assets/Art/player/player-left.png", "player-left-idle")

        game.Load.Texture("Assets/Art/player/bullet.png", "player-bullet")
        game.Load.Texture("Assets/Art/player/shoot-particle.png", "shoot-particle")

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
        player.spriteSheetAnim.Start()
        player.Body.velocity.y = velocity.y * player.VELOCITY
        player.Body.velocity.x = velocity.x * player.VELOCITY
        @triggerKey = key

        switch player.facing
            when "forward"
                player.Bind.Texture("player-forward-idle")
                player.spriteSheetAnim.SyncFrame()
            when "backward"
                player.Bind.Texture("player-backward-idle")
                player.spriteSheetAnim.SyncFrame()
            when "right"
                player.Bind.Texture("player-right-idle")
                player.spriteSheetAnim.SyncFrame()
            when "left"
                player.Bind.Texture("player-left-idle")
                player.spriteSheetAnim.SyncFrame()

    End: (player) ->
        player.spriteSheetAnim.Stop()
        player.spriteSheetAnim.Index(0)

class PlayerBullet extends Torch.Sprite
    DAMAGE: 1
    constructor: (shooter) ->
        @InitSprite(shooter.game, shooter.position.x, shooter.position.y)
        @Bind.Texture("player-bullet")
        @drawIndex = shooter.drawIndex + 1

        @VELOCITY = 1.5
        switch shooter.facing
            when "forward"
                @Body.velocity.y = -1 * @VELOCITY
                @position.y -= 0.3 * shooter.rectangle.height
                @position.x += 0.1 * shooter.rectangle.width
            when "backward"
                @Body.velocity.y = 1 * @VELOCITY
                @position.x += 0.1 * shooter.rectangle.width
                @position.y += 0.3 * shooter.rectangle.height
            when "right"
                @Body.velocity.x = 1 * @VELOCITY
                @position.x += 1.1 * shooter.rectangle.width
                @position.y += 0.25 * shooter.rectangle.height
                @rotation = Math.PI/2
            when "left"
                @Body.velocity.x = -1 * @VELOCITY
                @position.x -= 0.1 * shooter.rectangle.width
                @position.y += 0.25 * shooter.rectangle.height
                @rotation = Math.PI/2

        @Size.scale.width = @Size.scale.height = 10

        @emitter = @game.Particles.ParticleEmitter 500, 500, 500, true, "shoot-particle",
            spread: 20
            gravity: 0.0001
            minAngle: 0
            maxAngle: Math.PI * 2
            minScale: 2
            maxScale: 4
            minVelocity: 0.01
            maxVelocity: 0.01
            minAlphaDecay: 200
            maxAlphaDecay: 250
            minOmega: 0.001
            maxOmega: 0.001
        @emitter.auto = false
        @emitter.position = @position.Clone()
        @emitter.EmitParticles(true)

        @Collisions.Monitor()
        @On "Collision", (event) =>
            return if not event.collisionData.collider.hardBlock
            event.collisionData.collider.hp -= @DAMAGE
            @Trash()

            @emitter.particle = "particle"
            @emitter.position = @position.Clone()
            @emitter.EmitParticles(true)


    Update: ->
        super()


window.Player = Player
