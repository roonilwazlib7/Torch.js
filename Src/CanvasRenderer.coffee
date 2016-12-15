exports = this

class CanvasRenderer
    constructor: (@sprite) ->
        @game = @sprite.game
        @previousPosition = new Torch.Point(@sprite.position.x, @sprite.position.y)
    Draw: ->
        drawRec = new Torch.Rectangle(@sprite.position.x, @sprite.position.y, @sprite.rectangle.width, @sprite.rectangle.height)

        drawRec.x = ( @sprite.position.x - @previousPosition.x ) * @game.Loop.lagOffset + @previousPosition.x
        drawRec.y = ( @sprite.position.y - @previousPosition.y ) * @game.Loop.lagOffset + @previousPosition.y
        @previousPosition = new Torch.Point(@sprite.position.x, @sprite.position.y)

        cameraTransform = new Torch.Point(0,0)

        if not @sprite.fixed
            drawRec.x += @game.Camera.position.x + @game.Hooks.positionTransform.x
            drawRec.y += @game.Camera.position.y + @game.Hooks.positionTransform.y

            #return if not drawRec.Intersects(@game.Camera.Viewport.rectangle)

        if @sprite.DrawTexture
            frame = @sprite.DrawTexture
            params = frame.drawParams

            @PreRender(drawRec)

            @game.canvas.drawImage(@sprite.DrawTexture.image, params.clipX, params.clipY,
            params.clipWidth, params.clipHeight,-drawRec.width/2, -drawRec.height/2,
            drawRec.width, drawRec.height)

            if @sprite.Body.DEBUG and false
                @game.canvas.fillStyle = "green"
                @game.canvas.globalAlpha = 0.5
                @game.canvas.fillRect(-drawRec.width/2, -drawRec.height/2, drawRec.width, drawRec.height)

            @PostRender()

    PreRender: (drawRec)->
        canvas = @game.canvas
        canvas.save()
        canvas.translate(drawRec.x + drawRec.width / 2, drawRec.y + drawRec.height / 2)

        if @sprite.Effects.tint.color isnt null
            @game.canvas.fillStyle = @sprite.Effects.tint.color
            @game.canvas.globalAlpha = @sprite.Effects.tint.opacity
            @game.canvas.globalCompositeOperation = "destination-atop"
            @game.canvas.fillRect(-drawRec.width/2, -drawRec.height/2, drawRec.width, drawRec.height)

        canvas.globalAlpha = @sprite.opacity
        canvas.rotate(@sprite.rotation)

    PostRender: ->
        canvas = @game.canvas
        canvas.restore()


exports.CanvasRenderer = CanvasRenderer
