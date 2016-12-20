// Generated by CoffeeScript 1.12.1
(function() {
  var HUD, Terminal, exports,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  exports = this;

  HUD = (function() {
    function HUD(game1) {
      var barHeight, barLeftMargin, barTopMargin, barWidth, healthText, psycheText;
      this.game = game1;
      barWidth = 300;
      barHeight = 50;
      barLeftMargin = -100;
      barTopMargin = 35;
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
      this.compass = new Torch.Sprite(this.game, 0, 0);
      this.compass.Bind.Texture("compass");
      this.compass.Grid.CenterVertical();
      this.compass.Size.Scale(1, 1);
      this.terminal = new Terminal(this.game);
      this.healthBar = new Torch.Shapes.Box(this.game, 0, 0, barWidth, barHeight, "green", "green");
      this.healthBar.Grid.Align("top", "right");
      this.healthBar.Grid.Margin(barLeftMargin, barTopMargin);
      this.psycheBar = new Torch.Shapes.Box(this.game, 0, 0, barWidth, barHeight, "purple", "purple");
      this.psycheBar.Grid.Align("bottom", "right");
      this.psycheBar.Grid.Margin(barLeftMargin, -barTopMargin);
      healthText = new Torch.Text(this.game, 0, 0, {
        text: "HEALTH",
        font: "Impact",
        fontSize: 32,
        color: "white"
      });
      healthText.Grid.CenterVertical();
      psycheText = new Torch.Text(this.game, 0, 0, {
        text: "PSYCHE",
        font: "Impact",
        fontSize: 32,
        color: "white"
      });
      psycheText.Grid.CenterVertical();
      this.healthBar.Grid.Append(healthText);
      this.psycheBar.Grid.Append(psycheText);
      this.hud_background.Grid.Append(this.build_info).Append(this.terminal).Append(this.healthBar).Append(this.psycheBar).Append(this.compass);
      this.game.Camera.position.y += this.hud_background.Size.height;
    }

    HUD.Load = function(game) {
      game.Load.Texture("Assets/Art/hud_background.png", "hud_background");
      game.Load.Texture("Assets/Art/terminal.png", "terminal");
      return game.Load.Texture("Assets/Art/compass.png", "compass");
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

  Terminal = (function(superClass) {
    extend(Terminal, superClass);

    Terminal.prototype.currentTextOutput = null;

    function Terminal(game) {
      var c;
      this.InitSprite(game, 0, 0);
      this.Bind.Texture("terminal");
      this.Size.Scale(2.5, 1.5);
      this.Grid.Center().CenterVertical();
      c = 1;
      this.DisplayText("Welcome to Zeldroid");
      this.game.Timer.SetScheduledEvent(5000, (function(_this) {
        return function() {
          var d;
          if (c % 2 === 0) {
            _this.DisplayText("Welcome to Zeldroid!");
          } else {
            d = new Date();
            _this.DisplayText("It is " + (d.getHours()) + ":" + (d.getMinutes()));
          }
          return c += 1;
        };
      })(this));
    }

    Terminal.prototype.Update = function() {
      return Terminal.__super__.Update.call(this);
    };

    Terminal.prototype.DisplayText = function(text) {
      var ref, textSprite;
      if ((ref = this.currentTextOutput) != null) {
        ref.Trash();
      }
      this.currentTextOutput = textSprite = new Torch.Text(this.game, 0, 0, {
        text: text,
        font: "Impact",
        color: "white",
        fontSize: 24
      });
      textSprite.Grid.Center().CenterVertical().Margin(0, 10);
      textSprite.opacity = 0;
      this.game.Tweens.Tween(textSprite.Grid.margin, 500, Torch.Easing.Smooth).To({
        top: 0
      });
      this.game.Tweens.Tween(textSprite, 500, Torch.Easing.Smooth).To({
        opacity: 1
      });
      return this.Grid.Append(textSprite);
    };

    return Terminal;

  })(Torch.Sprite);

  exports.HUD = HUD;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFVELmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi4iLCJzb3VyY2VzIjpbIkdhbWVzXFxaZWxkcm9pZFxcU3JjXFxIVUQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTs7O0VBQUEsT0FBQSxHQUFVOztFQUNKO0lBQ1csYUFBQyxLQUFEO0FBQ1QsVUFBQTtNQURVLElBQUMsQ0FBQSxPQUFEO01BQ1YsUUFBQSxHQUFXO01BQ1gsU0FBQSxHQUFZO01BQ1osYUFBQSxHQUFnQixDQUFDO01BQ2pCLFlBQUEsR0FBZTtNQUVmLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxTQUFYLENBQVg7TUFDVCxJQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBQyxDQUFBLElBQWQsRUFBb0IsQ0FBcEIsRUFBdUIsQ0FBdkI7TUFDdEIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBckIsQ0FBNkIsZ0JBQTdCO01BQ0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBckIsQ0FBMkIsQ0FBM0IsRUFBNkIsQ0FBN0I7TUFDQSxJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLEdBQTRCO01BQzVCLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQXJCLEdBQThCLElBQUMsQ0FBQSxNQUFELENBQVEsQ0FBUjtNQUM5QixJQUFDLENBQUEsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFyQixHQUE2QixNQUFNLENBQUM7TUFDcEMsSUFBQyxDQUFBLGNBQWMsQ0FBQyxLQUFoQixHQUF3QjtNQUV4QixJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBQyxDQUFBLElBQVosRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFDZDtRQUFBLElBQUEsRUFBTSxx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Q0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLFVBQWI7SUFyQlM7Ozs7S0ExQk0sS0FBSyxDQUFDOztFQWtEN0IsT0FBTyxDQUFDLEdBQVIsR0FBYztBQTdIZCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMgPSB0aGlzXHJcbmNsYXNzIEhVRFxyXG4gICAgY29uc3RydWN0b3I6IChAZ2FtZSkgLT5cclxuICAgICAgICBiYXJXaWR0aCA9IDMwMFxyXG4gICAgICAgIGJhckhlaWdodCA9IDUwXHJcbiAgICAgICAgYmFyTGVmdE1hcmdpbiA9IC0xMDBcclxuICAgICAgICBiYXJUb3BNYXJnaW4gPSAzNVxyXG5cclxuICAgICAgICBAYnVpbGQgPSBKU09OLnBhcnNlKEBnYW1lLkZpbGUoXCJwYWNrYWdlXCIpKVxyXG4gICAgICAgIEBodWRfYmFja2dyb3VuZCA9IG5ldyBUb3JjaC5TcHJpdGUoQGdhbWUsIDAsIDApXHJcbiAgICAgICAgQGh1ZF9iYWNrZ3JvdW5kLkJpbmQuVGV4dHVyZShcImh1ZF9iYWNrZ3JvdW5kXCIpXHJcbiAgICAgICAgQGh1ZF9iYWNrZ3JvdW5kLlNpemUuU2NhbGUoMSwxKVxyXG4gICAgICAgIEBodWRfYmFja2dyb3VuZC5kcmF3SW5kZXggPSAxMDBcclxuICAgICAgICBAaHVkX2JhY2tncm91bmQuU2l6ZS5oZWlnaHQgPSBASGVpZ2h0KDUpXHJcbiAgICAgICAgQGh1ZF9iYWNrZ3JvdW5kLlNpemUud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxyXG4gICAgICAgIEBodWRfYmFja2dyb3VuZC5maXhlZCA9IHRydWVcclxuXHJcbiAgICAgICAgQGJ1aWxkX2luZm8gPSBuZXcgVG9yY2guVGV4dCBAZ2FtZSwgMCwgMCxcclxuICAgICAgICAgICAgdGV4dDogXCJaZWxkcm9pZC1kZXYtYnVpbGQ6I3tAYnVpbGQuR2FtZUNvbmZpZy5CdWlsZH1cIlxyXG4gICAgICAgICAgICBjb2xvcjogXCJyZWRcIlxyXG5cclxuICAgICAgICBAY29tcGFzcyA9IG5ldyBUb3JjaC5TcHJpdGUoQGdhbWUsIDAsIDApXHJcbiAgICAgICAgQGNvbXBhc3MuQmluZC5UZXh0dXJlKFwiY29tcGFzc1wiKVxyXG4gICAgICAgIEBjb21wYXNzLkdyaWQuQ2VudGVyVmVydGljYWwoKVxyXG4gICAgICAgIEBjb21wYXNzLlNpemUuU2NhbGUoMSwxKVxyXG5cclxuICAgICAgICBAdGVybWluYWwgPSBuZXcgVGVybWluYWwoQGdhbWUpXHJcblxyXG4gICAgICAgIEBoZWFsdGhCYXIgPSBuZXcgVG9yY2guU2hhcGVzLkJveChAZ2FtZSwgMCwgMCwgYmFyV2lkdGgsIGJhckhlaWdodCwgXCJncmVlblwiLCBcImdyZWVuXCIpXHJcbiAgICAgICAgQGhlYWx0aEJhci5HcmlkLkFsaWduKFwidG9wXCIsIFwicmlnaHRcIilcclxuICAgICAgICBAaGVhbHRoQmFyLkdyaWQuTWFyZ2luKGJhckxlZnRNYXJnaW4sIGJhclRvcE1hcmdpbilcclxuXHJcbiAgICAgICAgQHBzeWNoZUJhciA9IG5ldyBUb3JjaC5TaGFwZXMuQm94KEBnYW1lLCAwLCAwLCBiYXJXaWR0aCwgYmFySGVpZ2h0LCBcInB1cnBsZVwiLCBcInB1cnBsZVwiKVxyXG4gICAgICAgIEBwc3ljaGVCYXIuR3JpZC5BbGlnbihcImJvdHRvbVwiLCBcInJpZ2h0XCIpXHJcbiAgICAgICAgQHBzeWNoZUJhci5HcmlkLk1hcmdpbihiYXJMZWZ0TWFyZ2luLCAtYmFyVG9wTWFyZ2luKVxyXG5cclxuICAgICAgICBoZWFsdGhUZXh0ID0gbmV3IFRvcmNoLlRleHQgQGdhbWUsIDAsIDAsXHJcbiAgICAgICAgICAgIHRleHQ6IFwiSEVBTFRIXCJcclxuICAgICAgICAgICAgZm9udDogXCJJbXBhY3RcIlxyXG4gICAgICAgICAgICBmb250U2l6ZTogMzJcclxuICAgICAgICAgICAgY29sb3I6IFwid2hpdGVcIlxyXG4gICAgICAgIGhlYWx0aFRleHQuR3JpZC5DZW50ZXJWZXJ0aWNhbCgpXHJcblxyXG4gICAgICAgIHBzeWNoZVRleHQgPSBuZXcgVG9yY2guVGV4dCBAZ2FtZSwgMCwgMCxcclxuICAgICAgICAgICAgdGV4dDogXCJQU1lDSEVcIlxyXG4gICAgICAgICAgICBmb250OiBcIkltcGFjdFwiXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiAzMlxyXG4gICAgICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiXHJcbiAgICAgICAgcHN5Y2hlVGV4dC5HcmlkLkNlbnRlclZlcnRpY2FsKClcclxuXHJcbiAgICAgICAgQGhlYWx0aEJhci5HcmlkLkFwcGVuZChoZWFsdGhUZXh0KVxyXG4gICAgICAgIEBwc3ljaGVCYXIuR3JpZC5BcHBlbmQocHN5Y2hlVGV4dClcclxuXHJcbiAgICAgICAgQGh1ZF9iYWNrZ3JvdW5kLkdyaWQuQXBwZW5kKEBidWlsZF9pbmZvKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLkFwcGVuZChAdGVybWluYWwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuQXBwZW5kKEBoZWFsdGhCYXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuQXBwZW5kKEBwc3ljaGVCYXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuQXBwZW5kKEBjb21wYXNzKVxyXG5cclxuICAgICAgICBAZ2FtZS5DYW1lcmEucG9zaXRpb24ueSArPSBAaHVkX2JhY2tncm91bmQuU2l6ZS5oZWlnaHRcclxuXHJcbiAgICBATG9hZDogKGdhbWUpIC0+XHJcbiAgICAgICAgZ2FtZS5Mb2FkLlRleHR1cmUoXCJBc3NldHMvQXJ0L2h1ZF9iYWNrZ3JvdW5kLnBuZ1wiLCBcImh1ZF9iYWNrZ3JvdW5kXCIpXHJcbiAgICAgICAgZ2FtZS5Mb2FkLlRleHR1cmUoXCJBc3NldHMvQXJ0L3Rlcm1pbmFsLnBuZ1wiLCBcInRlcm1pbmFsXCIpXHJcbiAgICAgICAgZ2FtZS5Mb2FkLlRleHR1cmUoXCJBc3NldHMvQXJ0L2NvbXBhc3MucG5nXCIsIFwiY29tcGFzc1wiKVxyXG5cclxuICAgIEJpbmRFdmVudHM6IC0+XHJcblxyXG4gICAgV2lkdGg6IChzY2FsZSA9IDEpIC0+XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoIC8gc2NhbGVcclxuXHJcbiAgICBIZWlnaHQ6IChzY2FsZSA9IDEpIC0+XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodCAvIHNjYWxlXHJcblxyXG5cclxuY2xhc3MgVGVybWluYWwgZXh0ZW5kcyBUb3JjaC5TcHJpdGVcclxuICAgIGN1cnJlbnRUZXh0T3V0cHV0OiBudWxsXHJcblxyXG4gICAgY29uc3RydWN0b3I6IChnYW1lKSAtPlxyXG4gICAgICAgIEBJbml0U3ByaXRlKGdhbWUsIDAsIDApXHJcbiAgICAgICAgQEJpbmQuVGV4dHVyZShcInRlcm1pbmFsXCIpXHJcbiAgICAgICAgQFNpemUuU2NhbGUoMi41LCAxLjUpXHJcblxyXG4gICAgICAgIEBHcmlkLkNlbnRlcigpXHJcbiAgICAgICAgICAgICAuQ2VudGVyVmVydGljYWwoKVxyXG5cclxuICAgICAgICAjIGRldiBwdXJwb3Nlcywgc2hvd2luZyBzdHVmZiBvbiB0aGUgZGV2IGNvbnNvbGVcclxuICAgICAgICBjID0gMVxyXG4gICAgICAgIEBEaXNwbGF5VGV4dChcIldlbGNvbWUgdG8gWmVsZHJvaWRcIilcclxuXHJcbiAgICAgICAgQGdhbWUuVGltZXIuU2V0U2NoZWR1bGVkRXZlbnQgNTAwMCwgPT5cclxuICAgICAgICAgICAgaWYgYyAlIDIgaXMgMFxyXG4gICAgICAgICAgICAgICAgQERpc3BsYXlUZXh0KFwiV2VsY29tZSB0byBaZWxkcm9pZCFcIilcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgZCA9IG5ldyBEYXRlKClcclxuICAgICAgICAgICAgICAgIEBEaXNwbGF5VGV4dChcIkl0IGlzICN7ZC5nZXRIb3VycygpfToje2QuZ2V0TWludXRlcygpfVwiKVxyXG4gICAgICAgICAgICBjICs9IDFcclxuXHJcbiAgICBVcGRhdGU6IC0+XHJcbiAgICAgICAgc3VwZXIoKVxyXG5cclxuICAgIERpc3BsYXlUZXh0OiAodGV4dCkgLT5cclxuICAgICAgICBAY3VycmVudFRleHRPdXRwdXQ/LlRyYXNoKClcclxuXHJcbiAgICAgICAgQGN1cnJlbnRUZXh0T3V0cHV0ID0gdGV4dFNwcml0ZSA9IG5ldyBUb3JjaC5UZXh0IEBnYW1lLCAwLCAwLFxyXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgICAgIGZvbnQ6IFwiSW1wYWN0XCJcclxuICAgICAgICAgICAgY29sb3I6IFwid2hpdGVcIlxyXG4gICAgICAgICAgICBmb250U2l6ZTogMjRcclxuXHJcbiAgICAgICAgdGV4dFNwcml0ZS5HcmlkLkNlbnRlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgLkNlbnRlclZlcnRpY2FsKClcclxuICAgICAgICAgICAgICAgICAgICAgICAuTWFyZ2luKDAsIDEwKVxyXG5cclxuICAgICAgICB0ZXh0U3ByaXRlLm9wYWNpdHkgPSAwXHJcblxyXG4gICAgICAgIEBnYW1lLlR3ZWVucy5Ud2Vlbih0ZXh0U3ByaXRlLkdyaWQubWFyZ2luLCA1MDAsIFRvcmNoLkVhc2luZy5TbW9vdGgpLlRvXHJcbiAgICAgICAgICAgIHRvcDogMFxyXG5cclxuICAgICAgICBAZ2FtZS5Ud2VlbnMuVHdlZW4odGV4dFNwcml0ZSwgNTAwLCBUb3JjaC5FYXNpbmcuU21vb3RoKS5Ub1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAxXHJcblxyXG4gICAgICAgIEBHcmlkLkFwcGVuZCh0ZXh0U3ByaXRlKVxyXG5cclxuXHJcbmV4cG9ydHMuSFVEID0gSFVEXHJcbiJdfQ==
//# sourceURL=C:\dev\js\Torch.js\Games\Zeldroid\Src\HUD.coffee