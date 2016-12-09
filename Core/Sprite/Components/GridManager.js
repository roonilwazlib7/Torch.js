// Generated by CoffeeScript 1.10.0
(function() {
  var GridManager,
    slice = [].slice;

  GridManager = (function() {
    GridManager.prototype.parent = null;

    GridManager.prototype.children = null;

    GridManager.prototype.centered = false;

    GridManager.prototype.centerVertical = false;

    GridManager.prototype.alignLeft = false;

    GridManager.prototype.alignRight = false;

    GridManager.prototype.alignTop = false;

    GridManager.prototype.alignBottom = false;

    function GridManager(sprite1) {
      this.sprite = sprite1;
      this.position = new Torch.Point(0, 0);
      this.children = [];
    }

    GridManager.prototype.Align = function() {
      var i, len, positionTags, results, tag;
      positionTags = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      results = [];
      for (i = 0, len = positionTags.length; i < len; i++) {
        tag = positionTags[i];
        switch (tag) {
          case "left":
            results.push(this.alignLeft = true);
            break;
          case "right":
            results.push(this.alignRight = true);
            break;
          case "top":
            results.push(this.alignTop = true);
            break;
          case "bottom":
            results.push(this.alignBottom = true);
            break;
          default:
            results.push(void 0);
        }
      }
      return results;
    };

    GridManager.prototype.Center = function(turnOn) {
      if (turnOn == null) {
        turnOn = true;
      }
      return this.centered = turnOn;
    };

    GridManager.prototype.CenterVertical = function(turnOn) {
      if (turnOn == null) {
        turnOn = true;
      }
      return this.centerVertical = turnOn;
    };

    GridManager.prototype.Append = function(sprite) {
      sprite.Grid.parent = this.sprite;
      sprite.drawIndex = this.sprite.drawIndex + 1;
      return sprite.fixed = this.sprite.fixed;
    };

    GridManager.prototype.Parent = function() {
      return this.parent;
    };

    GridManager.prototype.Children = function(matcher) {
      var child, children, i, key, len, matching, ref, value;
      if (!matcher) {
        return this.children;
      }
      children = [];
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        matching = true;
        for (key in matcher) {
          value = matcher[key];
          if (!child[key] === value) {
            matching = false;
          }
        }
        if (matching) {
          children.append(child);
        }
      }
      return children;
    };

    GridManager.prototype.Ancestors = function(matcher) {
      var ancestor, ancestors, key, matched, results, value;
      if (!this.parent) {
        return null;
      }
      ancestors = [];
      ancestor = this.parent;
      results = [];
      while (ancestor.Parent() !== null) {
        if (!matcher) {
          ancestors.push(ancestor);
        } else {
          matched = true;
          for (key in matcher) {
            value = matcher[key];
            if (ancestor[key] !== value) {
              matched = false;
            }
          }
          if (matched) {
            ancestors.push(ancestor);
          }
        }
        results.push(ancestor = ancestor.Parent());
      }
      return results;
    };

    GridManager.prototype.ApplyCentering = function(point) {
      if (this.centered) {
        point.x = (point.x + this.parent.rectangle.width / 2) - (this.sprite.rectangle.width / 2);
      }
      if (this.centerVertical) {
        point.y = (point.y + this.parent.rectangle.height / 2) - (this.sprite.rectangle.height / 2);
      }
      return point;
    };

    GridManager.prototype.ApplyAlignment = function(point) {
      if (this.alignLeft) {
        point.x = 0;
      }
      if (this.alignRight) {
        point.x = point.x + (this.parent.rectangle.width - this.sprite.rectangle.width);
      }
      if (this.alignTop) {
        point.y = 0;
      }
      if (this.alignBottom) {
        point.y = point.y + (this.parent.rectangle.height - this.sprite.rectangle.height);
      }
      return point;
    };

    GridManager.prototype.ResolveAbosolutePosition = function() {
      var basePoint;
      if (this.parent === null) {
        return this.sprite.position;
      }
      basePoint = this.parent.position.Clone();
      basePoint = this.ApplyCentering(basePoint);
      basePoint = this.ApplyAlignment(basePoint);
      basePoint.Apply(this.position);
      return basePoint;
    };

    GridManager.prototype.Update = function() {
      this.sprite.position = this.ResolveAbosolutePosition();
      if (this.parent !== null) {
        this.sprite.drawIndex = this.parent.drawIndex + 1;
        return this.sprite.fixed = this.parent.fixed;
      }
    };

    return GridManager;

  })();

  Torch.GridManager = GridManager;

}).call(this);
