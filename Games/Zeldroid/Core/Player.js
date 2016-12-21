// Generated by CoffeeScript 1.12.1
(function() {
  var Player, PlayerBullet, idleState, moveState,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Player = (function(superClass) {
    extend(Player, superClass);

    Player.prototype.VELOCITY = 0.4;

    Player.prototype.stoppped = false;

    Player.prototype.touching = null;

    Player.prototype.health = 100;

    function Player(game) {
      var scale;
      this.InitSprite(game, 0, 0);
      this.Bind.Texture("player-right-idle");
      this.spriteSheetAnim = this.Animations.SpriteSheet(16, 16, 2);
      this.spriteSheetAnim.Stop();
      this.audioPlayer = this.game.Audio.CreateAudioPlayer();
      this.audioPlayer.volume = 0.25;
      this.movementStateMachine = this.States.CreateStateMachine("Movement");
      this.movementStateMachine.State("idle", idleState);
      this.movementStateMachine.State("move", moveState);
      this.movementStateMachine.Switch("idle");
      this.drawIndex = 11;
      this.facing = "forward";
      this.shootKeyWasDown = false;
      this.game.Camera.JerkFollow(this);
      this.game.Keys.Space.On("KeyUp", (function(_this) {
        return function() {
          var b;
          _this.audioPlayer.PlaySound("shoot");
          return b = new PlayerBullet(_this);
        };
      })(this));
      scale = this.game.GetScale();
      this.Size.Scale(scale, scale);
      this.SetUpCollisions();
    }

    Player.Load = function(game) {
      game.Load.Texture("Assets/Art/player/player-forward-idle.png", "player-forward-idle");
      game.Load.Texture("Assets/Art/player/player-backward-idle.png", "player-backward-idle");
      game.Load.Texture("Assets/Art/player/player-right-idle-sheet.png", "player-right-idle");
      game.Load.Texture("Assets/Art/player/player-left.png", "player-left-idle");
      game.Load.Texture("Assets/Art/player/bullet.png", "player-bullet");
      return game.Load.Texture("Assets/Art/player/shoot-particle.png", "shoot-particle");
    };

    Player.prototype.Update = function() {
      Player.__super__.Update.call(this);
      if (this.health <= 0) {
        return this.Trash();
      }
    };

    Player.prototype.SetUpCollisions = function() {
      this.Collisions.Monitor();
      return this.On("Collision", (function(_this) {
        return function(event) {
          return _this.HandleCollision(event);
        };
      })(this));
    };

    Player.prototype.HandleCollision = function(event) {
      if (!event.collisionData.collider.hardBlock) {
        return;
      }
      return this.Collisions.SimpleCollisionHandle(event, 0.5);
    };

    return Player;

  })(Torch.Sprite);

  idleState = {
    Execute: function(player) {
      if (this.game.Keys.W.down) {
        player.facing = "forward";
        return this.stateMachine.Switch("move", "W", {
          x: 0,
          y: -1
        });
      } else if (this.game.Keys.S.down) {
        player.facing = "backward";
        return this.stateMachine.Switch("move", "S", {
          x: 0,
          y: 1
        });
      } else if (this.game.Keys.D.down) {
        player.facing = "right";
        return this.stateMachine.Switch("move", "D", {
          x: 1,
          y: 0
        });
      } else if (this.game.Keys.A.down) {
        player.facing = "left";
        return this.stateMachine.Switch("move", "A", {
          x: -1,
          y: 0
        });
      }
    },
    Start: function(player) {
      player.Body.velocity.x = 0;
      return player.Body.velocity.y = 0;
    },
    End: function(player) {}
  };

  moveState = {
    Execute: function(player) {
      if (!this.game.Keys[this.triggerKey].down) {
        return this.stateMachine.Switch("idle");
      }
    },
    Start: function(player, key, velocity) {
      player.spriteSheetAnim.Start();
      player.Body.velocity.y = velocity.y * player.VELOCITY;
      player.Body.velocity.x = velocity.x * player.VELOCITY;
      this.triggerKey = key;
      switch (player.facing) {
        case "forward":
          player.Bind.Texture("player-forward-idle");
          return player.spriteSheetAnim.SyncFrame();
        case "backward":
          player.Bind.Texture("player-backward-idle");
          return player.spriteSheetAnim.SyncFrame();
        case "right":
          player.Bind.Texture("player-right-idle");
          return player.spriteSheetAnim.SyncFrame();
        case "left":
          player.Bind.Texture("player-left-idle");
          return player.spriteSheetAnim.SyncFrame();
      }
    },
    End: function(player) {
      player.spriteSheetAnim.Stop();
      return player.spriteSheetAnim.Index(0);
    }
  };

  PlayerBullet = (function(superClass) {
    extend(PlayerBullet, superClass);

    PlayerBullet.prototype.DAMAGE = 1;

    function PlayerBullet(shooter) {
      this.InitSprite(shooter.game, shooter.position.x, shooter.position.y);
      this.Bind.Texture("player-bullet");
      this.drawIndex = shooter.drawIndex + 1;
      this.shooter = shooter;
      this.VELOCITY = 1.5;
      switch (shooter.facing) {
        case "forward":
          this.Body.velocity.y = -1 * this.VELOCITY;
          this.position.y -= 0.3 * shooter.rectangle.height;
          this.position.x += 0.1 * shooter.rectangle.width;
          break;
        case "backward":
          this.Body.velocity.y = 1 * this.VELOCITY;
          this.position.x += 0.1 * shooter.rectangle.width;
          this.position.y += 0.3 * shooter.rectangle.height;
          break;
        case "right":
          this.Body.velocity.x = 1 * this.VELOCITY;
          this.position.x += 1.1 * shooter.rectangle.width;
          this.position.y += 0.25 * shooter.rectangle.height;
          this.rotation = Math.PI / 2;
          break;
        case "left":
          this.Body.velocity.x = -1 * this.VELOCITY;
          this.position.x -= 0.1 * shooter.rectangle.width;
          this.position.y += 0.25 * shooter.rectangle.height;
          this.rotation = Math.PI / 2;
      }
      this.Size.scale.width = this.Size.scale.height = 10;
      this.emitter = this.game.Particles.ParticleEmitter(500, 500, 500, true, "shoot-particle", {
        spread: 20,
        gravity: 0.0001,
        minAngle: 0,
        maxAngle: Math.PI * 2,
        minScale: 2,
        maxScale: 4,
        minVelocity: 0.01,
        maxVelocity: 0.01,
        minAlphaDecay: 200,
        maxAlphaDecay: 250,
        minOmega: 0.001,
        maxOmega: 0.001
      });
      this.emitter.auto = false;
      this.emitter.position = this.position.Clone();
      this.emitter.EmitParticles(true);
      this.Collisions.Monitor();
      this.On("Collision", (function(_this) {
        return function(event) {
          if (!event.collisionData.collider.hardBlock) {
            return;
          }
          event.collisionData.collider.hp -= _this.DAMAGE;
          _this.Trash();
          _this.emitter.particle = "particle";
          _this.emitter.position = _this.position.Clone();
          _this.emitter.EmitParticles(true);
          return _this.shooter.audioPlayer.PlaySound("shoot-explode");
        };
      })(this));
    }

    PlayerBullet.prototype.Update = function() {
      PlayerBullet.__super__.Update.call(this);
      if (this.Body.distance >= 500) {
        return this.Trash();
      }
    };

    return PlayerBullet;

  })(Torch.Sprite);

  window.Player = Player;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi4iLCJzb3VyY2VzIjpbIkdhbWVzXFxaZWxkcm9pZFxcU3JjXFxQbGF5ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBLE1BQUEsMENBQUE7SUFBQTs7O0VBQU07OztxQkFDRixRQUFBLEdBQVU7O3FCQUNWLFFBQUEsR0FBVTs7cUJBQ1YsUUFBQSxHQUFVOztxQkFDVixNQUFBLEdBQVE7O0lBQ0ssZ0JBQUMsSUFBRDtBQUNULFVBQUE7TUFBQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVosRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckI7TUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBYyxtQkFBZDtNQUVBLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixFQUF4QixFQUE0QixFQUE1QixFQUFnQyxDQUFoQztNQUNuQixJQUFDLENBQUEsZUFBZSxDQUFDLElBQWpCLENBQUE7TUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFaLENBQUE7TUFDZixJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsR0FBc0I7TUFFdEIsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBMkIsVUFBM0I7TUFDeEIsSUFBQyxDQUFBLG9CQUFvQixDQUFDLEtBQXRCLENBQTRCLE1BQTVCLEVBQW9DLFNBQXBDO01BQ0EsSUFBQyxDQUFBLG9CQUFvQixDQUFDLEtBQXRCLENBQTRCLE1BQTVCLEVBQW9DLFNBQXBDO01BQ0EsSUFBQyxDQUFBLG9CQUFvQixDQUFDLE1BQXRCLENBQTZCLE1BQTdCO01BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYTtNQUNiLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsZUFBRCxHQUFtQjtNQUVuQixJQUFDLENBQUEs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QSxLQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsR0FBb0I7VUFDcEIsS0FBQyxDQUFBLE9BQU8sQ0FBQyxRQUFULEdBQW9CLEtBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixDQUFBO1VBQ3BCLEtBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUF1QixJQUF2QjtpQkFDQSxLQUFDLENBQUEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFyQixDQUErQixlQUEvQjtRQVJhO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtJQTlDUzs7MkJBeURiLE1BQUEsR0FBUSxTQUFBO01BQ0osdUNBQUE7TUFDQSxJQUFHLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBTixJQUFrQixHQUFyQjtlQUNJLElBQUMsQ0FBQSxLQUFELENBQUEsRUFESjs7SUFGSTs7OztLQTNEZSxLQUFLLENBQUM7O0VBaUVqQyxNQUFNLENBQUMsTUFBUCxHQUFnQjtBQWhMaEIiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBUb3JjaC5TcHJpdGVcclxuICAgIFZFTE9DSVRZOiAwLjRcclxuICAgIHN0b3BwcGVkOiBmYWxzZVxyXG4gICAgdG91Y2hpbmc6IG51bGxcclxuICAgIGhlYWx0aDogMTAwXHJcbiAgICBjb25zdHJ1Y3RvcjogKGdhbWUpIC0+XHJcbiAgICAgICAgQEluaXRTcHJpdGUoZ2FtZSwgMCwgMClcclxuICAgICAgICBAQmluZC5UZXh0dXJlKFwicGxheWVyLXJpZ2h0LWlkbGVcIilcclxuXHJcbiAgICAgICAgQHNwcml0ZVNoZWV0QW5pbSA9IEBBbmltYXRpb25zLlNwcml0ZVNoZWV0KDE2LCAxNiwgMilcclxuICAgICAgICBAc3ByaXRlU2hlZXRBbmltLlN0b3AoKVxyXG5cclxuICAgICAgICBAYXVkaW9QbGF5ZXIgPSBAZ2FtZS5BdWRpby5DcmVhdGVBdWRpb1BsYXllcigpXHJcbiAgICAgICAgQGF1ZGlvUGxheWVyLnZvbHVtZSA9IDAuMjVcclxuXHJcbiAgICAgICAgQG1vdmVtZW50U3RhdGVNYWNoaW5lID0gQFN0YXRlcy5DcmVhdGVTdGF0ZU1hY2hpbmUoXCJNb3ZlbWVudFwiKVxyXG4gICAgICAgIEBtb3ZlbWVudFN0YXRlTWFjaGluZS5TdGF0ZShcImlkbGVcIiwgaWRsZVN0YXRlKVxyXG4gICAgICAgIEBtb3ZlbWVudFN0YXRlTWFjaGluZS5TdGF0ZShcIm1vdmVcIiwgbW92ZVN0YXRlKVxyXG4gICAgICAgIEBtb3ZlbWVudFN0YXRlTWFjaGluZS5Td2l0Y2goXCJpZGxlXCIpXHJcblxyXG4gICAgICAgIEBkcmF3SW5kZXggPSAxMVxyXG4gICAgICAgIEBmYWNpbmcgPSBcImZvcndhcmRcIlxyXG4gICAgICAgIEBzaG9vdEtleVdhc0Rvd24gPSBmYWxzZVxyXG5cclxuICAgICAgICBAZ2FtZS5DYW1lcmEuSmVya0ZvbGxvdyhAKVxyXG5cclxuICAgICAgICAjIHRoaXMgZXZlbnQgc3RpbGwgdHJpZ2dlcnMgZXZlbiB3aGVuIHNwcml0ZSBpcyBkZXN0cm95ZWRcclxuICAgICAgICBAZ2FtZS5LZXlzLlNwYWNlLk9uIFwiS2V5VXBcIiwgPT5cclxuICAgICAgICAgICAgQGF1ZGlvUGxheWVyLlBsYXlTb3VuZChcInNob290XCIpXHJcbiAgICAgICAgICAgIGIgPSBuZXcgUGxheWVyQnVsbGV0KEApXHJcblxyXG4gICAgICAgIHNjYWxlID0gQGdhbWUuR2V0U2NhbGUoKVxyXG4gICAgICAgIEBTaXplLlNjYWxlKHNjYWxlLCBzY2FsZSlcclxuXHJcbiAgICAgICAgQFNldFVwQ29sbGlzaW9ucygpXHJcblxyXG4gICAgQExvYWQ6IChnYW1lKSAtPlxyXG4gICAgICAgIGdhbWUuTG9hZC5UZXh0dXJlKFwiQXNzZXRzL0FydC9wbGF5ZXIvcGxheWVyLWZvcndhcmQtaWRsZS5wbmdcIiwgXCJwbGF5ZXItZm9yd2FyZC1pZGxlXCIpXHJcbiAgICAgICAgZ2FtZS5Mb2FkLlRleHR1cmUoXCJBc3NldHMvQXJ0L3BsYXllci9wbGF5ZXItYmFja3dhcmQtaWRsZS5wbmdcIiwgXCJwbGF5ZXItYmFja3dhcmQtaWRsZVwiKVxyXG4gICAgICAgIGdhbWUuTG9hZC5UZXh0dXJlKFwiQXNzZXRzL0FydC9wbGF5ZXIvcGxheWVyLXJpZ2h0LWlkbGUtc2hlZXQucG5nXCIsIFwicGxheWVyLXJpZ2h0LWlkbGVcIilcclxuICAgICAgICBnYW1lLkxvYWQuVGV4dHVyZShcIkFzc2V0cy9BcnQvcGxheWVyL3BsYXllci1sZWZ0LnBuZ1wiLCBcInBsYXllci1sZWZ0LWlkbGVcIilcclxuXHJcbiAgICAgICAgZ2FtZS5Mb2FkLlRleHR1cmUoXCJBc3NldHMvQXJ0L3BsYXllci9idWxsZXQucG5nXCIsIFwicGxheWVyLWJ1bGxldFwiKVxyXG4gICAgICAgIGdhbWUuTG9hZC5UZXh0dXJlKFwiQXNzZXRzL0FydC9wbGF5ZXIvc2hvb3QtcGFydGljbGUucG5nXCIsIFwic2hvb3QtcGFydGljbGVcIilcclxuXHJcbiAgICBVcGRhdGU6IC0+XHJcbiAgICAgICAgc3VwZXIoKVxyXG5cclxuICAgICAgICBAVHJhc2goKSBpZiBAaGVhbHRoIDw9IDBcclxuXHJcbiAgICBTZXRVcENvbGxpc2lvbnM6IC0+XHJcbiAgICAgICAgQENvbGxpc2lvbnMuTW9uaXRvcigpXHJcbiAgICAgICAgQE9uIFwiQ29sbGlzaW9uXCIsIChldmVudCkgPT5cclxuICAgICAgICAgICAgQEhhbmRsZUNvbGxpc2lvbihldmVudClcclxuXHJcbiAgICBIYW5kbGVDb2xsaXNpb246IChldmVudCkgLT5cclxuICAgICAgICByZXR1cm4gaWYgbm90IGV2ZW50LmNvbGxpc2lvbkRhdGEuY29sbGlkZXIuaGFyZEJsb2NrXHJcbiAgICAgICAgQENvbGxpc2lvbnMuU2ltcGxlQ29sbGlzaW9uSGFuZGxlKGV2ZW50LCAwLjUpXHJcblxyXG5cclxuaWRsZVN0YXRlID1cclxuICAgIEV4ZWN1dGU6IChwbGF5ZXIpIC0+XHJcbiAgICAgICAgaWYgQGdhbWUuS2V5cy5XLmRvd25cclxuICAgICAgICAgICAgcGxheWVyLmZhY2luZyA9IFwiZm9yd2FyZFwiXHJcbiAgICAgICAgICAgIEBzdGF0ZU1hY2hpbmUuU3dpdGNoKFwibW92ZVwiLCBcIldcIiwge3g6IDAsIHk6IC0xfSlcclxuICAgICAgICBlbHNlIGlmIEBnYW1lLktleXMuUy5kb3duXHJcbiAgICAgICAgICAgIHBsYXllci5mYWNpbmcgPSBcImJhY2t3YXJkXCJcclxuICAgICAgICAgICAgQHN0YXRlTWFjaGluZS5Td2l0Y2goXCJtb3ZlXCIsIFwiU1wiLCB7eDogMCwgeTogMX0pXHJcbiAgICAgICAgZWxzZSBpZiBAZ2FtZS5LZXlzLkQuZG93blxyXG4gICAgICAgICAgICBwbGF5ZXIuZmFjaW5nID0gXCJyaWdodFwiXHJcbiAgICAgICAgICAgIEBzdGF0ZU1hY2hpbmUuU3dpdGNoKFwibW92ZVwiLCBcIkRcIiwge3g6IDEsIHk6IDB9KVxyXG4gICAgICAgIGVsc2UgaWYgQGdhbWUuS2V5cy5BLmRvd25cclxuICAgICAgICAgICAgcGxheWVyLmZhY2luZyA9IFwibGVmdFwiXHJcbiAgICAgICAgICAgIEBzdGF0ZU1hY2hpbmUuU3dpdGNoKFwibW92ZVwiLCBcIkFcIiwge3g6IC0xLCB5OiAwfSlcclxuXHJcbiAgICBTdGFydDogKHBsYXllcikgLT5cclxuICAgICAgICBwbGF5ZXIuQm9keS52ZWxvY2l0eS54ID0gMFxyXG4gICAgICAgIHBsYXllci5Cb2R5LnZlbG9jaXR5LnkgPSAwXHJcblxyXG4gICAgRW5kOiAocGxheWVyKSAtPlxyXG4gICAgICAgICMgLi4uXHJcblxyXG5tb3ZlU3RhdGUgPVxyXG4gICAgRXhlY3V0ZTogKHBsYXllcikgLT5cclxuICAgICAgICBpZiBub3QgQGdhbWUuS2V5c1tAdHJpZ2dlcktleV0uZG93blxyXG4gICAgICAgICAgICBAc3RhdGVNYWNoaW5lLlN3aXRjaChcImlkbGVcIilcclxuXHJcbiAgICBTdGFydDogKHBsYXllciwga2V5LCB2ZWxvY2l0eSkgLT5cclxuICAgICAgICBwbGF5ZXIuc3ByaXRlU2hlZXRBbmltLlN0YXJ0KClcclxuICAgICAgICBwbGF5ZXIuQm9keS52ZWxvY2l0eS55ID0gdmVsb2NpdHkueSAqIHBsYXllci5WRUxPQ0lUWVxyXG4gICAgICAgIHBsYXllci5Cb2R5LnZlbG9jaXR5LnggPSB2ZWxvY2l0eS54ICogcGxheWVyLlZFTE9DSVRZXHJcbiAgICAgICAgQHRyaWdnZXJLZXkgPSBrZXlcclxuXHJcbiAgICAgICAgc3dpdGNoIHBsYXllci5mYWNpbmdcclxuICAgICAgICAgICAgd2hlbiBcImZvcndhcmRcIlxyXG4gICAgICAgICAgICAgICAgcGxheWVyLkJpbmQuVGV4dHVyZShcInBsYXllci1mb3J3YXJkLWlkbGVcIilcclxuICAgICAgICAgICAgICAgIHBsYXllci5zcHJpdGVTaGVldEFuaW0uU3luY0ZyYW1lKClcclxuICAgICAgICAgICAgd2hlbiBcImJhY2t3YXJkXCJcclxuICAgICAgICAgICAgICAgIHBsYXllci5CaW5kLlRleHR1cmUoXCJwbGF5ZXItYmFja3dhcmQtaWRsZVwiKVxyXG4gICAgICAgICAgICAgICAgcGxheWVyLnNwcml0ZVNoZWV0QW5pbS5TeW5jRnJhbWUoKVxyXG4gICAgICAgICAgICB3aGVuIFwicmlnaHRcIlxyXG4gICAgICAgICAgICAgICAgcGxheWVyLkJpbmQuVGV4dHVyZShcInBsYXllci1yaWdodC1pZGxlXCIpXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc3ByaXRlU2hlZXRBbmltLlN5bmNGcmFtZSgpXHJcbiAgICAgICAgICAgIHdoZW4gXCJsZWZ0XCJcclxuICAgICAgICAgICAgICAgIHBsYXllci5CaW5kLlRleHR1cmUoXCJwbGF5ZXItbGVmdC1pZGxlXCIpXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc3ByaXRlU2hlZXRBbmltLlN5bmNGcmFtZSgpXHJcblxyXG4gICAgRW5kOiAocGxheWVyKSAtPlxyXG4gICAgICAgIHBsYXllci5zcHJpdGVTaGVldEFuaW0uU3RvcCgpXHJcbiAgICAgICAgcGxheWVyLnNwcml0ZVNoZWV0QW5pbS5JbmRleCgwKVxyXG5cclxuY2xhc3MgUGxheWVyQnVsbGV0IGV4dGVuZHMgVG9yY2guU3ByaXRlXHJcbiAgICBEQU1BR0U6IDFcclxuICAgIGNvbnN0cnVjdG9yOiAoc2hvb3RlcikgLT5cclxuICAgICAgICBASW5pdFNwcml0ZShzaG9vdGVyLmdhbWUsIHNob290ZXIucG9zaXRpb24ueCwgc2hvb3Rlci5wb3NpdGlvbi55KVxyXG4gICAgICAgIEBCaW5kLlRleHR1cmUoXCJwbGF5ZXItYnVsbGV0XCIpXHJcbiAgICAgICAgQGRyYXdJbmRleCA9IHNob290ZXIuZHJhd0luZGV4ICsgMVxyXG4gICAgICAgIEBzaG9vdGVyID0gc2hvb3RlclxyXG4gICAgICAgIEBWRUxPQ0lUWSA9IDEuNVxyXG4gICAgICAgIHN3aXRjaCBzaG9vdGVyLmZhY2luZ1xyXG4gICAgICAgICAgICB3aGVuIFwiZm9yd2FyZFwiXHJcbiAgICAgICAgICAgICAgICBAQm9keS52ZWxvY2l0eS55ID0gLTEgKiBAVkVMT0NJVFlcclxuICAgICAgICAgICAgICAgIEBwb3NpdGlvbi55IC09IDAuMyAqIHNob290ZXIucmVjdGFuZ2xlLmhlaWdodFxyXG4gICAgICAgICAgICAgICAgQHBvc2l0aW9uLnggKz0gMC4xICogc2hvb3Rlci5yZWN0YW5nbGUud2lkdGhcclxuICAgICAgICAgICAgd2hlbiBcImJhY2t3YXJkXCJcclxuICAgICAgICAgICAgICAgIEBCb2R5LnZlbG9jaXR5LnkgPSAxICogQFZFTE9DSVRZXHJcbiAgICAgICAgICAgICAgICBAcG9zaXRpb24ueCArPSAwLjEgKiBzaG9vdGVyLnJlY3RhbmdsZS53aWR0aFxyXG4gICAgICAgICAgICAgICAgQHBvc2l0aW9uLnkgKz0gMC4zICogc2hvb3Rlci5yZWN0YW5nbGUuaGVpZ2h0XHJcbiAgICAgICAgICAgIHdoZW4gXCJyaWdodFwiXHJcbiAgICAgICAgICAgICAgICBAQm9keS52ZWxvY2l0eS54ID0gMSAqIEBWRUxPQ0lUWVxyXG4gICAgICAgICAgICAgICAgQHBvc2l0aW9uLnggKz0gMS4xICogc2hvb3Rlci5yZWN0YW5nbGUud2lkdGhcclxuICAgICAgICAgICAgICAgIEBwb3NpdGlvbi55ICs9IDAuMjUgKiBzaG9vdGVyLnJlY3RhbmdsZS5oZWlnaHRcclxuICAgICAgICAgICAgICAgIEByb3RhdGlvbiA9IE1hdGguUEkvMlxyXG4gICAgICAgICAgICB3aGVuIFwibGVmdFwiXHJcbiAgICAgICAgICAgICAgICBAQm9keS52ZWxvY2l0eS54ID0gLTEgKiBAVkVMT0NJVFlcclxuICAgICAgICAgICAgICAgIEBwb3NpdGlvbi54IC09IDAuMSAqIHNob290ZXIucmVjdGFuZ2xlLndpZHRoXHJcbiAgICAgICAgICAgICAgICBAcG9zaXRpb24ueSArPSAwLjI1ICogc2hvb3Rlci5yZWN0YW5nbGUuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICBAcm90YXRpb24gPSBNYXRoLlBJLzJcclxuXHJcbiAgICAgICAgQFNpemUuc2NhbGUud2lkdGggPSBAU2l6ZS5zY2FsZS5oZWlnaHQgPSAxMFxyXG5cclxuICAgICAgICBAZW1pdHRlciA9IEBnYW1lLlBhcnRpY2xlcy5QYXJ0aWNsZUVtaXR0ZXIgNTAwLCA1MDAsIDUwMCwgdHJ1ZSwgXCJzaG9vdC1wYXJ0aWNsZVwiLFxyXG4gICAgICAgICAgICBzcHJlYWQ6IDIwXHJcbiAgICAgICAgICAgIGdyYXZpdHk6IDAuMDAwMVxyXG4gICAgICAgICAgICBtaW5BbmdsZTogMFxyXG4gICAgICAgICAgICBtYXhBbmdsZTogTWF0aC5QSSAqIDJcclxuICAgICAgICAgICAgbWluU2NhbGU6IDJcclxuICAgICAgICAgICAgbWF4U2NhbGU6IDRcclxuICAgICAgICAgICAgbWluVmVsb2NpdHk6IDAuMDFcclxuICAgICAgICAgICAgbWF4VmVsb2NpdHk6IDAuMDFcclxuICAgICAgICAgICAgbWluQWxwaGFEZWNheTogMjAwXHJcbiAgICAgICAgICAgIG1heEFscGhhRGVjYXk6IDI1MFxyXG4gICAgICAgICAgICBtaW5PbWVnYTogMC4wMDFcclxuICAgICAgICAgICAgbWF4T21lZ2E6IDAuMDAxXHJcbiAgICAgICAgQGVtaXR0ZXIuYXV0byA9IGZhbHNlXHJcbiAgICAgICAgQGVtaXR0ZXIucG9zaXRpb24gPSBAcG9zaXRpb24uQ2xvbmUoKVxyXG4gICAgICAgIEBlbWl0dGVyLkVtaXRQYXJ0aWNsZXModHJ1ZSlcclxuXHJcbiAgICAgICAgQENvbGxpc2lvbnMuTW9uaXRvcigpXHJcbiAgICAgICAgQE9uIFwiQ29sbGlzaW9uXCIsIChldmVudCkgPT5cclxuICAgICAgICAgICAgcmV0dXJuIGlmIG5vdCBldmVudC5jb2xsaXNpb25EYXRhLmNvbGxpZGVyLmhhcmRCbG9ja1xyXG4gICAgICAgICAgICBldmVudC5jb2xsaXNpb25EYXRhLmNvbGxpZGVyLmhwIC09IEBEQU1BR0VcclxuICAgICAgICAgICAgQFRyYXNoKClcclxuXHJcbiAgICAgICAgICAgIEBlbWl0dGVyLnBhcnRpY2xlID0gXCJwYXJ0aWNsZVwiXHJcbiAgICAgICAgICAgIEBlbWl0dGVyLnBvc2l0aW9uID0gQHBvc2l0aW9uLkNsb25lKClcclxuICAgICAgICAgICAgQGVtaXR0ZXIuRW1pdFBhcnRpY2xlcyh0cnVlKVxyXG4gICAgICAgICAgICBAc2hvb3Rlci5hdWRpb1BsYXllci5QbGF5U291bmQoXCJzaG9vdC1leHBsb2RlXCIpXHJcblxyXG5cclxuICAgIFVwZGF0ZTogLT5cclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgaWYgQEJvZHkuZGlzdGFuY2UgPj0gNTAwXHJcbiAgICAgICAgICAgIEBUcmFzaCgpXHJcblxyXG5cclxud2luZG93LlBsYXllciA9IFBsYXllclxyXG4iXX0=
//# sourceURL=C:\dev\js\Torch.js\Games\Zeldroid\Src\Player.coffee