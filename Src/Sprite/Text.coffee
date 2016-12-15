_measureCanvas = document.createElement("CANVAS")
_measureCanvas.width = 500
_measureCanvas.height = 500

class Text extends Sprite
    TEXT: true
    @measureCanvas: _measureCanvas.getContext("2d")

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
        @Size.scale = {width: 1, height: 1}
        @Init()

    Init: ->
        if @data.font            then @font =           @data.font
        if @data.fontSize        then @fontSize =       @data.fontSize
        if @data.fontWeight      then @fontWeight =     @data.fontWeight
        if @data.color           then @color =          @data.color
        if @data.text            then @text =           @data.text
        if @data.rectangle       then @rectangle =      @data.rectangle
        if @data.buffHeight      then @buffHeight =     @data.buffHeight

        @Render()

    Render: ->
        cnv = document.createElement("CANVAS")
        Text.measureCanvas.font = @fontSize + "px " + @font
        cnv.width = Text.measureCanvas.measureText(@text).width
        cnv.height = @fontSize

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
                # we need to get rid of the old one
                if @Three() then @Three().Remove()

                @Bind.WebGLTexture
                            gl_2d_canvas_generated_image: true
                            width: image.width
                            height: image.height
                            texture: new THREE.TextureLoader().load( image.src )
            else
                @Bind.Texture(image)

        @rectangle.width = cnv.width
        @rectangle.height = @fontSize

    Update: ->
        super()
        @UpdateText()

    UpdateText: ->
        if @text isnt @lastText
            @Render()
            @lastText = @text
