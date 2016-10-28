exports = this

class ThreeEntity
    game: null
    entity: null
    _torch_add: "Three"

    Entity: (entity) ->
        @entity = entity

    Remove: ->
        if @game isnt null
            @game.gl_scene.remove(@entity)

    Position: (plane, value) ->

        return @entity.position[plane] if value is undefined

        @entity.position[plane] = value
        return @

exports.ThreeEntity = ThreeEntity
