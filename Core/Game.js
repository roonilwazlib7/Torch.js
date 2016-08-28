// Generated by CoffeeScript 1.10.0
(function() {
  var Game;

  Game = (function() {
    function Game(canvasId, width1, height1, name1) {
      this.canvasId = canvasId;
      this.width = width1;
      this.height = height1;
      this.name = name1;
      console.log("%c   " + Torch.version + "-" + name + "  ", "background-color:#cc5200 color:white");
      this.canvasNode = document.getElementById(this.canvasId);
      this.canvas = this.canvasNode.getContext("2d");
      this.Clear("#cc5200");
      this.Load = new Torch.Load(this);
      this.Viewport = new Torch.Viewport(this);
      this.Mouse = new Torch.Mouse(this);
      this.Keys = new Torch.Keys();
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
      this.events = {};
    }

    Game.prototype.On = function(eventName, eventHandle) {
      this.events[eventName] = eventHandle;
      return this;
    };

    Game.prototype.Emit = function(eventName, eventArgs) {
      if (this.events[eventName] !== void 0) {
        this.events[eventName](eventArgs);
      }
      return this;
    };

    Game.prototype.PixelScale = function() {
      this.canvas.webkitImageSmoothingEnabled = false;
      this.canvas.mozImageSmoothingEnabled = false;
      this.canvas.imageSmoothingEnabled = false;
      return this;
    };

    Game.prototype.Bounds = function(boundRec) {
      if (boundRec === void 0) {
        this.BoundRec = this.Viewport.GetViewRectangle();
      }
      return this;
    };

    Game.prototype.Start = function(load, update, draw, init) {
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

    Game.prototype.Add = function(o) {
      if (o === void 0 || o._torch_add === void 0) {
        this.FatalError("Cannot add object: " + o.constructor.name + " to game");
      }
      o._torch_uid = "TORCHSPRITE" + this.uidCounter.toString();
      this.AddStack.push(o);
      return this.uidCounter++;
    };

    Game.prototype.Task = function(task) {
      this.taskList.push(task);
      return this;
    };

    Game.prototype.RunGame = function(timestamp) {
      if (this.time === void 0) {
        this.time = timestamp;
      }
      this.deltaTime = Math.round(timestamp - this.time);
      this.time = timestamp;
      this.canvas.clearRect(0, 0, this.Viewport.width, this.Viewport.height);
      this.draw(this);
      this.update(this);
      this.Viewport.Update();
      this.UpdateAndDrawSprites();
      this.UpdateAnimations();
      this.UpdateTimeInfo();
      this.UpdateTasks();
      Torch.Camera.Update();
      Torch.Timer.Update();
      this.UpdateGamePads();
      return window.requestAnimationFrame((function(_this) {
        return function(timestamp) {
          return _this.RunGame(timestamp);
        };
      })(this));
    };

    Game.prototype.Run = function(timestamp) {
      return this.RunGame(0);
    };

    Game.prototype.FlushSprites = function() {
      var i, len, ref, results, sprite;
      ref = this.spriteList;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        results.push(sprite.Trash());
      }
      return results;
    };

    Game.prototype.FatalError = function(error) {
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
      $("body").prepend("<code style='color:#C9302Cmargin-left:15%font-size:24px'>" + error + "</code><br><code style='color:#C9302Cfont-size:20pxfont-weight:bold'>Stack Trace:</code><br>");
      this.RunGame = function() {};
      this.Run = function() {};
      this.Emit("FatalError");
      throw error;
    };

    Game.prototype.UpdateTasks = function() {
      var i, len, ref, results, task;
      ref = this.taskList;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        task = ref[i];
        results.push(task());
      }
      return results;
    };

    Game.prototype.UpdateSprites = function() {
      var cleanedSprites, i, len, ref, sprite;
      cleanedSprites = [];
      ref = this.spriteList;
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        if (!sprite.trash) {
          if (!sprite.game.paused) {
            sprite.Update();
          }
          cleanedSprites.push(sprite);
        } else {
          sprite.trashed = true;
          sprite.Emit("Trash");
        }
      }
      return this.spriteList = cleanedSprites;
    };

    Game.prototype.DrawSprites = function() {
      var i, len, ref, results, sprite;
      this.spriteList.sort(function(a, b) {
        return a.drawIndex - b.drawIndex;
      });
      ref = this.spriteList;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        if (sprite.draw && !sprite.trash && !sprite.GHOST_SPRITE) {
          results.push(sprite.Draw());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Game.prototype.UpdateAndDrawSprites = function() {
      var i, len, o, ref;
      if (this.loading) {
        return;
      }
      this.DrawSprites();
      this.UpdateSprites();
      ref = this.AddStack;
      for (i = 0, len = ref.length; i < len; i++) {
        o = ref[i];
        this.spriteList.push(o);
      }
      return this.AddStack = [];
    };

    Game.prototype.UpdateAnimations = function() {
      var anim, i, len, ref, results;
      ref = this.animations;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        anim = ref[i];
        results.push(anim.Run());
      }
      return results;
    };

    Game.prototype.UpdateTimeInfo = function() {
      this.fps = Math.round(1000 / this.deltaTime);
      if (this.fps === Infinity) {
        this.allFPS += 0;
      } else {
        this.allFPS += Math.round(1000 / this.deltaTime);
      }
      this.ticks++;
      return this.averageFps = Math.round(this.allFPS / this.ticks);
    };

    Game.prototype.UpdateGamePads = function() {
      var i, len, pad, pads, results;
      if (navigator.getGamepads && typeof navigator.getGamepads) {
        this.GamePads = [];
        pads = navigator.getGamepads();
        results = [];
        for (i = 0, len = pads.length; i < len; i++) {
          pad = pads[i];
          if (pad) {
            results.push(this.GamePads.push(new Torch.GamePad(pad)));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    Game.prototype.Draw = function(texture, rectangle, params) {
      var height, ref, ref1, rotation, viewRect, width, x, y;
      if (params == null) {
        params = {};
      }
      viewRect = this.Viewport.GetViewRectangle();
      if (!rectangle.Intersects(viewRect)) {
        return;
      }
      this.canvas.save();
      x = Math.round(rectangle.x + this.Viewport.x);
      y = Math.round(rectangle.y + this.Viewport.y);
      width = rectangle.width;
      height = rectangle.height;
      rotation = (ref = params.rotation) != null ? ref : 0;
      rotation += this.Viewport.rotation;
      this.canvas.globalAlpha = (ref1 = params.alpha) != null ? ref1 : this.canvas.globalAlpha;
      this.canvas.translate(x + width / 2, y + height / 2);
      this.canvas.rotate(rotation);
      if (params.IsTextureSheet) {
        this.canvas.drawImage(texture.image, params.clipX, params.clipY, params.clipWidth, params.clipHeight, -width / 2, -height / 2, rectangle.width, rectangle.height);
      } else {
        this.canvas.drawImage(texture.image, -width / 2, -height / 2, rectangle.width, rectangle.height);
      }
      this.canvas.rotate(0);
      this.canvas.globalAlpha = 1;
      return this.canvas.restore();
    };

    Game.prototype.Clear = function(color) {
      if (color === void 0) {
        this.FatalError("Cannot clear undefined color");
      }
      if (typeof color === "object") {
        color = color.hex;
      }
      this.canvasNode.style.backgroundColor = color;
      return this;
    };

    Game.prototype.File = function(fileId) {
      if (this.Files[fileId] === void 0) {
        return this.FatalError("Unable to access no-existent file: " + fileId + ". File does not exist");
      } else {
        return this.Files[fileId];
      }
    };

    Game.prototype.Sound = function(soundId) {
      if (this.Assets.Sounds[soundId] === void 0) {
        return this.FatalError("Unable to access no-existent file: " + soundId + ". File does not exist");
      } else {
        return this.Assets.Sounds[soundId].audio;
      }
    };

    Game.prototype.getCanvasEvents = function() {
      var evts;
      evts = [
        [
          "mousemove", (function(_this) {
            return function(e) {
              return _this.Mouse.SetMousePos(_this.canvasNode, e);
            };
          })(this)
        ], [
          "mousedown", (function(_this) {
            return function(e) {
              return _this.Mouse.down = true;
            };
          })(this)
        ], [
          "mouseup", (function(_this) {
            return function(e) {
              return _this.Mouse.down = false;
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
              return false;
            };
          })(this)
        ]
      ];
      return evts;
    };

    Game.prototype.WireUpEvents = function() {
      var bodyEvents, eventItem, i, j, len, len1, pads, ref;
      bodyEvents = [
        [
          "keydown", (function(_this) {
            return function(e) {
              var c;
              c = e.keyCode;
              if (c === 32) {
                return _this.Keys.Space.down = true;
              } else if (c === 37) {
                return _this.Keys.LeftArrow.down = true;
              } else if (c === 38) {
                return _this.Keys.UpArrow.down = true;
              } else if (c === 39) {
                return _this.Keys.RightArrow.down = true;
              } else if (c === 40) {
                return _this.Keys.DownArrow.down = true;
              } else {
                return _this.Keys[String.fromCharCode(e.keyCode).toUpperCase()].down = true;
              }
            };
          })(this)
        ], [
          "keyup", (function(_this) {
            return function(e) {
              var c;
              c = e.keyCode;
              if (c === 32) {
                return _this.Keys.Space.down = false;
              } else if (c === 37) {
                return _this.Keys.LeftArrow.down = false;
              } else if (c === 38) {
                return _this.Keys.UpArrow.down = false;
              } else if (c === 39) {
                return _this.Keys.RightArrow.down = false;
              } else if (c === 40) {
                return _this.Keys.DownArrow.down = false;
              } else {
                return _this.Keys[String.fromCharCode(e.keyCode).toUpperCase()].down = false;
              }
            };
          })(this)
        ]
      ];
      ref = this.getCanvasEvents();
      for (i = 0, len = ref.length; i < len; i++) {
        eventItem = ref[i];
        this.canvasNode.addEventListener(eventItem[0], eventItem[1], false);
      }
      for (j = 0, len1 = bodyEvents.length; j < len1; j++) {
        eventItem = bodyEvents[j];
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
      return pads = navigator.getGamepads();

      /*
      for (var i = 0 i < pads.length i++)
      {
          @GamePads.push(new Torch.GamePad(pads[i]))
      }
       */
    };

    Game.prototype.TogglePause = function() {
      if (!this.paused) {
        this.paused = true;
      } else {
        this.paused = false;
      }
      return this;
    };

    return Game;

  })();

  Torch.Game = Game;

}).call(this);
