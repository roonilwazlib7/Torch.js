class ParticleEmitter extends Sprite
    particle: null
    auto: true
    constructor: (@game, x, y, @interval, @loop, @particle, @config) ->
        @InitSprite(@game, x, y)
        @elapsedTime = 0
        @hasEmitted = false

    Update: ->
        super()
        if @interval isnt undefined
            if @hasEmitted
                if @loop then @UpdateParticleEmitter()
            else @UpdateParticleEmitter()


    Particle: (particle) ->
        particle = particle

    UpdateParticleEmitter: ->
        return if not @auto
        @elapsedTime += @game.Loop.updateDelta

        if @elapsedTime >= @interval
            @EmitParticles()
            @hasEmitted = true
            @elapsedTime = 0

    EmitParticles: (removeEmitterWhenDone = false) ->
        i = 0
        while i < @config.spread
            i++
            @EmitParticle()

        if removeEmitterWhenDone then @Trash()

    EmitParticle: ()->
        angle = Torch.RandomInRange(@config.minAngle, @config.maxAngle)
        scale = Torch.RandomInRange(@config.minScale, @config.maxScale)
        alphaDecay = Torch.RandomInRange(@config.minAlphaDecay, @config.maxAlphaDecay)
        radius = Torch.RandomInRange(@config.minRadius, @config.maxRadius)
        x = @position.x
        y = @position.y

        if typeof @particle isnt "string"
            p = new @particle(@game, x, y)
        else
            p = new Torch.Sprite(@game, x, y)
            p.Bind.Texture(@particle)

        #p.Body.acceleration.y = @config.gravity
        p.Body.velocity.x = Math.cos(angle) * Torch.RandomInRange(@config.minVelocity, @config.maxVelocity)
        p.Body.velocity.y = Math.sin(angle) * Torch.RandomInRange(@config.minVelocity, @config.maxVelocity)
        p.Body.omega = Torch.RandomInRange(@config.minOmega, @config.maxOmega)
        p.Size.scale.width = scale
        p.Size.scale.height = scale
        p.drawIndex = 1000

        @game.Tweens.Tween(p, alphaDecay, Torch.Easing.Smooth)
            .To({opacity: 0})
            .On "Finish", ->
                p.Trash()

class ParticleManager
    constructor: (@game) ->

    ParticleEmitter: (x, y, interval, shouldLoop, particle, config)->
        return new ParticleEmitter(@game, x, y, interval, shouldLoop, particle, config)


# # usage
# emitter = new Torch.ParticleEmitter game, 0, 0, 1000, true,
#     spread: 20
#     gravity: 0.1
#     minRadius: 1
#     maxRadius: 2
#     minAngle: 0
#     maxAngle: Math.PI * 2
#     minScale: 1
#     maxScale: 2
#     minVelocity: 1
#     maxVelocity: 2
#     minAlphaDecay: 100
#     maxAlphaDecay: 200
#     minOmega: 1
#     maxOmega: 2
# emitter.Particle EffectPieces.Fire, (particle) ->
#     # do something to the particle when it's emitted
#
#
# emitter.Body.velocity.x = 5
