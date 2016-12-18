class EffectManager
    tint: null
    mask: null

    constructor: (@sprite) ->
        @tint = new EffectComponent.Tint()
        @mask = new EffectComponent.Mask()


# a bunch of little effects containers
EffectComponent = {}

class EffectComponent.Tint
    _color: null
    _opacity: 0.5

    @property 'color',
        get: -> return @_color
        set: (value) -> @_color = value

    @property 'opacity',
        get: -> return @_opacity
        set: (value) -> @_opacity = value

class EffectComponent.Mask
    _texture: null
    _in: false
    _out: false
    # destination-in, destination-out
    @property 'texture',
        get: -> return @_texture
        set: (value) -> @_texture = value

    @property 'in',
        get: -> return @_in
        set: (value) -> @_in = value

    @property 'out',
        get: -> return @_out
        set: (value) -> @_out = value
