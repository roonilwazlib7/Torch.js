class HookManager
    positionTransform: null

    constructor: (@game) ->
        @positionTransform = new Torch.Point(0,0)

Torch.HookManager = HookManager
