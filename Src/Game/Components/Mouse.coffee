class Mouse
    constructor: (@game) ->
        @x = 0
        @y = 0
        @down = false

    SetMousePos: (c, evt) ->
        rect = c.getBoundingClientRect()
        @x = evt.clientX - rect.left
        @y = evt.clientY - rect.top

    GetRectangle: ->
        return new Rectangle(@x, @y, 5, 5);
