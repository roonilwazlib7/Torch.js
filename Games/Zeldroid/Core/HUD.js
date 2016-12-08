// Generated by CoffeeScript 1.10.0
(function() {
  var HUD, exports;

  exports = this;

  HUD = (function() {
    function HUD(game1) {
      this.game = game1;
      this.hud_background = new Torch.Sprite(this.game, 0, 0);
      this.hud_background.Bind.Texture("hud_background");
      this.hud_background.Size.Scale(1, 1);
      this.hud_background.DrawIndex(100);
      this.hud_background.Size.width = window.innerWidth;
      this.hud_background.Size.height = this.Height(5);
      this.hud_background.fixed = true;
    }

    HUD.Load = function(game) {
      game.Load.Texture("Assets/Art/hud_background.png", "hud_background");
      game.Load.Texture("Assets/Art/hud_minimap_background.png", "hud_minimap_background");
      game.Load.Texture("Assets/Art/health_bar.png", "hud_life_bar");
      game.Load.Texture("Assets/Art/stress_bar.png", "hud_stress_bar");
      game.Load.Texture("Assets/Art/hud_slot_1_background.png", "hud_slot_1_background");
      return game.Load.Texture("Assets/Art/hud_slot_2_background.png", "hud_slot_2_background");
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
