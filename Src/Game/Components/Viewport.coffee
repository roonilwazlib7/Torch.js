class Viewport
    constructor: (@game) ->
        @x = 0
        @y = 0
        @width = 0
        @height = 0
        @rotation = 0

    GetViewRectangle: ->
        return new Torch.Rectangle(-@x, -@y, @width, @height);

    HalfWidth: ->
        return @width/2

    HalfHeight: ->
        return @height/2

# expose to Torch
Torch.Viewport = Viewport
