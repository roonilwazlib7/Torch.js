// Generated by CoffeeScript 1.11.1
(function() {
  var CanvasRenderer, exports;

  exports = this;

  CanvasRenderer = (function() {
    function CanvasRenderer(sprite) {
      this.sprite = sprite;
      this.game = this.sprite.game;
    }

    CanvasRenderer.prototype.Draw = function() {
      var DrawParams, DrawRec, drawParams, frame, params, ref;
      DrawRec = new Torch.Rectangle(this.sprite.Rectangle.x, this.sprite.Rectangle.y, this.sprite.Rectangle.width, this.sprite.Rectangle.height);
      if (this.sprite.fixed) {
        DrawRec.x -= this.sprite.game.Viewport.x;
        DrawRec.y -= this.sprite.game.Viewport.y;
      }
      if (this.sprite.TexturePack) {
        return this.sprite.game.Draw(this.sprite.GetCurrentDraw(), DrawRec, this.sprite.DrawParams);
      } else if (this.sprite.TextureSheet) {
        frame = this.sprite.GetCurrentDraw();
        drawParams = (ref = this.sprite.DrawParams) != null ? ref : {};
        params = Object.create(drawParams);
        params.clipX = frame.clipX;
        params.clipY = frame.clipY;
        params.clipWidth = frame.clipWidth;
        params.clipHeight = frame.clipHeight;
        params.IsTextureSheet = true;
        params.rotation = this.sprite.rotation;
        params.alpha = this.sprite.opacity;
        return this.sprite.game.Render(this.sprite.DrawTexture, DrawRec, params);
      } else if (this.sprite.DrawTexture) {
        DrawParams = {
          alpha: this.sprite.opacity,
          rotation: this.sprite.rotation
        };
        return this.sprite.game.Render(this.sprite.GetCurrentDraw(), DrawRec, DrawParams);
      }
    };

    CanvasRenderer.prototype.Render = function(texture, rectangle, params) {
      var canvas, height, ref, ref1, rotation, viewRect, viewport, width, x, y;
      if (params == null) {
        params = {};
      }
      canvas = this.game.canvas;
      viewport = this.game.Viewport;
      viewRect = viewport.GetViewRectangle();
      if (!rectangle.Intersects(viewRect)) {
        return;
      }
      canvas.save();
      x = Math.round(rectangle.x + viewport.x);
      y = Math.round(rectangle.y + viewport.y);
      width = rectangle.width;
      height = rectangle.height;
      rotation = (ref = params.rotation) != null ? ref : 0;
      rotation += viewport.rotation;
      canvas.globalAlpha = (ref1 = params.alpha) != null ? ref1 : canvas.globalAlpha;
      canvas.translate(x + width / 2, y + height / 2);
      canvas.rotate(rotation);
      if (params.IsTextureSheet) {
        canvas.drawImage(texture.image, params.clipX, params.clipY, params.clipWidth, params.clipHeight, -width / 2, -height / 2, rectangle.width, rectangle.height);
      } else {
        canvas.drawImage(texture.image, -width / 2, -height / 2, rectangle.width, rectangle.height);
      }
      canvas.rotate(0);
      canvas.globalAlpha = 1;
      return canvas.restore();
    };

    return CanvasRenderer;

  })();

  exports.CanvasRenderer = CanvasRenderer;

}).call(this);
