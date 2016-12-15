// Generated by CoffeeScript 1.12.1
(function() {
  var HUD, exports;

  exports = this;

  HUD = (function() {
    function HUD(game1) {
      this.game = game1;
      this.build = JSON.parse(this.game.File("package"));
      this.hud_background = new Torch.Sprite(this.game, 0, 0);
      this.hud_background.Bind.Texture("hud_background");
      this.hud_background.Size.Scale(1, 1);
      this.hud_background.drawIndex = 100;
      this.hud_background.Size.height = this.Height(5);
      this.hud_background.Size.width = window.innerWidth;
      this.hud_background.fixed = true;
      this.build_info = new Torch.Text(this.game, 0, 0, {
        text: "Zeldroid-dev-build:" + this.build.GameConfig.Build,
        color: "red"
      });
      this.hud_background.Grid.Append(this.build_info);
      this.game.Camera.position.y += this.hud_background.Size.height;
    }

    HUD.Load = function(game) {
      return game.Load.Texture("Assets/Art/hud-design.png", "hud_background");
    };

    HUD.prototype.BindEvents = function() {};

    HUD.prototype.Width = function(scale) {
      if (scale == null) {
        scale = 1;
      }
      return window.innerWidth / scale;
    };

    HUD.prototype.Height = function(scale) {
      if (scale == null) {
        scale = 1;
      }
      return window.innerHeight / scale;
    };

    return HUD;

  })();

  exports.HUD = HUD;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFVELmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi4iLCJzb3VyY2VzIjpbIkdhbWVzXFxaZWxkcm9pZFxcU3JjXFxIVUQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUFVOztFQUNKO0lBQ1csYUFBQyxLQUFEO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFDVixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsU0FBWCxDQUFYO01BQ1QsSUFBQyxDQUFBLGNBQUQsR0FBc0IsSUFBQSxLQUFLLENBQUMsTUFBTixDQUFhLElBQUMsQ0FBQSxJQUFkLEVBQW9CLENBQXBCLEVBQXVCLENBQXZCO01BQ3RCLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQXJCLENBQTZCLGdCQUE3QjtNQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQXJCLENBQTJCLENBQTNCLEVBQTZCLENBQTdCO01BQ0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixHQUE0QjtNQUM1QixJQUFDLENBQUEsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFyQixHQUE4QixJQUFDLENBQUEsTUFBRCxDQUFRLENBQVI7TUFDOUIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBckIsR0FBNkIsTUFBTSxDQUFDO01BQ3BDLElBQUMsQ0FBQSxjQUFjLENBQUMsS0FBaEIsR0FBd0I7TUFFeEIsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLElBQUMsQ0FBQSxJQUFaLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQ2Q7UUFBQSxJQUFBLEVBQU0scUJBQUEsR0FBc0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBOUM7UUFDQSxLQUFBLEVBQU8sS0FEUDtPQURjO01BS2xCLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQXJCLENBQTRCLElBQUMsQ0FBQSxVQUE3QjtNQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUF0QixJQUEyQixJQUFDLENBQUEsY0FBYyxDQUFDLElBQUksQ0FBQztJQWpCdkM7O0lBbUJiLEdBQUMsQ0FBQSxJQUFELEdBQU8sU0FBQyxJQUFEO2FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFWLENBQWtCLDJCQUFsQixFQUErQyxnQkFBL0M7SUFERzs7a0JBR1AsVUFBQSxHQUFZLFNBQUEsR0FBQTs7a0JBRVosS0FBQSxHQUFPLFNBQUMsS0FBRDs7UUFBQyxRQUFROztBQUNaLGFBQU8sTUFBTSxDQUFDLFVBQVAsR0FBb0I7SUFEeEI7O2tCQUdQLE1BQUEsR0FBUSxTQUFDLEtBQUQ7O1FBQUMsUUFBUTs7QUFDYixhQUFPLE1BQU0sQ0FBQyxXQUFQLEdBQXFCO0lBRHhCOzs7Ozs7RUFJWixPQUFPLENBQUMsR0FBUixHQUFjO0FBakNkIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cyA9IHRoaXNcclxuY2xhc3MgSFVEXHJcbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxyXG4gICAgICAgIEBidWlsZCA9IEpTT04ucGFyc2UoQGdhbWUuRmlsZShcInBhY2thZ2VcIikpXHJcbiAgICAgICAgQGh1ZF9iYWNrZ3JvdW5kID0gbmV3IFRvcmNoLlNwcml0ZShAZ2FtZSwgMCwgMClcclxuICAgICAgICBAaHVkX2JhY2tncm91bmQuQmluZC5UZXh0dXJlKFwiaHVkX2JhY2tncm91bmRcIilcclxuICAgICAgICBAaHVkX2JhY2tncm91bmQuU2l6ZS5TY2FsZSgxLDEpXHJcbiAgICAgICAgQGh1ZF9iYWNrZ3JvdW5kLmRyYXdJbmRleCA9IDEwMFxyXG4gICAgICAgIEBodWRfYmFja2dyb3VuZC5TaXplLmhlaWdodCA9IEBIZWlnaHQoNSlcclxuICAgICAgICBAaHVkX2JhY2tncm91bmQuU2l6ZS53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXHJcbiAgICAgICAgQGh1ZF9iYWNrZ3JvdW5kLmZpeGVkID0gdHJ1ZVxyXG5cclxuICAgICAgICBAYnVpbGRfaW5mbyA9IG5ldyBUb3JjaC5UZXh0IEBnYW1lLCAwLCAwLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlplbGRyb2lkLWRldi1idWlsZDoje0BidWlsZC5HYW1lQ29uZmlnLkJ1aWxkfVwiXHJcbiAgICAgICAgICAgIGNvbG9yOiBcInJlZFwiXHJcblxyXG5cclxuICAgICAgICBAaHVkX2JhY2tncm91bmQuR3JpZC5BcHBlbmQoQGJ1aWxkX2luZm8pXHJcblxyXG4gICAgICAgIEBnYW1lLkNhbWVyYS5wb3NpdGlvbi55ICs9IEBodWRfYmFja2dyb3VuZC5TaXplLmhlaWdodFxyXG5cclxuICAgIEBMb2FkOiAoZ2FtZSkgLT5cclxuICAgICAgICBnYW1lLkxvYWQuVGV4dHVyZShcIkFzc2V0cy9BcnQvaHVkLWRlc2lnbi5wbmdcIiwgXCJodWRfYmFja2dyb3VuZFwiKVxyXG5cclxuICAgIEJpbmRFdmVudHM6IC0+XHJcblxyXG4gICAgV2lkdGg6IChzY2FsZSA9IDEpIC0+XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoIC8gc2NhbGVcclxuXHJcbiAgICBIZWlnaHQ6IChzY2FsZSA9IDEpIC0+XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodCAvIHNjYWxlXHJcblxyXG5cclxuZXhwb3J0cy5IVUQgPSBIVURcclxuIl19
//# sourceURL=C:\dev\js\Torch.js\Games\Zeldroid\Src\HUD.coffee