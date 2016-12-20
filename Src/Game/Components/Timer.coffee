class Timer
    constructor: (@game)->
        @futureEvents = [] # should refactor this name

    Update: ->
        for event in @futureEvents
            event.Update()

    SetFutureEvent: (timeToOccur, handle) ->
        @futureEvents.push( new FutureEvent(timeToOccur, handle, @game) )

    SetScheduledEvent: (interval, handle) ->
        ev = new ScheduledEvent(interval, handle, @game)
        @futureEvents.push( ev )
        return ev

class FutureEvent
    constructor: (@timeToOccur, @handle, @game) ->
        @time = 0
    Update: ->
        @time += @game.Loop.updateDelta
        if @time >= @timeToOccur
            if @handle isnt null and @handle isnt undefined
                @handle()
                @handle = null

class ScheduledEvent
    constructor: (@interval, @handle, @game) ->
        @elapsedTime = 0

    Update: ->
        @elapsedTime += @game.Loop.updateDelta

        if @elapsedTime >= @interval
            @handle() if @handle?
            @elapsedTime = 0
