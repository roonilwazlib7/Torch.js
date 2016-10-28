ExtensionProperties = (Class, properties...)->

    for prop in properties
        keyProp = prop.toLowerCase()
        func = (arg) ->
            return @light[keyProp] if arg is undefined
            @light[keyProp] = arg
            return @
        Class.prototype[prop] = func

class Light
    _torch_add: "Light"
    Remove: ->
        @game.gl_scene.remove(@light)

    Position: (plane, value) ->

        return @light.position[plane] if value is undefined

        @light.position[plane] = value
        return @


# tack on some properties
ExtensionProperties(Light, "Color", "Intensity", "Distance", "Power", "Decay", "Shadow", "Target")

class PointLight extends Light

    constructor: (color, intensity, distance, decay) ->
        @light = new THREE.PointLight(color, intensity, distance, decay)

class AmbientLight extends Light

    constructor: (color, intensity) ->
        @light = new THREE.AmbientLight(color, intensity)

class DirectionalLight extends Light

    constructor: (color, intensity) ->
        @light = new THREE.DirectionalLight(color, intensity)

class HemisphereLight extends Light

    constructor: (skyColor, groundColor, intensity) ->
        @light = new THREE.HemisphereLight(skyColor, groundColor, intensity)

class SpotLight extends Light

    constructor: (color, intensity, distance, angle, penumbra, decay) ->
        @light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)


Torch.PointLight = PointLight
Torch.AmbientLight = AmbientLight
Torch.DirectionalLight = DirectionalLight
Torch.HemisphereLight = HemisphereLight
Torch.SpotLight = SpotLight
