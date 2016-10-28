exports = this

class CanvasRenderer
    constructor: (@sprite) ->

    Draw: ->
        DrawRec = new Torch.Rectangle(@sprite.Rectangle.x, @sprite.Rectangle.y, @sprite.Rectangle.width, @sprite.Rectangle.height)
        if @sprite.fixed
            DrawRec.x -= @sprite.game.Viewport.x
            DrawRec.y -= @sprite.game.Viewport.y

        if @sprite.TexturePack
            @sprite.game.Draw(@sprite.GetCurrentDraw(), DrawRec, @sprite.DrawParams)

        else if @sprite.TextureSheet
            drawParams = @sprite.DrawParams ? {}
            Params = Object.create(drawParams)
            frame = @sprite.GetCurrentDraw()
            Params.clipX = frame.clipX
            Params.clipY = frame.clipY
            Params.clipWidth = frame.clipWidth
            Params.clipHeight = frame.clipHeight
            Params.IsTextureSheet = true
            Params.rotation = @sprite.rotation
            Params.alpha = @sprite.opacity
            @sprite.game.Draw(@sprite.DrawTexture, DrawRec, Params)

        else if @sprite.DrawTexture
            DrawParams =
                alpha: @sprite.opacity,
                rotation: @sprite.rotation

            @sprite.game.Draw(@sprite.GetCurrentDraw(), DrawRec, DrawParams)

exports.CanvasRenderer = CanvasRenderer
