class Animation extends Trashable
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

    SpriteSheet: (width, height, numberOfFrames, config = {step: 200}) ->
        anim = new SpriteSheetAnimation(@sprite, width, height, numberOfFrames, config.step)
        @animations.push( anim )
        return anim

class SpriteSheetAnimation extends Animation
    index: -1
    clipX: 0
    clipY: 0
    game: null
    clipWidth: null
    clipHeight: null
    numberOfFrames: null
    stepTime: null

    constructor: (@sprite, @clipWidth, @clipHeight, @numberOfFrames, @stepTime) ->
        @loop = true
        @game = @sprite.game
        @Reset()

    Update: ->
        return if @stopped
        @intervalTime += @game.Loop.updateDelta

        if @intervalTime >= @stepTime
            @AdvanceFrame()

    AdvanceFrame: ->
        @intervalTime = 0
        @index += 1

        @sprite.DrawTexture.drawParams.clipX = @index * @clipWidth

        if @index >= @numberOfFrames - 1

            if @loop
                @index = -1
            else
                @Trash()

    Stop: ->
        @stopped = true

    Start: ->
        @stopped = false

    Index: (index) ->
        @index = index - 1
        @sprite.DrawTexture.drawParams.clipX = ( @index + 1) * @clipWidth

    Reset: ->
        @intervalTime = 0
        @index = -1

        @sprite.DrawTexture.drawParams.clipX = 0
        @sprite.DrawTexture.drawParams.clipY = 0
        @sprite.DrawTexture.drawParams.clipWidth = @clipWidth
        @sprite.DrawTexture.drawParams.clipHeight = @clipHeight
        @sprite.Size.width = @clipWidth
        @sprite.Size.height = @clipHeight

    SyncFrame: ->
        @sprite.DrawTexture.drawParams.clipX = 0
        @sprite.DrawTexture.drawParams.clipY = 0
        @sprite.DrawTexture.drawParams.clipWidth = @clipWidth
        @sprite.DrawTexture.drawParams.clipHeight = @clipHeight
        @sprite.Size.width = @clipWidth
        @sprite.Size.height = @clipHeight
