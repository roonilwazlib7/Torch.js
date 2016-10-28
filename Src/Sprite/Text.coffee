measureCanvas = document.createElement("CANVAS")
measureCanvas.width = 500
measureCanvas.height = 500

class Text extends Torch.Sprite
    TEXT: true
    @measureCanvas: measureCanvas.getContext("2d")

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
        if @data.font            then @font =           @data.font
        if @data.fontSize        then @fontSize =       @data.fontSize
        if @data.fontWeight      then @fontWeight =     @data.fontWeight
        if @data.color           then @color =          @data.color
        if @data.text            then @text =           @data.text
        if @data.rectangle       then @Rectangle =      @data.rectangle
        if @data.buffHeight      then @buffHeight =     @data.buffHeight

        @Render()

    Render: ->
        cnv = document.createElement("CANVAS")
        Text.measureCanvas.font = @fontSize + "px " + @font
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
            if @GL
                @Bind.Texture
                            gl_2d_canvas_generated_image: true
                            image: image
            else
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

Torch.ExtendProperties(Text, "Text", "Font", "FontSize", "FontWeight", "Color")

Torch.Text = Text
