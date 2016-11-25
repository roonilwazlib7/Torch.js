// Generated by CoffeeScript 1.11.1
(function() {
  var AmbientLight, DirectionalLight, ExtensionProperties, HemisphereLight, Light, PointLight, SpotLight,
    slice = [].slice,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ExtensionProperties = function() {
    var Class, func, i, keyProp, len, prop, properties, results;
    Class = arguments[0], properties = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    results = [];
    for (i = 0, len = properties.length; i < len; i++) {
      prop = properties[i];
      keyProp = prop.toLowerCase();
      func = function(arg) {
        if (arg === void 0) {
          return this.light[keyProp];
        }
        this.light[keyProp] = arg;
        return this;
      };
      results.push(Class.prototype[prop] = func);
    }
    return results;
  };

  Light = (function(superClass) {
    extend(Light, superClass);

    function Light() {
      return Light.__super__.constructor.apply(this, arguments);
    }

    return Light;

  })(ThreeEntity);

  ExtensionProperties(Light, "Color", "Intensity", "Distance", "Power", "Decay", "Shadow", "Target");

  PointLight = (function(superClass) {
    extend(PointLight, superClass);

    function PointLight(color, intensity, distance, decay) {
      this.light = new THREE.PointLight(color, intensity, distance, decay);
      this.Entity(this.light);
    }

    return PointLight;

  })(Light);

  AmbientLight = (function(superClass) {
    extend(AmbientLight, superClass);

    function AmbientLight(color, intensity) {
      this.light = new THREE.AmbientLight(color, intensity);
      this.Entity(this.light);
    }

    return AmbientLight;

  })(Light);

  DirectionalLight = (function(superClass) {
    extend(DirectionalLight, superClass);

    function DirectionalLight(color, intensity) {
      this.light = new THREE.DirectionalLight(color, intensity);
      this.Entity(this.light);
    }

    return DirectionalLight;

  })(Light);

  HemisphereLight = (function(superClass) {
    extend(HemisphereLight, superClass);

    function HemisphereLight(skyColor, groundColor, intensity) {
      this.light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      this.Entity(this.light);
    }

    return HemisphereLight;

  })(Light);

  SpotLight = (function(superClass) {
    extend(SpotLight, superClass);

    function SpotLight(color, intensity, distance, angle, penumbra, decay) {
      this.light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
      this.Entity(this.light);
    }

    return SpotLight;

  })(Light);

  Torch.PointLight = PointLight;

  Torch.AmbientLight = AmbientLight;

  Torch.DirectionalLight = DirectionalLight;

  Torch.HemisphereLight = HemisphereLight;

  Torch.SpotLight = SpotLight;

}).call(this);