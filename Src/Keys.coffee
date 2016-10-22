class Keys
    constructor: ->
        @InitKeys()

    InitKeys: ->
        _keys = @
        i = 0
        while i < 230
            _char = String.fromCharCode(i).toUpperCase()

            switch i
                when 37 then _keys["LeftArrow"] = {down:false}
                when 38 then _keys["UpArrow"] = {down:false}
                when 39 then _keys["RightArrow"] = {down:false}
                when 40 then _keys["DownArrow"] = {down:false}

                else
                    _keys[_char] = {down:false}

            _keys["Space"] = {down:false}
