Torch.Keys = function()
{
    var _keys = this;
    for (i = 0; i < 230; i++)
    {
        var _char = String.fromCharCode(i).toUpperCase();
        switch (i)
        {
            case 37:
            _keys["LeftArrow"] = {down:false};
            break;

            case 38:
            _keys["UpArrow"] = {down:false};
            break;

            case 39:
            _keys["RightArrow"] = {down:false};
            break;

            case 40:
            _keys["DownArrow"] = {down:false};

            default:
            _keys[_char] = {down:false};
            break;
        }


    }
    _keys["Space"] = {down:false};
}
