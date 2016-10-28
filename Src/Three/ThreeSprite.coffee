class ThreeSprite extends ThreeEntity

    constructor: (@sprite, material, shape) ->
        object = new THREE.Mesh(shape,material )

        object.position.z = @sprite.Rectangle.z # -10
        object.position.x = @sprite.Rectangle.x
        object.position.y = @sprite.Rectangle.y
        object.name = @sprite._torch_uid

        @sprite.game.gl_scene.add(object)
        @Entity(object)

    Position: (plane, optionalArgument) ->
        if optionalArgument is null or optionalArgument is undefined
            return @sprite.Rectangle[plane]
        else
            if typeof(optionalArgument) isnt "number"
                @game.FatalError("Cannot set position. Expected number, got: #{typeof(optionalArgument)}")
            @sprite.Rectangle[plane] = optionalArgument
            return @

    Rotation: (arg) ->
        @entity.rotation.z = arg
        return @

    Opacity: (arg) ->
        @entity.materials[0].opacity = arg
        return @

    DrawIndex: (arg) ->
        @entity.renderOrder = arg
        return @

Torch.ThreeSprite = ThreeSprite
