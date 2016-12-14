class Animation extends Torch.Trashable
    loop: false
    stopped: false
    intervalTime: 0
    stepTime: 0


class AnimationManager
    animations: null
    constructor: (@sprite) ->
        @animations = []

    Update: ->
        cleanedAnims = []
        for anim in @animations
            anim.Update()
            cleanedAnims.push(anim) if not anim.trash
        @animations = cleanedAnims

    SpriteSheet: (width, height, numberOfFrames, config = {}) ->
        defaultConfig =
            step: 200

        config = Torch.Utils.BlendObject(defaultConfig, config)
        anim = new SpriteSheetAnimation(@sprite, width, height, numberOfFrames, config.step)
        @animations.push( anim )

        return anim
class SpriteSheetAnimation extends Animation
    index: 0
    clipX: 0
    clipY: 0
    game: null
    clipWidth: null
    clipHeight: null
    numberOfFrames: null
    stepTime: null

    constructor: (@sprite, @clipWidth, @clipHeight, @numberOfFrames, @stepTime) ->
        @game = @sprite.game
        @Reset()

    Update: ->
        return if @stopped
        @intervalTime += @game.updateDelta

        if @intervalTime >= @stepTime
            @AdvanceFrame()

    AdvanceFrame: ->
        @intervalTime = 0
        @index += 1

        @sprite.drawParams.clipX = index * @clipWidth

        if index >= @numberOfFrames

            if @loop
                @index = 0
            else
                @Trash()

    Stop: ->
        @stopped = true

    Reset: ->
        @intervalTime = 0
        @index = 0

        @sprite.drawParams.clipX = 0
        @sprite.drawParams.clipY = 0
        @sprite.drawParams.clipWidth = @clipWidth
        @sprite.drawParams.clipHeight = @clipHeight

Torch.AnimationManager = AnimationManager
