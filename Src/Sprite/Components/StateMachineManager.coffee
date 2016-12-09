class StateMachineManager
    constructor: (@sprite) ->
        @stateMachines = {}

    CreateStateMachine: (name) ->
        @stateMachines[name] = new Torch.StateMachine(@sprite)
        return @stateMachines[name]

    GetStateMachine: (name) ->
        return @stateMachines[name]

    Update: ->
        for key,sm of @stateMachines
            sm.Update()

Torch.StateMachineManager = StateMachineManager
