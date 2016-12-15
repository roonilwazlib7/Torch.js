class Graphic extends Sprite
    constructor(args...) ->
        @RenderGraphic(args...)

        @renderCanvas = document.createElement("CANVAS")

        @On "GraphicChanged", (event) =>
            @RenderGraphic(event.renderProperites...)

class Circle extends Graphic
    Radius: (radius) ->
        if radius isnt undefined and radius isnt @radius
            @radius = radius


    Color: (color) ->

    OutlineColor: (outlineColor) ->

    StartAngle: (startAngle) ->

    EndAngle: (endAngle) ->

    RenderGraphic: (radius, color, outlineColor = "black", startAngle = 0, endAngle = 2 * Math.PI) ->
        @renderCanvas.width = radius
        @renderCanvas.height = radius
        @canvas = @renderCanvas.getContext("2d")
        @canvas.beginPath()
        @canvas.strokeStyle = outlineColor
        @canvas.fillStyle = color
        @canvas.arc(0, 0, radius, startAngle, endAngle)
        @canvas.fill()

        @canvas.stroke() if outlineColor isnt ""

        im = new Image()
        im.src = @renderCanvas.toDataURL()

        im.onload = =>
            @Bind.Texture(im)
