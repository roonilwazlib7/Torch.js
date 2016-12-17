class Color
    hex: null
    r: null
    g: null
    b: null
    constructor: (rOrHex, g, b) ->
        @Set(rOrHex, g, b)

    Set: (rOrHex, g, b) ->
        if typeof rOrHex is "string"
            @hex = rOrHex
            @DecodeHex()
        else
            @r = rOrHex
            @g = g
            @b = b
            @EncodeHex()

    DecodeHex: ->
        chunks = Util.String(@hex).Chunk(2)

        @r = parseInt(chunks[0], 16)
        @g = parseInt(chunks[1], 16)
        @b = parseInt(chunks[2], 16)

    EncodeHex: ->
        @hex = ""
        @hex += @r.toString(16)
        @hex += @g.toString(16)
        @hex += @b.toString(16)

    GetHtmlString: ->
        return "#" + @hex

    Invert: ->
        @Set( Math.floor( Math.abs( 255 - @r ) ), Math.floor( Math.abs( 255 - @g ) ), Math.floor( Math.abs( 255 - @b ) ) )

    # static color methods

    @Random: ->
        return new Color( Math.floor( Util.Math.RandomInRange(0,255) ), Math.floor( Util.Math.RandomInRange(0,255) ), Math.floor( Util.Math.RandomInRange(0,255) ) )

Color.Red = new Color(256, 0, 0, 1)
Color.Green = new Color(0, 256, 0, 1)
Color.Blue = new Color(0, 0, 256, 1)
Color.Flame = new Color("ff8000")
Color.Ruby = new Color("e60000")
