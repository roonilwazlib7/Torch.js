exports = this

class CanvasRenderer
    constructor: (@sprite) ->
        @game = @sprite.game

    Draw: ->
        drawRec = new Torch.Rectangle(@sprite.Position("x"), @sprite.Position("y"), @sprite.Width(), @sprite.Height())

        cameraTransform = new Torch.Point(0,0) # @game.Camera.Position()

        drawRec.x += cameraTransform.x
        drawRec.y += cameraTransform.y

        if @sprite.TextureSheet
            frame = @sprite.GetCurrentDraw()

            @PreRender(drawRec)

            canvas.drawImage(@sprite.DrawTexture.image, frame.clipX, frame.clipY,
            frame.clipWidth, frame.clipHeight,
            -drawRec.width/2, -drawRec.height/2, drawRec.width, drawRec.height)

            @PostRender()

        else if @sprite.DrawTexture

            @PreRender(drawRec)

            @game.canvas.drawImage(@sprite.DrawTexture.image, -drawRec.width/2, -drawRec.height/2, drawRec.width, drawRec.height)
            if @sprite.Body.DEBUG
                @game.canvas.fillStyle = "green"
                @game.canvas.globalAlpha = 0.5
                @game.canvas.fillRect(-drawRec.width/2, -drawRec.height/2, drawRec.width, drawRec.height)

            @PostRender()

    PreRender: (drawRec)->
        canvas = @game.canvas
        canvas.save()
        canvas.globalAlpha = @sprite.Opacity()
        canvas.translate(drawRec.x + drawRec.width / 2, drawRec.y + drawRec.height / 2)
        canvas.rotate(@sprite.Rotation())

    PostRender: ->
        canvas = @game.canvas
        canvas.restore()


exports.CanvasRenderer = CanvasRenderer
