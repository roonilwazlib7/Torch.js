exports = this

class Key
    Key.MixIn(Torch.EventDispatcher)

    down : false
    constructor: (@keyCode) ->
        @InitEventDispatch()



class Keys
    Keys.MixIn(Torch.EventDispatcher)

    constructor: ->
        @InitKeys()

    InitKeys: ->
        _keys = @
        i = 0
        while i < 230
            _char = String.fromCharCode(i).toUpperCase()
            _keys[_char] = new Key(i)
            i++

        _keys["Space"] = new Key(32)
        _keys["LeftArrow"] = new Key(37)
        _keys["RightArrow"] = new Key(39)
        _keys["UpArrow"] = new Key(38)
        _keys["DownArrow"] = new Key(40)

Torch.Keys = Keys
