class ThreeSprite extends ThreeEntity

    constructor: (@sprite, material, shape) ->
        object = new THREE.Mesh(shape,material )

        object.position.z = @sprite.Rectangle.z # -10
        object.position.x = @sprite.Rectangle.x - window.innerWidth / 1.45 + @sprite.Rectangle.width / 2
        object.position.y = -@sprite.Rectangle.y + window.innerHeight / 1.45 - @sprite.Rectangle.height / 2
        object.name = @sprite._torch_uid

        @sprite.game.gl_scene.add(object)
        @mesh = object
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
        @entity.materials[0].opacity = arg
        return @

    DrawIndex: (arg) ->
        @entity.renderOrder = arg
        return @

    Remove: ->
        @sprite.game.gl_scene.remove(@mesh)

Torch.ThreeSprite = ThreeSprite
