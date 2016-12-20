###
    We need to have circles, rectangles, lines, and polys
###
Shapes = {name: "Shapes"}

TorchModule Shapes

class Shapes.Circle extends Sprite
    torch_render_type: "Circle"
    radius: 0
    fillColor: "black"
    strokeColor: "black"
    startAngle: 0
    endAngle: 2 * Math.PI
    drawDirection: "clockwise" # or counterclockwise

    constructor: (game, x, y, radius, fillColor = "black", strokeColor = "black")->
        @InitSprite(game, x, y)
        @radius = radius
        @fillColor = fillColor
        @strokeColor = strokeColor

class Shapes.Line extends Sprite
    torch_render_type: "Line" # render it natively
    color: "black"
    lineWidth: 1

    endPosition: null

    constructor: (game, x, y, endX, endY, @color, config) ->
        @InitSprite(game, x, y)

        @endPosition = new Point(endX, endY)

        Util.Object(@).Extend(config)

class Shapes.Box extends Sprite
    torch_render_type: "Box"
    torch_shape: true
    fillColor: "black"
    strokeColor: "black"
    width: 0
    height: 0

    constructor: (game, x, y, width, height, fillColor = "black", strokeColor = "black") ->
        @InitSprite(game, x, y)
        @width = width
        @height = height
        @fillColor = fillColor
        @strokeColor = strokeColor

class Shapes.Polygon extends Sprite
    torch_render_type: "Polygon"
    constructor: (game, x, y, @points, @fillColor, @strokeColor) ->
        @InitSprite(game, x, y)

    @Regular: (game, x, y, sides, width, fillColor, strokeColor) ->
        angleInterval = (Math.PI * 2) / sides
        points = []
        angle = 0

        while angle <= Math.PI * 2

            px = Math.cos(angle) * width
            py = Math.sin(angle) * width

            points.push( new Point(px,py) )

            angle += angleInterval


        shape = new Shapes.Polygon(game, x, y, points, fillColor, strokeColor)
        shape.rectangle.width = shape.rectangle.height = width

        return shape
