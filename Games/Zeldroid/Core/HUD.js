// Generated by CoffeeScript 1.12.1
(function() {
  var Compass, HUD, Minimap, Terminal, exports,
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
      this.compass = new Compass(this.game);
      this.terminal = new Terminal(this.game);
      this.minimap = new Minimap(this.game);
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
      this.hud_background.Grid.Append(this.build_info).Append(this.terminal).Append(this.healthBar).Append(this.psycheBar).Append(this.compass).Append(this.minimap);
      this.game.Camera.position.y += this.hud_background.Size.height;
    }

    HUD.Load = function(game) {
      game.Load.Texture("Assets/Art/hud_background.png", "hud_background");
      game.Load.Texture("Assets/Art/terminal.png", "terminal");
      game.Load.Texture("Assets/Art/compass.png", "compass");
      return game.Load.Texture("Assets/Art/minimap_design.png", "minimap");
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
      this.Size.Scale(3.5, 1.5);
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

  Compass = (function(superClass) {
    extend(Compass, superClass);

    function Compass(game) {
      this.InitSprite(game, 0, 0);
      this.Bind.Texture("compass");
      this.Grid.CenterVertical().Margin(50, 0);
      this.Body.omega = 0.0005;
    }

    Compass.prototype.Update = function() {
      return Compass.__super__.Update.call(this);
    };

    return Compass;

  })(Torch.Sprite);

  Minimap = (function(superClass) {
    extend(Minimap, superClass);

    function Minimap(game) {
      this.InitSprite(game, 0, 0);
      this.Bind.Texture("minimap");
      this.Size.Scale(8, 8);
      this.Grid.Margin(300, 0).CenterVertical();
    }

    return Minimap;

  })(Torch.Sprite);

  exports.HUD = HUD;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFVELmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi4iLCJzb3VyY2VzIjpbIkdhbWVzXFxaZWxkcm9pZFxcU3JjXFxIVUQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBLE1BQUEsd0NBQUE7SUFBQTs7O0VBQUEsT0FBQSxHQUFVOztFQUNKO0lBQ1csYUFBQyxLQUFEO0FBSVQsVUFBQTtNQUpVLElBQUMsQ0FBQSxPQUFEO01BSVYsUUFBQSxHQUFXO01BQ1gsU0FBQSxHQUFZO01BQ1osYUFBQSxHQUFnQixDQUFDO01BQ2pCLFlBQUEsR0FBZTtNQUVmLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxTQUFYLENBQVg7TUFDVCxJQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLEtBQUssQ0FBQyxNQUFOLENBQWEsSUFBQyxDQUFBLElBQWQsRUFBb0IsQ0FBcEIsRUFBdUIsQ0FBdkI7TUFDdEIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBckIsQ0FBNkIsZ0JBQTdCO01BQ0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBckIsQ0FBMkIsQ0FBM0IsRUFBNkIsQ0FBN0I7TUFDQSxJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLEdBQTRCO01BQzVCLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQXJCLEdBQThCLElBQUMsQ0FBQSxNQUFELENBQVEsQ0FBUjtNQUM5QixJQUFDLENBQUEsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFyQixHQUE2QixNQUFNLENBQUM7TUFDcEMsSUFBQyxDQUFBLGNBQWMsQ0FBQyxLQUFoQixHQUF3QjtNQUV4QixJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBQyxDQUFBLElBQVosRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFDZDtRQUFBLElBQUEsRUFBTSxx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QUFLLENBQUM7O0VBbUR2Qjs7O0lBQ1csaUJBQUMsSUFBRDtNQUNULElBQUMsQ0FBQSxVQUFELENBQVksSUFBWixFQUFrQixDQUFsQixFQUFxQixDQUFyQjtNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFjLFNBQWQ7TUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLGNBQU4sQ0FBQSxDQUNLLENBQUMsTUFETixDQUNhLEVBRGIsRUFDZ0IsQ0FEaEI7TUFHQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sR0FBYztJQU5MOztzQkFRYixNQUFBLEdBQVEsU0FBQTthQUNKLGtDQUFBO0lBREk7Ozs7S0FUVSxLQUFLLENBQUM7O0VBZXRCOzs7SUFDVyxpQkFBQyxJQUFEO01BQ1QsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQWMsU0FBZDtNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLENBQVosRUFBYyxDQUFkO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsR0FBYixFQUFrQixDQUFsQixDQUNJLENBQUMsY0FETCxDQUFBO0lBSlM7Ozs7S0FESyxLQUFLLENBQUM7O0VBZ0I1QixPQUFPLENBQUMsR0FBUixHQUFjO0FBaktkIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cyA9IHRoaXNcclxuY2xhc3MgSFVEXHJcbiAgICBjb25zdHJ1Y3RvcjogKEBnYW1lKSAtPlxyXG4gICAgICAgICMgVE9ETzpcclxuICAgICAgICAjIGNsZWFuIHRoaXMgY3JhcCB1cFxyXG4gICAgICAgIFxyXG4gICAgICAgIGJhcldpZHRoID0gMzAwXHJcbiAgICAgICAgYmFySGVpZ2h0ID0gNTBcclxuICAgICAgICBiYXJMZWZ0TWFyZ2luID0gLTEwMFxyXG4gICAgICAgIGJhclRvcE1hcmdpbiA9IDM1XHJcblxyXG4gICAgICAgIEBidWlsZCA9IEpTT04ucGFyc2UoQGdhbWUuRmlsZShcInBhY2thZ2VcIikpXHJcbiAgICAgICAgQGh1ZF9iYWNrZ3JvdW5kID0gbmV3IFRvcmNoLlNwcml0ZShAZ2FtZSwgMCwgMClcclxuICAgICAgICBAaHVkX2JhY2tncm91bmQuQmluZC5UZXh0dXJlKFwiaHVkX2JhY2tncm91bmRcIilcclxuICAgICAgICBAaHVkX2JhY2tncm91bmQuU2l6ZS5TY2FsZSgxLDEpXHJcbiAgICAgICAgQGh1ZF9iYWNrZ3JvdW5kLmRyYXdJbmRleCA9IDEwMFxyXG4gICAgICAgIEBodWRfYmFja2dyb3VuZC5TaXplLmhlaWdodCA9IEBIZWlnaHQoNSlcclxuICAgICAgICBAaHVkX2JhY2tncm91bmQuU2l6ZS53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXHJcbiAgICAgICAgQGh1ZF9iYWNrZ3JvdW5kLmZpeGVkID0gdHJ1ZVxyXG5cclxuICAgICAgICBAYnVpbGRfaW5mbyA9IG5ldyBUb3JjaC5UZXh0IEBnYW1lLCAwLCAwLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlplbGRyb2lkLWRldi1idWlsZDoje0BidWlsZC5HYW1lQ29uZmlnLkJ1aWxkfVwiXHJcbiAgICAgICAgICAgIGNvbG9yOiBcInJlZFwiXHJcblxyXG4gICAgICAgIEBjb21wYXNzID0gbmV3IENvbXBhc3MoQGdhbWUpXHJcblxyXG4gICAgICAgIEB0ZXJtaW5hbCA9IG5ldyBUZXJtaW5hbChAZ2FtZSlcclxuXHJcbiAgICAgICAgQG1pbmltYXAgPSBuZXcgTWluaW1hcChAZ2FtZSlcclxuXHJcbiAgICAgICAgQGhlYWx0aEJhciA9IG5ldyBUb3JjaC5TaGFwZXMuQm94KEBnYW1lLCAwLCAwLCBiYXJXaWR0aCwgYmFySGVpZ2h0LCBcImdyZWVuXCIsIFwiZ3JlZW5cIilcclxuICAgICAgICBAaGVhbHRoQmFyLkdyaWQuQWxpZ24oXCJ0b3BcIiwgXCJyaWdodFwiKVxyXG4gICAgICAgIEBoZWFsdGhCYXIuR3JpZC5NYXJnaW4oYmFyTGVmdE1hcmdpbiwgYmFyVG9wTWFyZ2luKVxyXG5cclxuICAgICAgICBAcHN5Y2hlQmFyID0gbmV3IFRvcmNoLlNoYXBlcy5Cb3goQGdhbWUsIDAsIDAsIGJhcldpZHRoLCBiYXJIZWlnaHQsIFwicHVycGxlXCIsIFwicHVycGxlXCIpXHJcbiAgICAgICAgQHBzeWNoZUJhci5HcmlkLkFsaWduKFwiYm90dG9tXCIsIFwicmlnaHRcIilcclxuICAgICAgICBAcHN5Y2hlQmFyLkdyaWQuTWFyZ2luKGJhckxlZnRNYXJnaW4sIC1iYXJUb3BNYXJnaW4pXHJcblxyXG4gICAgICAgIGhlYWx0aFRleHQgPSBuZXcgVG9yY2guVGV4dCBAZ2FtZSwgMCwgMCxcclxuICAgICAgICAgICAgdGV4dDogXCJIRUFMVEhcIlxyXG4gICAgICAgICAgICBmb250OiBcIkltcGFjdFwiXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiAzMlxyXG4gICAgICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiXHJcbiAgICAgICAgaGVhbHRoVGV4dC5HcmlkLkNlbnRlclZlcnRpY2FsKClcclxuXHJcbiAgICAgICAgcHN5Y2hlVGV4dCA9IG5ldyBUb3JjaC5UZXh0IEBnYW1lLCAwLCAwLFxyXG4gICAgICAgICAgICB0ZXh0OiBcIlBTWUNIRVwiXHJcbiAgICAgICAgICAgIGZvbnQ6IFwiSW1wYWN0XCJcclxuICAgICAgICAgICAgZm9udFNpemU6IDMyXHJcbiAgICAgICAgICAgIGNvbG9yOiBcIndoaXRlXCJcclxuICAgICAgICBwc3ljaGVUZXh0LkdyaWQuQ2VudGVyVmVydGljYWwoKVxyXG5cclxuICAgICAgICBAaGVhbHRoQmFyLkdyaWQuQXBwZW5kKGhlYWx0aFRleHQpXHJcbiAgICAgICAgQHBzeWNoZUJhci5HcmlkLkFwcGVuZChwc3ljaGVUZXh0KVxyXG5cclxuICAgICAgICBAaHVkX2JhY2tncm91bmQuR3JpZC5BcHBlbmQoQGJ1aWxkX2luZm8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuQXBwZW5kKEB0ZXJtaW5hbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5BcHBlbmQoQGhlYWx0aEJhcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5BcHBlbmQoQHBzeWNoZUJhcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5BcHBlbmQoQGNvbXBhc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuQXBwZW5kKEBtaW5pbWFwKVxyXG5cclxuICAgICAgICBAZ2FtZS5DYW1lcmEucG9zaXRpb24ueSArPSBAaHVkX2JhY2tncm91bmQuU2l6ZS5oZWlnaHRcclxuXHJcbiAgICBATG9hZDogKGdhbWUpIC0+XHJcbiAgICAgICAgZ2FtZS5Mb2FkLlRleHR1cmUoXCJBc3NldHMvQXJ0L2h1ZF9iYWNrZ3JvdW5kLnBuZ1wiLCBcImh1ZF9iYWNrZ3JvdW5kXCIpXHJcbiAgICAgICAgZ2FtZS5Mb2FkLlRleHR1cmUoXCJBc3NldHMvQXJ0L3Rlcm1pbmFsLnBuZ1wiLCBcInRlcm1pbmFsXCIpXHJcbiAgICAgICAgZ2FtZS5Mb2FkLlRleHR1cmUoXCJBc3NldHMvQXJ0L2NvbXBhc3MucG5nXCIsIFwiY29tcGFzc1wiKVxyXG4gICAgICAgIGdhbWUuTG9hZC5UZXh0dXJlKFwiQXNzZXRzL0FydC9taW5pbWFwX2Rlc2lnbi5wbmdcIiwgXCJtaW5pbWFwXCIpXHJcblxyXG4gICAgQmluZEV2ZW50czogLT5cclxuXHJcbiAgICBXaWR0aDogKHNjYWxlID0gMSkgLT5cclxuICAgICAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGggLyBzY2FsZVxyXG5cclxuICAgIEhlaWdodDogKHNjYWxlID0gMSkgLT5cclxuICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0IC8gc2NhbGVcclxuXHJcblxyXG5jbGFzcyBUZXJtaW5hbCBleHRlbmRzIFRvcmNoLlNwcml0ZVxyXG4gICAgY3VycmVudFRleHRPdXRwdXQ6IG51bGxcclxuXHJcbiAgICBjb25zdHJ1Y3RvcjogKGdhbWUpIC0+XHJcbiAgICAgICAgQEluaXRTcHJpdGUoZ2FtZSwgMCwgMClcclxuICAgICAgICBAQmluZC5UZXh0dXJlKFwidGVybWluYWxcIilcclxuICAgICAgICBAU2l6ZS5TY2FsZSgzLjUsIDEuNSlcclxuXHJcbiAgICAgICAgQEdyaWQuQ2VudGVyKClcclxuICAgICAgICAgICAgIC5DZW50ZXJWZXJ0aWNhbCgpXHJcblxyXG4gICAgICAgICMgZGV2IHB1cnBvc2VzLCBzaG93aW5nIHN0dWZmIG9uIHRoZSBkZXYgY29uc29sZVxyXG4gICAgICAgIGMgPSAxXHJcbiAgICAgICAgQERpc3BsYXlUZXh0KFwiV2VsY29tZSB0byBaZWxkcm9pZFwiKVxyXG5cclxuICAgICAgICBAZ2FtZS5UaW1lci5TZXRTY2hlZHVsZWRFdmVudCA1MDAwLCA9PlxyXG4gICAgICAgICAgICBpZiBjICUgMiBpcyAwXHJcbiAgICAgICAgICAgICAgICBARGlzcGxheVRleHQoXCJXZWxjb21lIHRvIFplbGRyb2lkIVwiKVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBkID0gbmV3IERhdGUoKVxyXG4gICAgICAgICAgICAgICAgQERpc3BsYXlUZXh0KFwiSXQgaXMgI3tkLmdldEhvdXJzKCl9OiN7ZC5nZXRNaW51dGVzKCl9XCIpXHJcbiAgICAgICAgICAgIGMgKz0gMVxyXG5cclxuICAgIFVwZGF0ZTogLT5cclxuICAgICAgICBzdXBlcigpXHJcblxyXG4gICAgRGlzcGxheVRleHQ6ICh0ZXh0KSAtPlxyXG4gICAgICAgICMgVE9ETzpcclxuICAgICAgICAjIEdpdmUgdGhlIGRpc3BsYXllZCB0ZXh0IGEgYmxpbmsgZWZmZWN0XHJcbiAgICAgICAgQGN1cnJlbnRUZXh0T3V0cHV0Py5UcmFzaCgpXHJcblxyXG4gICAgICAgIEBjdXJyZW50VGV4dE91dHB1dCA9IHRleHRTcHJpdGUgPSBuZXcgVG9yY2guVGV4dCBAZ2FtZSwgMCwgMCxcclxuICAgICAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgICAgICBmb250OiBcIkltcGFjdFwiXHJcbiAgICAgICAgICAgIGNvbG9yOiBcIndoaXRlXCJcclxuICAgICAgICAgICAgZm9udFNpemU6IDI0XHJcblxyXG4gICAgICAgIHRleHRTcHJpdGUuR3JpZC5DZW50ZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgIC5DZW50ZXJWZXJ0aWNhbCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgLk1hcmdpbigwLCAxMClcclxuXHJcbiAgICAgICAgdGV4dFNwcml0ZS5vcGFjaXR5ID0gMFxyXG5cclxuICAgICAgICBAZ2FtZS5Ud2VlbnMuVHdlZW4odGV4dFNwcml0ZS5HcmlkLm1hcmdpbiwgNTAwLCBUb3JjaC5FYXNpbmcuU21vb3RoKS5Ub1xyXG4gICAgICAgICAgICB0b3A6IDBcclxuXHJcbiAgICAgICAgQGdhbWUuVHdlZW5zLlR3ZWVuKHRleHRTcHJpdGUsIDUwMCwgVG9yY2guRWFzaW5nLlNtb290aCkuVG9cclxuICAgICAgICAgICAgb3BhY2l0eTogMVxyXG5cclxuICAgICAgICBAR3JpZC5BcHBlbmQodGV4dFNwcml0ZSlcclxuXHJcbmNsYXNzIENvbXBhc3MgZXh0ZW5kcyBUb3JjaC5TcHJpdGVcclxuICAgIGNvbnN0cnVjdG9yOiAoZ2FtZSkgLT5cclxuICAgICAgICBASW5pdFNwcml0ZShnYW1lLCAwLCAwKVxyXG4gICAgICAgIEBCaW5kLlRleHR1cmUoXCJjb21wYXNzXCIpXHJcbiAgICAgICAgQEdyaWQuQ2VudGVyVmVydGljYWwoKVxyXG4gICAgICAgICAgICAgLk1hcmdpbig1MCwwKVxyXG5cclxuICAgICAgICBAQm9keS5vbWVnYSA9IDAuMDAwNVxyXG5cclxuICAgIFVwZGF0ZTogLT5cclxuICAgICAgICBzdXBlcigpXHJcblxyXG4gICAgICAgICMgVE9ETzpcclxuICAgICAgICAjIEdldCBDb21wYXNzIHRvIHJvdGF0ZSB3aXRoIHBsYXllciBtb3ZlbWVudFxyXG5cclxuY2xhc3MgTWluaW1hcCBleHRlbmRzIFRvcmNoLlNwcml0ZVxyXG4gICAgY29uc3RydWN0b3I6IChnYW1lKSAtPlxyXG4gICAgICAgIEBJbml0U3ByaXRlKGdhbWUsIDAsIDApXHJcbiAgICAgICAgQEJpbmQuVGV4dHVyZShcIm1pbmltYXBcIilcclxuICAgICAgICBAU2l6ZS5TY2FsZSg4LDgpXHJcbiAgICAgICAgQEdyaWQuTWFyZ2luKDMwMCwgMClcclxuICAgICAgICAgICAgLkNlbnRlclZlcnRpY2FsKClcclxuXHJcbiAgICAjIFRPRE86XHJcbiAgICAjIFByZXR0eSBtdWNoIGV2ZXJ5dGhpbmdcclxuICAgICMgSSB0aGluayBldmVyeSBtYXAgcGllY2UgKG5vbi1lbmVteSlcclxuICAgICMgc2hvdWxkIGRlZmluZSBhIGNvbG9yIGxpa2UgbWluaW1hcENvbG9yXHJcbiAgICAjIGFuZCB0aGUgbWluaW1hcCB3b3VsZCBjb21wb3NlIGl0c2VsZiBvdXQgb2YgdGhvc2UgY29sb3JzXHJcblxyXG5cclxuXHJcbmV4cG9ydHMuSFVEID0gSFVEXHJcbiJdfQ==
//# sourceURL=C:\dev\js\Torch.js\Games\Zeldroid\Src\HUD.coffee