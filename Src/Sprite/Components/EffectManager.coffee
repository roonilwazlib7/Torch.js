class EffectManager
    tint: null
    mask: null

    constructor: (@sprite) ->
        @tint = {color: null, opacity: 0.5}
        @mask = {texture: null, in: false, out: false} # destination-in, destination-out
