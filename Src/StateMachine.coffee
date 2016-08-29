class StateMachine
    constructor: (@obj) ->
        @currentState = null
        @states = {}

    State: (stateName, stateObj) ->
        if stateObj is undefined

            if @states[stateName] is undefined
                Torch.FatalError("Unable to get state. State '#{stateName}' has not been added to the state machine")
            return @states[stateName]

        else
            @states[stateName] = stateObj

    Switch: (newState) ->
        if @currentState and @currentState.End isnt undefined
            @currentState.End(@obj)

        if @State(newState).Start isnt undefined
            @State(newState).Start(@obj);

        @currentState = @State(newState);

    Update: ->
        if @currentState isnt null and @currentState isnt undefined
            @currentState.Execute(@obj);

class State
    constructor: (@Execute, @Start, @End) ->

# expose to Torch
Torch.StateMachine = StateMachine
Torch.StateMachine.State = State
