class CanvasRenderer
    constructor: (@sprite) ->
        @game = @sprite.game
        @previousPosition = new Point(@sprite.position.x, @sprite.position.y)
    Draw: ->
        drawRec = new Rectangle(@sprite.position.x, @sprite.position.y, @sprite.rectangle.width, @sprite.rectangle.height)

        drawRec.x = ( @sprite.position.x - @previousPosition.x ) * @game.Loop.lagOffset + @previousPosition.x
        drawRec.y = ( @sprite.position.y - @previousPosition.y ) * @game.Loop.lagOffset + @previousPosition.y
        @previousPosition = new Point(@sprite.position.x, @sprite.position.y)

        cameraTransform = new Point(0,0)

        if not @sprite.fixed
            drawRec.x += @game.Camera.position.x + @game.Hooks.positionTransform.x
            drawRec.y += @game.Camera.position.y + @game.Hooks.positionTransform.y

            #return if not drawRec.Intersects(@game.Camera.Viewport.rectangle)
        switch @sprite.torch_render_type
            when "Image"
                @RenderImageSprite(drawRec)
            when "Line"
                @RenderLineSprite(drawRec)

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

    RenderImageSprite: (drawRec) ->
        if @sprite.DrawTexture
            frame = @sprite.DrawTexture
            params = frame.drawParams

            @PreRender(drawRec)

            @game.canvas.drawImage(@sprite.DrawTexture.image, params.clipX, params.clipY,
            params.clipWidth, params.clipHeight,-drawRec.width/2, -drawRec.height/2,
            drawRec.width, drawRec.height)

            if @sprite.Body.DEBUG
                @game.canvas.fillStyle = @sprite.Body.DEBUG
                @game.canvas.globalAlpha = 0.5
                @game.canvas.fillRect(-drawRec.width/2, -drawRec.height/2, drawRec.width, drawRec.height)

            @PostRender()

    RenderLineSprite: (drawRec) ->
        @game.canvas.save()

        @game.canvas.globalAlpha = @sprite.opacity
        @game.canvas.strokeStyle = @sprite.color
        @game.canvas.lineWidth = @sprite.lineWidth

        @game.canvas.beginPath()
        @game.canvas.moveTo(drawRec.x, drawRec.y)
        @game.canvas.lineTo( @sprite.endX + @game.Camera.position.x, @sprite.endY + @game.Camera.position.y )
        @game.canvas.stroke()

        @game.canvas.restore()
