class Color
    hex: null
    r: null
    g: null
    b: null
    constructor: (rOrHex, g, b) ->
        @Set(rOrHex, g, b)

    Set: (rOrHex, g, b) ->
        if typeof rOrHex is "string"
            hex = rOrHex
            @DecodeHex()
        else
            @r = rOrHex
            @g = g
            @b = b
            @EncodeHex()

    DecodeHex: ->
        chunks = Torch.Util.String(@hex).Chunk(2)

        r = parseInt(chunks[0], 16)
        g = parseInt(chunks[1], 16)
        b = parseInt(chunks[2], 16)

    EncodeHex: ->
        @hex = ""
        @hex += r.toString(16)
        @hex += g.toString(16)
        @hex += b.toString(16)

    Invert: ->
        @Set( Math.abs( 255 - @r ), Math.abs( 255 - @g ), Math.abs( 255 - @b ) )

    # static color methods

    @Random: ->
        return new Color( Torch.Util.RandomInRange(0,255), Torch.Util.RandomInRange(0,255), Torch.Util.RandomInRange(0,255) )

Color.Red = new Color(256, 0, 0, 1)
Color.Green = new Color(0, 256, 0, 1)
Color.Blue = new Color(0, 0, 256, 1)
Color.Flame = new Color("ff8000")
Color.Ruby = new Color("e60000")
