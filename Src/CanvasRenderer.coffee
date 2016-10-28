exports = this

class CanvasRenderer
    constructor: (@sprite) ->
        @game = @sprite.game

    Draw: ->
        DrawRec = new Torch.Rectangle(@sprite.Rectangle.x, @sprite.Rectangle.y, @sprite.Rectangle.width, @sprite.Rectangle.height)
        if @sprite.fixed
            DrawRec.x -= @sprite.game.Viewport.x
            DrawRec.y -= @sprite.game.Viewport.y

        if @sprite.TexturePack
            @sprite.game.Draw(@sprite.GetCurrentDraw(), DrawRec, @sprite.DrawParams)

        else if @sprite.TextureSheet
            frame = @sprite.GetCurrentDraw()
            drawParams = @sprite.DrawParams ? {}

            params = Object.create(drawParams)
            params.clipX = frame.clipX
            params.clipY = frame.clipY
            params.clipWidth = frame.clipWidth
            params.clipHeight = frame.clipHeight
            params.IsTextureSheet = true
            params.rotation = @sprite.rotation
            params.alpha = @sprite.opacity

            @sprite.game.Render(@sprite.DrawTexture, DrawRec, params)

        else if @sprite.DrawTexture
            DrawParams =
                alpha: @sprite.opacity,
                rotation: @sprite.rotation

            @sprite.game.Render(@sprite.GetCurrentDraw(), DrawRec, DrawParams)

    Render: (texture, rectangle, params = {}) ->
        canvas = @game.canvas
        viewport = @game.Viewport
        viewRect = viewport.GetViewRectangle()

        if not rectangle.Intersects(viewRect)
            return

        canvas.save()

        x = Math.round(rectangle.x + viewport.x)
        y = Math.round(rectangle.y + viewport.y)
        width = rectangle.width
        height = rectangle.height

        rotation = params.rotation ? 0
        rotation += viewport.rotation

        canvas.globalAlpha = params.alpha ? canvas.globalAlpha

        canvas.translate(x + width / 2, y + height / 2)

        canvas.rotate(rotation)

        if params.IsTextureSheet
            canvas.drawImage(texture.image, params.clipX, params.clipY, params.clipWidth, params.clipHeight, -width/2, -height/2, rectangle.width, rectangle.height)
        else
            canvas.drawImage(texture.image, -width/2, -height/2, rectangle.width, rectangle.height)

        canvas.rotate(0)
        canvas.globalAlpha = 1

        canvas.restore()

exports.CanvasRenderer = CanvasRenderer
