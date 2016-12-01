// Generated by CoffeeScript 1.10.0
(function() {
  var KeyPipe;

  KeyPipe = (function() {
    function KeyPipe(game) {
      this.game = game;
      this.text = "";
      this.listening = false;
      this.game.Keys.On("KeyPress", (function(_this) {
        return function(event) {
          if (event.keyText === "delete") {
            return _this.text = _this.text.substring(0, -1);
          } else if (_this.listening) {
            return _this.text += event.keyText;
          }
        };
      })(this));
    }

    return KeyPipe;

  })();

}).call(this);