class StateMachine
    constructor: (@obj) ->
        @currentState = null
        @states = {}
        @game = @obj.game

    State: (stateName, stateObj) ->
        if stateObj is undefined

            if @states[stateName] is undefined
                Torch.FatalError("Unable to get state. State '#{stateName}' has not been added to the state machine")
            return @states[stateName]

        else
            stateObj.stateMachine = @
            stateObj.game = @game
            @states[stateName] = stateObj

    Switch: (newState, args...) ->
        if @currentState and @currentState.End isnt undefined
            @currentState.End(@obj, args...)

        if @State(newState).Start isnt undefined
            @State(newState).Start(@obj, args...);

        @currentState = @State(newState);

    Update: ->
        if @currentState isnt null and @currentState isnt undefined
            @currentState.Execute(@obj);

class State
    constructor: (@Execute, @Start, @End) ->
