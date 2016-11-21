// Generated by CoffeeScript 1.10.0
(function() {
  var Bind, CanvasBind, WebGLBind;

  Bind = (function() {
    function Bind(sprite) {
      if (sprite.GL) {
        return new WebGLBind(sprite);
      }
      return new CanvasBind(sprite);
    }

    return Bind;

  })();

  CanvasBind = (function() {
    function CanvasBind(sprite1) {
      this.sprite = sprite1;
    }

    CanvasBind.prototype.Reset = function() {
      if (this.sprite.TextureSheetAnimation) {
        this.sprite.TextureSheetAnimation.Stop();
        this.sprite.anim = null;
        this.sprite.TextureSheet = null;
      }
      if (this.sprite.TexturePackAnimation) {
        this.sprite.TexturePackAnimation.Stop();
        this.sprite.anim = null;
        return this.sprite.TexturePack = null;
      }
    };

    CanvasBind.prototype.WebGLTexture = function(textureId) {
      var height, map, material, texture, width;
      texture = null;
      map = null;
      if (textureId.gl_2d_canvas_generated_image) {
        texture = textureId;
        map = textureId.texture;
      } else {
        texture = this.sprite.game.Assets.Textures[textureId];
        map = this.sprite.game.Assets.Textures[textureId].gl_texture;
      }
      if (!this.sprite.Scale()) {
        width = texture.width * Torch.Scale;
        height = texture.height * Torch.Scale;
      } else {
        width = texture.width * this.sprite.Scale();
        height = texture.height * this.sprite.Scale();
      }
      this.sprite.gl_shape = new THREE.PlaneGeometry(width, height, 8, 8);
      material = new THREE.MeshPhongMaterial({
        map: map
      });
      material.transparent = true;
      this.sprite.gl_three_sprite = new Torch.ThreeSprite(this.sprite, material, this.sprite.gl_shape);
      this.sprite.gl_orig_width = width;
      this.sprite.gl_orig_height = height;
      this.sprite.Rectangle.width = width;
      return this.sprite.Rectangle.height = height;
    };

    CanvasBind.prototype.Texture = function() {
      return function(textureId, optionalParameters) {
        var scale, tex;
        if (this.sprite.GL) {
          this.WebGLTexture(textureId);
          return;
        }
        tex = null;
        if (typeof textureId === "string") {
          tex = this.sprite.game.Assets.Textures[textureId];
          if (!tex) {
            this.sprite.game.FatalError("Sprite.Bind.Texture given textureId '" + textureId + "' was not found");
          }
        } else {
          tex = textureId;
        }
        scale = 1;
        this.Reset();
        if (Torch.Scale && !this.sprite.TEXT) {
          scale = Torch.Scale;
        }
        if (typeof textureId === "string") {
          this.sprite.DrawTexture = tex;
        } else {
          this.sprite.DrawTexture = {
            image: textureId
          };
        }
        this.sprite.Rectangle.width = tex.width * scale;
        this.sprite.Rectangle.height = tex.height * scale;
        return this.sprite.DrawTexture;
      };
    };

    CanvasBind.prototype.TexturePack = function() {

      /*
      this whole thing needs to be re-written
      here is the old javascript:
      
          var that = this;
      
          if (!optionalParameters) optionalParameters = {};
      
          var texturePack = @sprite.game.Assets.TexturePacks[texturePackId];
          if (!texturePack)
          {
              @sprite.game.FatalError(new Error("Sprite.Bind.TexturePack given texturePackId '{0}' was not found".format(texturePackId)));
          }
          else
          {
              @sprite.TexturePack = texturePack;
          }
          var anim = new Torch.Animation.TexturePack(@sprite.TexturePack, @sprite.game);
      
          if (optionalParameters.step) anim.step = optionalParameters.step;
      
          anim.Start();
          @sprite.TexturePackAnimation = anim;
          @sprite.Rectangle.width = anim.GetCurrentFrame().width;
          @sprite.Rectangle.height = anim.GetCurrentFrame().height;
          return anim;
       */
    };

    CanvasBind.prototype.TextureSheet = function(textureSheetId, optionalParameters) {
      var anim, drawTexture, textureSheet;
      if (optionalParameters == null) {
        optionalParameters = {};
      }
      textureSheet = this.sprite.game.Assets.TextureSheets[textureSheetId];
      drawTexture = this.sprite.game.Assets.Textures[textureSheetId];
      if (!textureSheet || !drawTexture) {
        this.sprite.game.FatalError("Sprite.Bind.TextureSheet given textureSheetId '" + textureSheetId + "' was not found");
      } else {
        this.sprite.DrawTexture = drawTexture;
        this.sprite.TextureSheet = textureSheet;
      }
      anim = new Torch.Animation.TextureSheet(this.sprite.TextureSheet, this.sprite.game);
      anim.sprite = this.sprite;
      if (optionalParameters.delay) {
        anim.delay = optionalParameters.delay;
        anim.delayCount = anim.delay;
      }
      if (optionalParameters.step) {
        anim.step = optionalParameters.step;
      }
      anim.Start();
      this.sprite.TextureSheetAnimation = anim;
      this.sprite.Rectangle.width = anim.GetCurrentFrame().clipWidth * Torch.Scale;
      this.sprite.Rectangle.height = anim.GetCurrentFrame().clipHeight * Torch.Scale;
      return anim;
    };

    return CanvasBind;

  })();

  WebGLBind = (function() {
    function WebGLBind(sprite1) {
      this.sprite = sprite1;
    }

    WebGLBind.prototype.Texture = function(textureId) {
      var height, map, material, shape, texture, textureAsset, width;
      textureAsset = null;
      if (textureId.gl_2d_canvas_generated_image) {
        texture = new THREE.TextureLoader().load(this.src);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        textureAsset = {
          width: textureId.image.width,
          height: textureId.image.height,
          gl_texture: texture
        };
      } else {
        textureAsset = this.sprite.game.Assets.Textures[textureId];
      }
      width = textureAsset.width * Torch.Scale;
      height = textureAsset.height * Torch.Scale;
      map = textureAsset.gl_texture;
      shape = new THREE.PlaneGeometry(width, height, 8, 8);
      material = new THREE.MeshPhongMaterial({
        map: map,
        transparent: true
      });
      this.sprite.gl_three_sprite = new Torch.ThreeSprite(this.sprite, material, shape);
      this.sprite.gl_orig_width = width;
      this.sprite.gl_orig_height = height;
      this.sprite.Rectangle.width = width;
      return this.sprite.Rectangle.height = height;
    };

    return WebGLBind;

  })();

  Torch.Bind = Bind;

}).call(this);
