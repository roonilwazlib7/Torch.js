Torch.Easing = Torch.Enum("Linear", "Square", "Cube", "InverseSquare", "InverseCube", "Smooth", "SmoothSquare", "SmoothCube", "Sine", "InverseSine")
class Tween
    @MixIn Trashable
    @MixIn EventDispatcher
    objectToTween: null
    tweenProperties: null
    originalObjectValues: null
    elapsedTime: 0
    timeTweenShouldTake: 0
    easing: null

    constructor: (@game, @objectToTween, @tweenProperties, @timeTweenShouldTake, @easing) ->
        @InitEventDispatch()
        @game.Tweens.tweens.push(@)
        @originalObjectValues = {}

        for key,value of @tweenProperties
            @originalObjectValues[key] = @objectToTween[key]
    Update: ->
        normalizedTime = @elapsedTime / @timeTweenShouldTake
        easedTime = @Ease(normalizedTime)

        for key,value of @tweenProperties
            @objectToTween[key] = (@tweenProperties[key] * easedTime) + (@originalObjectValues[key] * (1 - easedTime))

        @elapsedTime += @game.Loop.updateDelta
        if @elapsedTime >= @timeTweenShouldTake
            @Emit "Finish", new Torch.Event(@game, {tween: @})
            @Trash()

    Ease: (normalizedTime) ->
        switch @easing
            when Torch.Easing.Linear
                return normalizedTime

            when Torch.Easing.Square
                return Math.pow(normalizedTime, 2)

            when Torch.Easing.Cube
                return Math.pow(normalizedTime, 3)

            when Torch.Easing.InverseSquare
                return 1 - Math.pow(1 - normalizedTime, 2)

            when Torch.Easing.InverseCube
                return 1 - Math.pow(1 - normalizedTime, 3)

            when Torch.Easing.Smooth
                return normalizedTime * normalizedTime * (3 - 2 * normalizedTime)

            when Torch.Easing.SmoothSquare
                return Math.pow( ( normalizedTime * normalizedTime * ( (3 - 2 * normalizedTime) ) ), 2 )

            when Torch.Easing.SmoothCube
                return Math.pow( ( normalizedTime * normalizedTime * ( (3 - 2 * normalizedTime) ) ), 3 )

            when Torch.Easing.Sine
                return Math.sin(normalizedTime * Math.PI / 2)

            when Torch.Easing.InverseSine
                return 1 - Math.sin( (1 - normalizedTime) * Math.PI / 2 )

class TweenSetup
    constructor: (@game, @object, @timeTweenShouldTake, @easing = Torch.Easing.Smooth) ->

    To: (tweenProperties) ->
        return new Tween(@game, @object, tweenProperties, @timeTweenShouldTake, @easing)

    From: (setProperties) ->
        for key,value of setProperties
            @object[key] = value
        return @

class TweenManager
    constructor: (@game) ->
        @tweens = []

    Update: ->
        cleanedTweens = []
        for tween in @tweens
            if not tween.trash
                cleanedTweens.push(tween)
                tween.Update()

    Tween: (object, timeTweenShouldTake) ->
        return new TweenSetup(@game, object, timeTweenShouldTake)

    All: (callback) ->
        for tween in @game.tweens
            callback(tween)


Torch.TweenManager = TweenManager

# # objects or primitives
# game.Tween(sprite.position, 500).To({x: 500, y: 500})
# # or set the properties before tweening
# game.Tween.(sprite.opacity, 500).From(0).To(1)
