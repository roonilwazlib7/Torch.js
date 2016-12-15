class EventDispatcher
    @dispatchers: []

    InitEventDispatch: ->
        @events = {}
        EventDispatcher.dispatchers.push(@)

    On: (eventName, eventHandle) ->
        if not @events[eventName]
            eventNest = []
            eventNest.triggers = 0

            @events[eventName] = eventNest

        @events[eventName].push(eventHandle)

        return @

    Emit: (eventName, eventArgs) ->
        if @events[eventName] isnt undefined
            for ev in @events[eventName]
                @events[eventName].triggers++
                ev(eventArgs)
        return @

    Off: (eventName = "") ->
        if eventName isnt ""
            @events[eventName] = undefined
        else
            for key,val of @events
                @events[key] = undefined
        return @
