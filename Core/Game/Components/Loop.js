// Generated by CoffeeScript 1.11.1
(function() {
  var Loop;

  Loop = (function() {
    function Loop(game) {
      this.game = game;
      this.fps = 60;
    }

    Loop.prototype.RunGame = function() {
      this.game.draw(this);
      this.game.update(this);
      this.game.Camera.Update();
      this.game.Timer.Update();
      this.game.UpdateAndDrawSprites();
      this.game.UpdateAnimations();
      this.game.UpdateTimeInfo();
      this.game.UpdateTasks();
      return this.game.UpdateGamePads();
    };

    Loop.prototype.AdvanceFrame = function(timestamp) {
      if (this.game.time === void 0) {
        this.game.time = timestamp;
      }
      this.game.deltaTime = Math.round(timestamp - this.game.time);
      this.game.time = timestamp;
      this.RunGame();
      return window.requestAnimationFrame((function(_this) {
        return function(timestamp) {
          return _this.AdvanceFrame(timestamp);
        };
      })(this));
    };

    Loop.prototype.Run = function(timestamp) {
      return this.AdvanceFrame(0);
    };

    return Loop;

  })();

  Torch.Loop = Loop;

}).call(this);
