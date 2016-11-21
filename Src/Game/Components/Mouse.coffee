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
        return new Torch.Rectangle(@x - @game.Viewport.x,
                                    @y - @game.Viewport.y, 5, 5);


# expose to torch
Torch.Mouse = Mouse
