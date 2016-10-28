class ThreeSprite extends ThreeEntity

    constructor: (sprite, material, shape) ->
        object = new THREE.Mesh(shape , material )

        object.position.z = @sprite.Rectangle.z # -10
        object.position.x = @sprite.Rectangle.x
        object.position.y = @sprite.Rectangle.y
        object.name = sprite._torch_uid

        sprite.game.gl_scene.add(object)
        @Entity(object)

    Rotation: (arg) ->
        @entity.rotation.z = arg

    Opacity: (arg) ->
        @entity.materials[0].opacity = arg

    DrawIndex: (arg) ->
        @entity.renderOrder = arg
