class Camera
    constructor: (@game) ->
        @position = new Torch.Point(0,0)

    Update: ->
        @Bind()

    Bind: ->
        if @game.GL
            @game.gl_camera.position.set( @position.x, @position.y, @position.z)


# expose to Torch
Torch.Camera = Camera
