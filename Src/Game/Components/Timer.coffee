class Timer
    constructor: (@game)->
        @futureEvents = []
    Update: ->
        for event in @futureEvents
            event.Update()
    SetFutureEvent: (timeToOccur, handle) ->
        @futureEvents.push( new FutureEvent(timeToOccur, handle, @game) )

class FutureEvent
    constructor: (@timeToOccur, @handle, @game) ->
        @time = 0
    Update: ->
        @time += @game.deltaTime
        if @time >= @timeToOccur
            if @handle isnt null and @handle isnt undefined
                @handle()
                @handle = null
