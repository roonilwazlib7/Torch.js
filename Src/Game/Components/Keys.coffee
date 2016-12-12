exports = this

class Key
    Key.MixIn(Torch.EventDispatcher)

    down : false
    constructor: (@keyCode) ->
        @InitEventDispatch()



class Keys
    Keys.MixIn(Torch.EventDispatcher)

    constructor: ->
        @specialKeys =
            8: "Delete"
            9: "Tab"
            13: "Enter"
            16: "Shift"
            17: "Control"
            18: "Alt"
            19: "PauseBreak"
            20: "CapsLock"
            27: "Escape"
            32: "Space"
            33: "PageUp"
            34: "PageDown"
            35: "End"
            36: "Home"
            37: "LeftArrow"
            38: "UpArrow"
            39: "RightArrow"
            40: "DownArrow"
            45: "Insert"
            46: "Delete2"
            48: "Num0"
            49: "Num1"
            50: "Num2"
            51: "Num3"
            52: "Num4"
            53: "Num5"
            54: "Num6"
            55: "Num7"
            56: "Num8"
            57: "Num9"
            96: "NumPad0"
            97: "NumPad1"
            98: "NumPad2"
            99: "NumPad3"
            100: "NumPad4"
            101: "NumPad5"
            102: "NumPad6"
            103: "NumPad7"
            104: "NumPad8"
            105: "NumPad9"
            106: "NumPadMultiply"
            107: "NumPadPlus"
            109: "NumPadMinus"
            110: "NumPadPeriod"
            111: "NumPadDivide"
            112: "F1"
            113: "F2"
            114: "F3"
            115: "F4"
            116: "F5"
            117: "F6"
            118: "F7"
            119: "F8"
            120: "F9"
            121: "F10"
            122: "F11"
            123: "F12"
            144: "NumLock"
            145: "ScrollLock"
            186: "Colon"
            187: "NumPlus"
            188: "Comma"
            189: "NumMinus"
            190: "Period"
            191: "ForwardSlash"
            192: "Tilda"
            219: "BracketLeft"
            221: "BracketRight"
            220: "BackSlash"
            222: "Quote"

        @InitKeys()

    SpecialKey: (keyCode) ->
        for key,value of @specialKeys
            if keyCode.toString() is key.toString()
                return @[value]

        return null

    InitKeys: ->
        _keys = @
        i = 0
        while i < 230
            _char = String.fromCharCode(i).toUpperCase()
            _keys[_char] = new Key(i)
            i++

        for keyCode,value of @specialKeys
            _keys[value] = new Key(keyCode)

Torch.Keys = Keys
