// Generated by CoffeeScript 1.10.0
(function() {
  var CanvasRenderer, exports;

  exports = this;

  CanvasRenderer = (function() {
    function CanvasRenderer(sprite) {
      this.sprite = sprite;
      this.game = this.sprite.game;
      this.previousPosition = new Torch.Point(this.sprite.position.x, this.sprite.position.y);
    }

    CanvasRenderer.prototype.Draw = function() {
      var cameraTransform, drawRec, frame;
      drawRec = new Torch.Rectangle(this.sprite.position.x, this.sprite.position.y, this.sprite.rectangle.width, this.sprite.rectangle.height);
      drawRec.x = (this.sprite.position.x - this.previousPosition.x) * this.game.Loop.lagOffset + this.previousPosition.x;
      drawRec.y = (this.sprite.position.y - this.previousPosition.y) * this.game.Loop.lagOffset + this.previousPosition.y;
      this.previousPosition = new Torch.Point(this.sprite.position.x, this.sprite.position.y);
      cameraTransform = new Torch.Point(0, 0);
      if (!this.sprite.fixed) {
        drawRec.x += this.game.Camera.position.x + this.game.Hooks.positionTransform.x;
        drawRec.y += this.game.Camera.position.y + this.game.Hooks.positionTransform.y;
      }
      if (this.sprite.TextureSheet) {
        frame = this.sprite.GetCurrentDraw();
        this.PreRender(drawRec);
        canvas.drawImage(this.sprite.DrawTexture.image, frame.clipX, frame.clipY, frame.clipWidth, frame.clipHeight, -drawRec.width / 2, -drawRec.height / 2, drawRec.width, drawRec.height);
        return this.PostRender();
      } else if (this.sprite.DrawTexture) {
        this.PreRender(drawRec);
        this.game.canvas.drawImage(this.sprite.DrawTexture.image, -drawRec.width / 2, -drawRec.height / 2, drawRec.width, drawRec.height);
        if (this.sprite.Body.DEBUG && false) {
          this.game.canvas.fillStyle = "green";
          this.game.canvas.globalAlpha = 0.5;
          this.game.canvas.fillRect(-drawRec.width / 2, -drawRec.height / 2, drawRec.width, drawRec.height);
        }
        return this.PostRender();
      }
    };

    CanvasRenderer.prototype.PreRender = function(drawRec) {
      var canvas;
      canvas = this.game.canvas;
      canvas.save();
      canvas.translate(drawRec.x + drawRec.width / 2, drawRec.y + drawRec.height / 2);
      if (this.sprite.Effects.tint.color !== null) {
        this.game.canvas.fillStyle = this.sprite.Effects.tint.color;
        this.game.canvas.globalAlpha = this.sprite.Effects.tint.opacity;
        this.game.canvas.globalCompositeOperation = "destination-atop";
        this.game.canvas.fillRect(-drawRec.width / 2, -drawRec.height / 2, drawRec.width, drawRec.height);
      }
      canvas.globalAlpha = this.sprite.opacity;
      return canvas.rotate(this.sprite.rotation);
    };

    CanvasRenderer.prototype.PostRender = function() {
      var canvas;
      canvas = this.game.canvas;
      return canvas.restore();
    };

    return CanvasRenderer;

  })();

  exports.CanvasRenderer = CanvasRenderer;

}).call(this);
