###
    We need to have circles, rectangles, lines, and polys
###
Shapes = {}

class Shapes.Circle extends Sprite
    _EXPERIMENTAL_OPTIMAZATION: true
    _radius: 0
    _fillColor: "black"
    _strokeColor: "black"
    _startAngle: 0
    _endAngle: 2 * Math.PI
    _drawDirection: "clockwise" # or counterclockwise

    constructor: (game, x, y, radius, fillColor = "black", strokeColor = "black")->
        @InitSprite(game, x, y)
        @_radius = radius
        @_fillColor = fillColor
        @_strokeColor = strokeColor
        @Render()

    Render: ->
        return if not @_EXPERIMENTAL_OPTIMAZATION
        canvasNode = document.createElement("CANVAS")
        canvas = canvasNode.getContext("2d")

        canvas.strokeStyle = @_strokeColor
        canvas.fillStyle = @_fillColor

        canvas.beginPath()

        canvas.arc(@_radius, @_radius, @_radius, @_startAngle, @_endAngle, @_drawDirection is "counterclockwise")

        canvas.fill()
        canvas.stroke()

        image = new Image()
        image.src = canvasNode.toDataURL()
        image.onload = =>
            @Bind.Texture(image)

    Draw: ->
        if @_EXPERIMENTAL_OPTIMAZATION
            super()
        else
            # draw it natively

    # we need properties to it re-renders everytime a property is changed

    @property 'radius',
        get: ->
            return @_radius
        set: (value) ->
            @_radius = value
            Util.Function( => @Render() ).Defer()

    @property 'fillColor',
        get: ->
            return @_fillColor
        set: (value) ->
            @_fillColor = value
            Util.Function( => @Render() ).Defer()

    @property 'strokeColor',
        get: ->
            return @_strokeColor
        set: (value) ->
            @_strokeColor = value
            Util.Function( => @Render() ).Defer()

    @property 'startAngle',
        get: ->
            return @_startAngle
        set: (value) ->
            @_startAngle = value
            Util.Function( => @Render() ).Defer()

    @property 'endAngle',
        get: ->
            return @_endAngle
        set: (value) ->
            @_endAngle = value
            Util.Function( => @Render() ).Defer()

    @property 'drawDirection',
        get: ->
            return @_drawDirection
        set: (value) ->
            @_drawDirection = value
            Util.Function( => @Render() ).Defer()

class Shapes.Line extends Sprite
    torch_render_type: "Line"
    color: "black"
    lineWidth: 1

    endPosition: null

    constructor: (game, x, y, endX, endY, @color, config) ->
        @InitSprite(game, x, y)

        @endPosition = new Point(endX, endY)

        Util.Object(@).Extend(config)
