ExtensionProperties = (Class, properties...)->
    for prop in properties
        keyProp = prop.toLowerCase()
        func = (arg) ->
            return @light[keyProp] if arg is undefined
            @light[keyProp] = arg
            return @
        Class.prototype[prop] = func

class Light extends ThreeEntity
# tack on some properties
ExtensionProperties(Light, "Color", "Intensity", "Distance", "Power", "Decay", "Shadow", "Target")

class PointLight extends Light

    constructor: (color, intensity, distance, decay) ->
        @light = new THREE.PointLight(color, intensity, distance, decay)
        @Entity(@light)

class AmbientLight extends Light

    constructor: (color, intensity) ->
        @light = new THREE.AmbientLight(color, intensity)
        @Entity(@light)

class DirectionalLight extends Light

    constructor: (color, intensity) ->
        @light = new THREE.DirectionalLight(color, intensity)
        @Entity(@light)

class HemisphereLight extends Light

    constructor: (skyColor, groundColor, intensity) ->
        @light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
        @Entity(@light)

class SpotLight extends Light

    constructor: (color, intensity, distance, angle, penumbra, decay) ->
        @light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
        @Entity(@light)


Torch.PointLight = PointLight
Torch.AmbientLight = AmbientLight
Torch.DirectionalLight = DirectionalLight
Torch.HemisphereLight = HemisphereLight
Torch.SpotLight = SpotLight
