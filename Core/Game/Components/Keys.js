// Generated by CoffeeScript 1.10.0
(function() {
  var Key, Keys;

  Key = (function() {
    Key.MixIn(EventDispatcher);

    Key.prototype.down = false;

    function Key(keyCode1) {
      this.keyCode = keyCode1;
      this.InitEventDispatch();
    }

    return Key;

  })();

  Keys = (function() {
    Keys.MixIn(EventDispatcher);

    function Keys() {
      this.specialKeys = {
        8: "Delete",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "PauseBreak",
        20: "CapsLock",
        27: "Escape",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "LeftArrow",
        38: "UpArrow",
        39: "RightArrow",
        40: "DownArrow",
        45: "Insert",
        46: "Delete2",
        48: "Num0",
        49: "Num1",
        50: "Num2",
        51: "Num3",
        52: "Num4",
        53: "Num5",
        54: "Num6",
        55: "Num7",
        56: "Num8",
        57: "Num9",
        96: "NumPad0",
        97: "NumPad1",
        98: "NumPad2",
        99: "NumPad3",
        100: "NumPad4",
        101: "NumPad5",
        102: "NumPad6",
        103: "NumPad7",
        104: "NumPad8",
        105: "NumPad9",
        106: "NumPadMultiply",
        107: "NumPadPlus",
        109: "NumPadMinus",
        110: "NumPadPeriod",
        111: "NumPadDivide",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        186: "Colon",
        187: "NumPlus",
        188: "Comma",
        189: "NumMinus",
        190: "Period",
        191: "ForwardSlash",
        192: "Tilda",
        219: "BracketLeft",
        221: "BracketRight",
        220: "BackSlash",
        222: "Quote"
      };
      this.InitKeys();
    }

    Keys.prototype.SpecialKey = function(keyCode) {
      var key, ref, value;
      ref = this.specialKeys;
      for (key in ref) {
        value = ref[key];
        if (keyCode.toString() === key.toString()) {
          return this[value];
        }
      }
      return null;
    };

    Keys.prototype.InitKeys = function() {
      var _char, _keys, i, keyCode, ref, results, value;
      _keys = this;
      i = 0;
      while (i < 230) {
        _char = String.fromCharCode(i).toUpperCase();
        _keys[_char] = new Key(i);
        i++;
      }
      ref = this.specialKeys;
      results = [];
      for (keyCode in ref) {
        value = ref[keyCode];
        results.push(_keys[value] = new Key(keyCode));
      }
      return results;
    };

    return Keys;

  })();

}).call(this);
