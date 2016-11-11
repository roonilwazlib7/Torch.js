class Mouse
    constructor: (@game) ->
        @x = 0
        @y = 0
        @down = false

    SetMousePos: (c, evt) ->
        rect = c.getBoundingClientRect()
        @x = evt.clientX - rect.left
        @y = evt.clientY - rect.top

        if @game.gl_camera
            @SetThreePosition(evt)

    SetThreePosition: (evt) ->
        vector = new THREE.Vector3()
        camera = @game.gl_camera

        vector.set(
                    ( evt.clientX / window.innerWidth ) * 2 - 1,
                    -( evt.clientY / window.innerHeight ) * 2 + 1,
                    0.5 )

        vector.unproject( camera )

        dir = vector.sub( camera.position ).normalize()

        distance = - camera.position.z / dir.z

        pos = camera.position.clone().add( dir.multiplyScalar( distance ) )

        @x = pos.x + window.innerWidth / 1.45
        @y = -pos.y + window.innerHeight / 1.45

    GetRectangle: ->
        return new Torch.Rectangle(@x - @game.Viewport.x,
                                    @y - @game.Viewport.y, 5, 5);


# expose to torch
Torch.Mouse = Mouse
