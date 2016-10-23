// Generated by CoffeeScript 1.10.0
(function() {
  var Game,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Game = (function(superClass) {
    extend(Game, superClass);

    function Game(canvasId, width, height, name, graphicsType) {
      this.canvasId = canvasId;
      this.width = width;
      this.height = height;
      this.name = name;
      this.graphicsType = graphicsType;
      this.InitGame();
    }

    Game.prototype.InitGraphics = function() {
      var light;
      this.gl_rendererContainer = document.getElementById(this.canvasId);
      light = new THREE.PointLight(0xff0000, 1, 100);
      light.position.set(0, 1, 0);
      this.gl_scene = new THREE.Scene();
      this.gl_camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 20000);
      this.gl_camera.position.z = 500;
      this.gl_renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.gl_renderer.setSize(window.innerWidth, window.innerHeight);
      this.gl_renderer.setPixelRatio(window.devicePixelRatio);
      this.gl_scene.add(light);
      this.canvasNode = this.gl_renderer.domElement;
      return this.gl_rendererContainer.appendChild(this.canvasNode);
    };

    Game.prototype.DrawSprites = function() {
      var i, len, ref, sprite;
      this.spriteList.sort(function(a, b) {
        return a.drawIndex - b.drawIndex;
      });
      ref = this.spriteList;
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        if (sprite.draw && !sprite.trash && !sprite.GHOST_SPRITE) {
          sprite.Draw();
        }
      }
      if (this.graphicsType === Torch.WEBGL) {
        this.gl_camera.lookAt(this.gl_scene.position);
        return this.gl_renderer.render(this.gl_scene, this.gl_camera);
      }
    };

    Game.prototype.Scene = function(item) {
      return this.gl_scene.add(item);
    };

    return Game;

  })(Torch.CanvasGame);

  Torch.WebGLGame = Game;

}).call(this);
