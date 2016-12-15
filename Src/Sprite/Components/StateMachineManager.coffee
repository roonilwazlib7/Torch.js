class StateMachineManager
    constructor: (@sprite) ->
        @stateMachines = {}

    CreateStateMachine: (name) ->
        @stateMachines[name] = new StateMachine(@sprite)
        return @stateMachines[name]

    GetStateMachine: (name) ->
        return @stateMachines[name]

    Update: ->
        for key,sm of @stateMachines
            sm.Update()
