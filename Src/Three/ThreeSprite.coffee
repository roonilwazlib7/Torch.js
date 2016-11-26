class ThreeSprite extends ThreeEntity

    constructor: (@sprite, material, shape) ->
        object = new THREE.Mesh(shape,material )
        transform = @sprite.GetThreeTransform("x")
        object.position.z = @sprite.Rectangle.z
        object.position.x = transform.x
        object.position.y = transform.y
        object.name = @sprite._torch_uid

        @sprite.game.gl_scene.add(object)
        @Entity(object)

    Position: (plane, optionalArgument) ->
        if optionalArgument is null or optionalArgument is undefined
            return @entity.position[plane]
        else
            if typeof(optionalArgument) isnt "number"
                @game.FatalError("Cannot set position. Expected number, got: #{typeof(optionalArgument)}")
            @entity.position[plane] = optionalArgument
            return @

    Rotation: (arg) ->
        @entity.rotation.z = arg
        return @

    Opacity: (arg) ->
        @entity.material.opacity = arg
        return @

    DrawIndex: (arg) ->
        @entity.renderOrder = arg
        return @

    Width: (arg) ->
        @entity.scale.x = arg / @sprite.gl_orig_width
        return @

    Height: (arg) ->
        @entity.scale.y = arg / @sprite.gl_orig_height
        return @

    Remove: ->
        @sprite.game.gl_scene.remove(@entity)

Torch.ThreeSprite = ThreeSprite
