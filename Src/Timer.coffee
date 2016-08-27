class Timer
    constructor: ->
        @futureEvents = []
    Update: ->
        for event in @futureEvents
            event.Update()
    SetFutureEvent: (timeToOccur, handle) ->
        @futureEvents.push( new Torch.FutureEvent(timeToOccur, handle) )

class FutureEvent
    constructor: (@timeToOccur, @handle) ->
        @time = 0
    Update: ->
        @time += Game.deltaTime
        if @time >= @timeToOccur
            if @handle isnt null and @handle isnt undefined
                @handle()
                @handle = null


Torch.Timer = new Timer()
Torch.FutureEvent = FutureEvent
