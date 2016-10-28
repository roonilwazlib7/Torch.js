class ParticleEmitter extends Torch.GhostSprite
    constructor: (x, y, particleDecayTime, step, once = false) ->
        @InitSprite(x,y)
        @PARTICLE_DECAY_TIME = particleDecayTime
        @STEP = step
        @elapsedTime = 0

        @OnEmit = null
        @once = once

    Update: ->
        super()
        @elapsedTime += @game.deltaTime
        if @elapsedTime >= @STEP
        
            @Emit()
            that.elapsedTime = 0;
        
