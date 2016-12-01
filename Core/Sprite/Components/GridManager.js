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

    GridManager.prototype.Position = function() {};

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
      return sprite.Grid.parent = this.sprite;
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
        point.x = (point.x + this.parent.Width() / 2) - (this.sprite.Width() / 2);
      }
      if (this.centerVertical) {
        point.y = (point.y + this.parent.Height() / 2) - (this.sprite.Height() / 2);
      }
      return point;
    };

    GridManager.prototype.ApplyAlignment = function(point) {
      if (this.alignLeft) {
        point.x = 0;
      }
      if (this.alignRight) {
        point.x = (point.x + this.parent.Width()) - this.sprite.Width();
      }
      if (this.alignTop) {
        point.y = 0;
      }
      if (this.alignBottom) {
        point.y = (point.y + this.parent.Height()) - this.sprite.Height();
      }
      return point;
    };

    GridManager.prototype.ResolveAbosolutePosition = function() {
      var basePoint;
      if (this.parent === null) {
        return this.sprite.Position();
      }
      basePoint = this.parent.Position();
      basePoint = this.ApplyCentering(basePoint);
      basePoint = this.ApplyAlignment(basePoint);
      basePoint.Apply(this.position);
      return basePoint;
    };

    GridManager.prototype.Update = function() {
      return this.sprite.Position(this.ResolveAbosolutePosition());
    };

    return GridManager;

  })();

}).call(this);