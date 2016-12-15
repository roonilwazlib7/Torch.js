class Color
    constructor: (rOrHex, g, b, a) ->
        @hex = ""
        @Red = 0
        @Green = 0
        @Blue = 0
        @Alpha = 1
        @Init(rOrHex, g, b, a)

    Init: (rOrHex, g, b, a) ->
        if g is undefined and g isnt null
            #rgba values
            @GetHexFromRGB(rOrHex, g, b, a)
        else
            #html color hash
            @GetRGBFromHex(rOrHex)

    GetHexadecimal: (dec, a) ->
        hexa = Math.round(dec * a).toString(16)
        if hexa.length is 1
            hexa = "0" + hexa
        return hexa

    GetHexFromRGB: (r, g, b, a) ->
        @Red = r
        @Green = g
        @Blue = b
        @Alpha = a
        @hex = "#" + @GetHexadecimal(r,a) + @GetHexadecimal(g,a) + @GetHexadecimal(b,a)

    GetRGBFromHex: ->
        # @hex = hex.split("#")[1]
        # hexRed = @hex.slice(0,2)
        # hexGreen = @hex.slice(2,4)
        # hexBlue = @hex.slice(4,6)
        # @Red = parseInt(hexRed, 16)
        # @Blue = parseInt(hexBlue, 16)
        # @Green = parseInt(hexGreen, 16)
        # @hex = '#' + @hex

    BlendHex: -> @GetRGBFromHex(@hex)

    BlendRGB: -> @GetHexFromRGB(@Red, @Green, @Blue, @Alpha)

    GetRGBString: -> return "rgba(" + @Red + "," + @Green + "," + @Blue + "," + @Alpha + ");"

Color.Red = new Color(256, 0, 0, 1)
Color.Green = new Color(0, 256, 0, 1)
Color.Blue = new Color(0, 0, 256, 1)
Color.Flame = new Color("#ff8000")
Color.Ruby = new Color("#e60000")
