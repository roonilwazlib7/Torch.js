TweenTypes = new Torch.Enum("Linear", "Quad", "Cube")
class TweenManager
    constructor(@game) ->
        @tweens = []

    Tween: (objectToTween, tweenProperties, startTime, currentTime, speed) ->
        @tweens.Add( new Tween(@game, objectToTween, tweenProperties, startTime, currentTime, speed) )

    Update: ->
        cleanedTweens = []
        for tween in @tweens
            if not tween.trash
                tween.Update()
                cleanedTweens.push(tween)

        @tweens = cleanedTweens

class Tween
    Tween.MixIn(Torch.Trashable)
    constructor: (@game, @objectToTween, @tweenProperties, @tweenType, @speed) ->
        @startTime = @game.time
        @lastTime = @game.time

    LinearTween = (objectToTween, tweenProperties, startTime, currentTime, speed) ->
        elapsedTime = currentTime - startTime

        for key,value of tweenProperties
            distance = value - objectToTween[key]
            velocity = distance / ( speed - elapsedTime )
            delta = velocity * ( currentTime - @lastTime )
            objectToTween[key] += delta

        @lastTime = currentTime

        return objectToTween

    Update: ->
        @Tweens[@tweenType](@objectToTween, @tweenProperties, @startTime, @game.time, @speed)


# usage...

spr = new Torch.Sprite(game, 0, 0)

game.Tween(spr.position, Torch.Tweens.Linear).To( {x: 100, y: 100}, -> alert("done!") )
