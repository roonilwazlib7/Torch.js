class Camera
    position: null

    constructor: (@game) ->
        @position = new Torch.Point(0,0)

    Update: ->

# expose to Torch
Torch.Camera = Camera
