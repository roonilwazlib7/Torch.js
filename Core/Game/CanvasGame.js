// Generated by CoffeeScript 1.10.0

/*
    @class Torch.Game
    @author roonilwazlib

    @constructor
        @param canvasId, string, REQUIRED
        @param width, number|string, REQUIRED
        @param height, number|string, REQUIRED
        @param name, string, REQUIRED
        @param graphicsType, enum, REQUIRED
        @param pixel, enum

    @description
        Torch.Canvas game controls the base behavior of a Torch game. The gameloop,
        asset loading, and initialization are handled here. Torch.CanvasGame
        dictates the HTML5 2d canvas be used for rendering, as opposed to WEBGL
 */

(function() {
  var CanvasGame;

  CanvasGame = (function() {
    Game.MixIn(Torch.EventDispatcher);

    function CanvasGame(canvasId, width, height, name, graphicsType, pixel) {
      this.canvasId = canvasId;
      this.width = width;
      this.height = height;
      this.name = name;
      this.graphicsType = graphicsType;
      this.pixel = pixel != null ? pixel : 0;
      this.InitGame();
    }

    CanvasGame.prototype.InitGame = function() {
      this.InitGraphics();
      this.InitComponents();
      return this.InitEventDispatch();
    };

    CanvasGame.prototype.InitComponents = function() {
      var _char, _keys, i;
      console.log("%c Torch v" + Torch.Version + " - " + this.name, "background-color:#" + Torch.Color.Flame + "; color:white; padding:2px; padding-right:5px;padding-left:5px");
      this.Load = new Torch.Load(this);
      this.Viewport = new Torch.Viewport(this);
      this.Mouse = new Torch.Mouse(this);
      this.Timer = new Torch.Timer(this);
      this.Audio = new Torch.Audio(this);
      _keys = {};
      i = 0;
      while (i < 230) {
        _char = String.fromCharCode(i).toUpperCase();
        _keys[_char] = {
          down: false
        };
        i++;
      }
      _keys["Space"] = {
        down: false
      };
      _keys["LeftArrow"] = {
        down: false
      };
      _keys["RightArrow"] = {
        down: false
      };
      _keys["UpArrow"] = {
        down: false
      };
      _keys["DownArrow"] = {
        down: false
      };
      this.Keys = _keys;
      this.deltaTime = 0;
      this.fps = 0;
      this.averageFps = 0;
      this.allFPS = 0;
      this.ticks = 0;
      this.zoom = 1;
      this.uidCounter = 0;
      this.paused = false;
      this.time = null;
      this.LastTimeStamp = null;
      this.spriteList = [];
      this.taskList = [];
      this.animations = [];
      this.DrawStack = [];
      this.AddStack = [];
      this.GamePads = [];
      return this.events = {};
    };

    CanvasGame.prototype.InitGraphics = function() {
      this.canvasNode = document.getElementById(this.canvasId);
      this.canvas = this.canvasNode.getContext("2d");
      return this.Clear("#cc5200");
    };

    CanvasGame.prototype.PixelScale = function() {
      this.canvas.webkitImageSmoothingEnabled = false;
      this.canvas.mozImageSmoothingEnabled = false;
      this.canvas.imageSmoothingEnabled = false;
      return this;
    };

    CanvasGame.prototype.Bounds = function(boundRec) {
      if (boundRec === void 0) {
        this.BoundRec = this.Viewport.GetViewRectangle();
      }
      return this;
    };

    CanvasGame.prototype.Start = function(load, update, draw, init) {
      if (load === void 0) {
        this.FatalError("Unable to start game '" + this.name + "' without load function");
      }
      if (update === void 0) {
        this.FatalError("Unable to start game '" + this.name + "' without update function");
      }
      if (draw === void 0) {
        this.FatalError("Unable to start game '" + this.name + "' without draw function");
      }
      if (init === void 0) {
        this.FatalError("Unable to start game '" + this.name + "' without update function");
      }
      this.load = load;
      this.update = update;
      this.draw = draw;
      this.init = init;
      this.load(this);
      this.Load.Load((function(_this) {
        return function() {
          _this.init(_this);
          _this.WireUpEvents();
          return _this.Run();
        };
      })(this));
      if (this.graphicsType === Torch.WEBGL) {
        return;
      }
      this.canvasNode.width = this.width;
      this.canvasNode.height = this.height;
      if (typeof this.width === "string") {
        this.canvasNode.width = document.body.clientWidth - 50;
      }
      if (typeof this.height === "string") {
        this.canvasNode.height = document.body.clientHeight - 25;
      }
      this.Viewport.width = this.canvasNode.width;
      return this.Viewport.height = this.canvasNode.height;
    };

    CanvasGame.prototype.Add = function(o) {
      if (o === void 0 || o._torch_add === void 0) {
        this.FatalError("Cannot add object: " + o.constructor.name + " to game");
      }
      if (o._torch_add === "Sprite") {
        o._torch_uid = "TORCHSPRITE" + this.uidCounter.toString();
        this.AddStack.push(o);
        return this.uidCounter++;
      } else if (o._torch_add === "Three") {
        return this.gl_scene.add(o.entity);
      } else if (o._torch_add === "Task") {
        return this.taskList.push(o);
      }
    };

    CanvasGame.prototype.Task = function(task) {
      this.taskList.push(task);
      return this;
    };

    CanvasGame.prototype.RunGame = function(timestamp) {
      if (this.time === void 0) {
        this.time = timestamp;
      }
      this.deltaTime = Math.round(timestamp - this.time);
      this.time = timestamp;
      this.draw(this);
      this.update(this);
      this.Camera.Update();
      this.Timer.Update();
      this.UpdateAndDrawSprites();
      this.UpdateAnimations();
      this.UpdateTimeInfo();
      this.UpdateTasks();
      this.UpdateGamePads();
      return window.requestAnimationFrame((function(_this) {
        return function(timestamp) {
          return _this.RunGame(timestamp);
        };
      })(this));
    };

    CanvasGame.prototype.Run = function(timestamp) {
      return this.RunGame(0);
    };

    CanvasGame.prototype.FlushSprites = function() {
      var j, len, ref, results, sprite;
      ref = this.spriteList;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        sprite = ref[j];
        results.push(sprite.Trash());
      }
      return results;
    };

    CanvasGame.prototype.FatalError = function(error) {
      var stack;
      if (this.fatal) {
        return;
      }
      this.fatal = true;
      if (typeof error === "string") {
        error = new Error(error);
      }
      this.Clear("#000");
      stack = error.stack.replace(/\n/g, "<br><br>");
      $("body").empty();
      $("body").prepend("<code style='color:#C9302Cfont-size:18px'>Time: " + this.time + "</code>");
      $("body").prepend("<code style='color:#C9302Cfont-size:20px'>" + stack + "</code><br>");
      $("body").prepend("<code style='color:#C9302Cmargin-left:15%font-size:24px'> " + error + " </code><br> <code style='color:#C9302Cfont-size:20pxfont-weight:bold'>Stack Trace:</code><br>");
      this.RunGame = function() {};
      this.Run = function() {};
      this.Emit("FatalError", new Torch.EventArgs(this, {
        error: error
      }));
      throw error;
    };

    CanvasGame.prototype.UpdateTasks = function() {
      var cleanedTasks, j, len, ref, task;
      cleanedTasks = [];
      ref = this.taskList;
      for (j = 0, len = ref.length; j < len; j++) {
        task = ref[j];
        task.Execute(this);
        if (!task.trash) {
          cleanedTasks.push(task);
        }
      }
      return this.taskList = cleanedTasks;
    };

    CanvasGame.prototype.UpdateSprites = function() {
      var cleanedSprites, j, len, ref, sprite;
      cleanedSprites = [];
      ref = this.spriteList;
      for (j = 0, len = ref.length; j < len; j++) {
        sprite = ref[j];
        if (!sprite.trash) {
          if (!sprite.game.paused) {
            sprite.Update();
          }
          cleanedSprites.push(sprite);
        } else {
          sprite.trashed = true;
          sprite.Emit("Trash", new Torch.EventArgs(this));
        }
      }
      return this.spriteList = cleanedSprites;
    };

    CanvasGame.prototype.DrawSprites = function() {
      var j, len, ref, results, sprite;
      this.canvas.clearRect(0, 0, this.Viewport.width, this.Viewport.height);
      this.spriteList.sort(function(a, b) {
        return a.drawIndex - b.drawIndex;
      });
      ref = this.spriteList;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        sprite = ref[j];
        if (sprite.draw && !sprite.trash && !sprite.GHOST_SPRITE) {
          results.push(sprite.Draw());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    CanvasGame.prototype.UpdateAndDrawSprites = function() {
      var j, len, o, ref;
      if (this.loading) {
        return;
      }
      this.DrawSprites();
      this.UpdateSprites();
      ref = this.AddStack;
      for (j = 0, len = ref.length; j < len; j++) {
        o = ref[j];
        this.spriteList.push(o);
      }
      return this.AddStack = [];
    };

    CanvasGame.prototype.UpdateAnimations = function() {
      var anim, j, len, ref, results;
      ref = this.animations;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        anim = ref[j];
        results.push(anim.Run());
      }
      return results;
    };

    CanvasGame.prototype.UpdateTimeInfo = function() {
      this.fps = Math.round(1000 / this.deltaTime);
      if (this.fps === Infinity) {
        this.allFPS += 0;
      } else {
        this.allFPS += Math.round(1000 / this.deltaTime);
      }
      this.ticks++;
      return this.averageFps = Math.round(this.allFPS / this.ticks);
    };

    CanvasGame.prototype.UpdateGamePads = function() {
      var j, len, pad, pads, results;
      if (navigator.getGamepads && typeof navigator.getGamepads) {
        this.GamePads = [];
        pads = navigator.getGamepads();
        results = [];
        for (j = 0, len = pads.length; j < len; j++) {
          pad = pads[j];
          if (pad) {
            results.push(this.GamePads.push(new Torch.GamePad(pad)));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    CanvasGame.prototype.Clear = function(color) {
      if (color === void 0) {
        this.FatalError("Cannot clear undefined color");
      }
      if (typeof color === "object") {
        color = color.hex;
      }
      this.canvasNode.style.backgroundColor = color;
      return this;
    };

    CanvasGame.prototype.File = function(fileId) {
      if (this.Files[fileId] === void 0) {
        return this.FatalError("Unable to access no-existent file: " + fileId + ". File does not exist");
      } else {
        return this.Files[fileId];
      }
    };

    CanvasGame.prototype.Sound = function(soundId) {
      if (this.Assets.Sounds[soundId] === void 0) {
        return this.FatalError("Unable to access no-existent file: " + soundId + ". File does not exist");
      } else {
        return this.Assets.Sounds[soundId].audio;
      }
    };

    CanvasGame.prototype.getCanvasEvents = function() {
      var evts;
      evts = [
        [
          "mousemove", (function(_this) {
            return function(e) {
              _this.Mouse.SetMousePos(_this.canvasNode, e);
              return _this.Emit("MouseMove", new Torch.EventArgs(_this, {
                nativeEvent: e
              }));
            };
          })(this)
        ], [
          "mousedown", (function(_this) {
            return function(e) {
              _this.Mouse.down = true;
              return _this.Emit("MouseDown", new Torch.EventArgs(_this, {
                nativeEvent: e
              }));
            };
          })(this)
        ], [
          "mouseup", (function(_this) {
            return function(e) {
              _this.Mouse.down = false;
              return _this.Emit("MouseUp", new Torch.EventArgs(_this, {
                nativeEvent: e
              }));
            };
          })(this)
        ], [
          "touchstart", (function(_this) {
            return function(e) {
              return _this.Mouse.down = true;
            };
          })(this)
        ], [
          "touchend", (function(_this) {
            return function(e) {
              return _this.Mouse.down = false;
            };
          })(this)
        ], [
          "click", (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              _this.Emit("Click", new Torch.EventArgs(_this, {
                nativeEvent: e
              }));
              return false;
            };
          })(this)
        ]
      ];
      return evts;
    };

    CanvasGame.prototype.getBodyEvents = function() {};

    CanvasGame.prototype.WireUpEvents = function() {
      var eventItem, j, k, len, len1, pads, ref, ref1, resize;
      ref = this.getCanvasEvents();
      for (j = 0, len = ref.length; j < len; j++) {
        eventItem = ref[j];
        this.canvasNode.addEventListener(eventItem[0], eventItem[1], false);
      }
      ref1 = this.getBodyEvents();
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        eventItem = ref1[k];
        document.body.addEventListener(eventItem[0], eventItem[1], false);
      }
      window.addEventListener("gamepadconnected", (function(_this) {
        return function(e) {
          var gp;
          gp = navigator.getGamepads()[e.gamepad.index];
          _this.GamePads.push(new Torch.GamePad(gp));
          return console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
        };
      })(this));
      resize = (function(_this) {
        return function(event) {
          _this.Viewport.width = window.innerWidth;
          _this.Viewport.height = window.innerHeight;
          return _this.Emit("Resize", new Torch.EventArgs(_this, {
            nativeEvent: event
          }));
        };
      })(this);
      window.addEventListener('resize', resize, false);
      return pads = navigator.getGamepads();

      /*
      for (var i = 0 i < pads.length i++)
      {
          @GamePads.push(new Torch.GamePad(pads[i]))
      }
       */
    };

    CanvasGame.prototype.TogglePause = function() {
      if (!this.paused) {
        this.paused = true;
      } else {
        this.paused = false;
      }
      return this;
    };

    return CanvasGame;

  })();

  Torch.CanvasGame = CanvasGame;

}).call(this);
