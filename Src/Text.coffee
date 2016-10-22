cnv = document.createElement("CANVAS")
cnv.width = 500
cnv.height = 500
Torch.measureCanvas = cnv.getContext("2d")

class Text extends Torch.Sprite
    TEXT: true
    constructor: (game, x, y, data) ->
        @InitText(game, x, y, data)

    InitText: (game, x, y, data) ->
        @InitSprite(game,x,y)
        @data = data
        @font = "Arial"
        @fontSize = 16
        @fontWeight = ""
        @color = "#2b4531"
        @text = ""
        @lastText = ""
        @width = 100
        @height = 100
        @Init()

    Init: ->
        if @data.font            then @font = @data.font
        if @data.fontSize        then @fontSize = @data.fontSize
        if @data.fontWeight      then @fontWeight = @data.fontWeight
        if @data.color           then @color = @data.color
        if @data.text            then @text = @data.text
        if @data.rectangle       then @Rectangle = @data.rectangle
        if @data.buffHeight      then @buffHeight = @data.buffHeight

        @Render()

    Render: ->
        cnv = document.createElement("CANVAS")
        Torch.measureCanvas.font = @fontSize + "px " + @font
        cnv.width = Torch.measureCanvas.measureText(@text).width
        cnv.height = @fontSize + 5

        if @buffHeight
            cnv.height += @buffHeight

        canvas = cnv.getContext("2d")
        canvas.fillStyle = @color
        canvas.font = @fontWeight + " " + @fontSize + "px " + @font
        canvas.fillText(@text,0,cnv.height)

        # generate the image
        image = new Image()
        image.src = cnv.toDataURL()
        image.onload = =>
            @Bind.Texture(image)

        @Rectangle.width = cnv.width
        @Rectangle.height = @fontSize + 5

    Update: ->
        @UpdateText()

    UpdateText: ->
        super()
        if @text isnt @lastText
            @Render()
            @lastText = @text

    Text: (text) ->
        if text is undefined
            return @text
        else
            @text = text
            return @

    Font: (font) ->
        if (font is undefined)
            return @font
        else
            @font = font
            return @

    FontSize: (fontSize) ->
        if fontSize is undefined
            return @fontSize
        else
            @fontSize = fontSize
            return @

    FontWeight: (fontWeight) ->
        if fontWeight is undefined
            return @fontWeight
        else
            @fontWeight = fontWeight
            return @


    Color: (color) ->
        if color is undefined
            return @color
        else
            @color = color
            return @

Torch.Text = Text
