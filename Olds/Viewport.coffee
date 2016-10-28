class Viewport
    constructor: (@game) ->
        @x = 0
        @y = 0
        @width = 0
        @height = 0
        @rotation = 0

    Update: ->

    GetViewRectangle: ->
        return new Torch.Rectangle(-@x, -@y, @width, @height);

# expose to Torch
Torch.Viewport = Viewport
