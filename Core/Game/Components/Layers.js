// Generated by CoffeeScript 1.11.1
(function() {
  var Layer, Layers;

  Layer = (function() {
    function Layer(drawIndex) {
      this.drawIndex = drawIndex;
      this.children = [];
      this.mapIndex - this.drawIndex;
    }

    Layer.prototype.DrawIndex = function(index) {
      var child, i, len, ref;
      if (!index) {
        return this.drawIndex;
      }
      this.drawIndex = index;
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        child.DrawIndex(index);
      }
      return this;
    };

    Layer.prototype.Add = function(child) {
      child.DrawIndex(this.index);
      return this.children.push(child);
    };

    return Layer;

  })();

  Layers = (function() {
    function Layers(game) {
      this.game = game;
      this.layers = [];
      this.layerMap = {};
    }

    Layers.prototype.Add = function(layerName) {
      var i, layer, len, name, results;
      layer = null;
      if (typeof layerName === "string") {
        layer = new Layer(this.layers.length);
        this.layerName[layerName] = layer;
        return this.layers.add(layer);
      } else {
        results = [];
        for (i = 0, len = layerName.length; i < len; i++) {
          name = layerName[i];
          layer = new Layer(this.layers.length);
          this.layerMap[name] = layer;
          results.push(this.layers.add(layer));
        }
        return results;
      }
    };

    Layers.prototype.Remove = function(layerName, tryToFill) {
      var cleanedLayers, i, index, item, l, layer, len, ref, results;
      if (!this.layerMap[layerName]) {
        return Torch.FatalError("Unable to remove layer '" + layerName + "'. Layer does not exist");
      } else {
        cleanedLayers = [];
        layer = layerMap[layerName];
        layer.Trash();
        delete this.layerMap[layerName];
        ref = this.layers;
        results = [];
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          item = ref[index];
          l = cleanedLayers[index];
          if (index !== layer.mapIndex) {
            cleanedLayers.push(l);
            if (tryToFill) {
              results.push(l.DrawIndex(l.DrawIndex() - 1));
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    Layers.prototype.Get = function(layerName) {
      if (!this.layerMap[layerName]) {
        return Torch.FatalError("Unable to get layer '" + layerName + "'. Layer does not exist");
      } else {
        return this.layerMap[layerName];
      }
    };

    return Layers;

  })();

  Torch.Layers = Layers;

}).call(this);
