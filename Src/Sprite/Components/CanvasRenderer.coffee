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

        switch @sprite.torch_render_type
            when "Image"
                @RenderImageSprite(drawRec)
            when "Line"
                @RenderLineSprite(drawRec)
            when "Box"
                @RenderBoxSprite(drawRec)
            when "Circle"
                @RenderCircleSprite(drawRec)
            when "Polygon"
                @RenderPolygonSprite(drawRec)

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
        if @sprite.DrawTexture?
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

        if @sprite.DrawTexture?.image?
            @game.canvas.strokeStyle = @game.canvas.createPattern( @sprite.DrawTexture.image, "repeat" )

        @game.canvas.beginPath()
        @game.canvas.moveTo(drawRec.x, drawRec.y)
        @game.canvas.lineTo( @sprite.endPosition.x + @game.Camera.position.x, @sprite.endPosition.y + @game.Camera.position.y )
        @game.canvas.stroke()

        @game.canvas.restore()

    RenderCircleSprite: (drawRec) ->
        @game.canvas.save()
        @game.canvas.translate(drawRec.x + @sprite.radius / 2, drawRec.y + @sprite.radius / 2)

        @game.canvas.globalAlpha = @sprite.opacity

        @game.canvas.strokeStyle = @sprite.strokeColor
        @game.canvas.fillStyle = @sprite.fillColor

        @game.canvas.beginPath()

        @game.canvas.arc(0, 0, @sprite.radius, @sprite.startAngle, @sprite.endAngle, @sprite.drawDirection is "counterclockwise")

        @game.canvas.fill()
        @game.canvas.stroke()

        @game.canvas.restore()

    RenderBoxSprite: (drawRec) ->
        @game.canvas.save()
        @game.canvas.translate(drawRec.x + @sprite.width / 2, drawRec.y + @sprite.height / 2)

        @game.canvas.globalAlpha = @sprite.opacity
        @game.canvas.strokeStyle = @sprite.strokeColor
        @game.canvas.fillStyle = @sprite.fillColor
        @game.canvas.rotate(@sprite.rotation)

        @game.canvas.beginPath()

        @game.canvas.rect(-@sprite.width/2, -@sprite.height/2, @sprite.width, @sprite.height)

        @game.canvas.fill()
        @game.canvas.stroke()

        @game.canvas.restore()

    RenderPolygonSprite: (drawRec) ->
        @game.canvas.save()

        centerPoint = Point.GetCenterPoint(@sprite.points)

        @game.canvas.translate(drawRec.x + centerPoint.x / 2, drawRec.y + centerPoint.y / 2)

        @game.canvas.globalAlpha = @sprite.opacity
        @game.canvas.strokeStyle = @sprite.strokeColor
        @game.canvas.fillStyle = @sprite.fillColor
        @game.canvas.rotate(@sprite.rotation)

        @game.canvas.beginPath()
        @game.canvas.moveTo(0, 0)

        for point in @sprite.points
            @game.canvas.lineTo(point.x, point.y)

        @game.canvas.closePath()
        @game.canvas.stroke()
        @game.canvas.fill()

        @game.canvas.restore()
