if document?
    _measureCanvas = document.createElement("CANVAS")
    _measureCanvas.width = 500
    _measureCanvas.height = 500
else
    _measureCanvas =
        getContext: ->

TorchModule class Text extends Sprite
    TEXT: true
    @measureCanvas: _measureCanvas.getContext("2d")

    # we need properties because the text needs to re-render
    # whenever it is changed
    @property 'fontSize',
        get: -> return @_fontSize
        set: (fontSize) ->
            @_fontSize = fontSize
            Util.Function( => @Render() ).Defer()

    @property 'font',
        get: -> return @_font
        set: (font) ->
            @_font = font
            Util.Function( => @Render() ).Defer()

    @property 'fontWeight',
        get: -> return @_fontWeight
        set: (fontWeight) ->
            @_fontWeight = fontWeight
            Util.Function( => @Render() ).Defer()

    @property 'color',
        get: -> return @_color
        set: (color) ->
            @_color = color
            Util.Function( => @Render() ).Defer()

    @property 'text',
        get: -> return @_text
        set: (text) ->
            @_text = text
            Util.Function( => @Render() ).Defer()

    constructor: (game, x, y, data) ->
        @InitText(game, x, y, data)

    InitText: (game, x, y, data) ->
        @InitSprite(game,x,y)
        @data = data
        @_font = "Arial"
        @_fontSize = 16
        @_fontWeight = ""
        @_color = "#2b4531"
        @_text = ""
        @width = 100
        @height = 100
        @Size.scale = {width: 1, height: 1}
        @Init()

    Init: ->
        if @data.font            then @_font =           @data.font
        if @data.fontSize        then @_fontSize =       @data.fontSize
        if @data.fontWeight      then @_fontWeight =     @data.fontWeight
        if @data.color           then @_color =          @data.color
        if @data.text            then @_text =           @data.text
        if @data.rectangle       then @rectangle =      @data.rectangle
        if @data.buffHeight      then @buffHeight =     @data.buffHeight

        @Render()

    Render: ->
        cnv = document.createElement("CANVAS")
        Text.measureCanvas.font = @_fontSize + "px " + @_font
        cnv.width = Text.measureCanvas.measureText(@_text).width # need to fix this to account for bold fonts
        cnv.height = @_fontSize

        if @buffHeight
            cnv.height += @buffHeight

        canvas = cnv.getContext("2d")
        canvas.fillStyle = @_color
        canvas.font = @_fontWeight + " " + @_fontSize + "px " + @_font
        canvas.fillText(@_text,0,cnv.height)

        # generate the image
        image = new Image()
        image.src = cnv.toDataURL()
        image.onload = =>
                @Bind.Texture(image)

        @rectangle.width = cnv.width
        @rectangle.height = @_fontSize

    Update: ->
        super()
