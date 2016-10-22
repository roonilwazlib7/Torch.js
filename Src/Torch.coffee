exports = this
Function::is = (otherFunction) ->
    proto = this.prototype
    items = Object.create(otherFunction.prototype)

    for key in items
        proto[key] = items[key]

    return this #allow chaining

Function::Make = (game, x, y) ->
    return new this(game, x, y)

String::format = (args...) ->
    replacer = (match, number) ->
        return args[number] if typeof args[number] isnt undefined
        return match        if typeof args[number] is undefined

    return @replace(/{(\d+)}/g, replacer)

window.onerror = (args...) ->
    return if not Torch.STRICT_ERRORS

    errorObj = args[4]

    if errorObj isnt undefined
        Torch.FatalError(errorObj)
    else
        Torch.FatalError("An error has occured")

Torch =
    CANVAS: 1
    WEBGL: 2
    Needs: (key) ->
        # make sure we have the peoper torch components
        if not Torch[key] then throw "Compenent #{key} is required"
        return @
    Message: (message, color) ->
        if $("#torch_message").length > 0
            message = $("<p>" + message + "</p>")
            message.css("font-weight", "bold")

            if color then message.css("color", color)

            $("#torch_message").append(message)

    FatalError: (error) ->
        return if @fatal
        @fatal = true

        if typeof error is "string"
            error = new Error(error)

        document.body.backgroundColor = "black"
        stack = error.stack.replace(/\n/g, "<br><br>")
        $("body").empty()
        $("body").prepend("<code style='color:#C9302C;font-size:20px'>" + stack + "</code><br>")
        $("body").prepend("<code style='color:#C9302C;margin-left:15%;font-size:24px'>" + error + "</code><br><code style='color:#C9302C;font-size:20px;font-weight:bold'>Stack Trace:</code><br>")
        throw error

    StrictErrors: ->
        @STRICT_ERRORS = true

class Rectangle
    constructor: (@x, @y, @width, @height) ->
        @z = -10

    GetOffset: (rectangle) ->
        vx = ( @x + ( @width / 2 ) ) - ( rectangle.x + ( rectangle.width / 2 ) )
        vy = ( @y + (@height / 2 ) ) - ( rectangle.y + ( rectangle.height / 2 ) )
        halfWidths = (@width / 2) + (rectangle.width / 2)
        halfHeights = (@height / 2) + (rectangle.height / 2)
        sharedXPlane = (@x + @width) - (rectangle.x + rectangle.width)
        sharedYPlane = (@y + @height) - (rectangle.y + rectangle.height)

        offset =
            x: halfWidths - Math.abs(vx)
            y: halfHeights - Math.abs(vy)
            vx: vx
            vy: vy
            halfWidths: halfWidths
            halfHeights: halfHeights
            sharedXPlane: sharedXPlane
            sharedYPlane: sharedYPlane

        return offset


    Intersects: (rectangle) ->
        a = @
        b = rectangle
        if a.x < (b.x + b.width) && (a.x + a.width) > b.x && a.y < (b.y + b.height) && (a.y + a.height) > b.y
            return a.GetOffset(b)
        else
            return false

    ShiftFrom: (rectangle, transX, transY) ->
        x = null
        y = null

        if transX is undefined then x = rectangle.x
        else x = rectangle.x + transX

        if transY is undefined then y = rectangle.y
        else y = rectangle.y + transY

        @x = x
        @y = y

class Vector
    constructor: (@x, @y) ->

    Normalize: ->
        r = (@x * @x) + (@y * @y)
        r = Math.sqrt(r)

        x = @x
        y = @y

        @x = x / r
        @y = y / r

    GetDistance: (otherVector) ->
        raw = Math.pow(otherVector.x - @x, 2) + Math.pow(otherVector.y - @y, 2)
        return Math.sqrt(raw)

class Body
    constructor: ->
        # this is iffy...
        Plane = ->
            this.velocity = 0
            this.acceleration = 0
            this.lv = 0
            this.la = 0
            this.aTime = 0
            this.maxVelocity = 100

        @x = new Plane()
        @y = new Plane()

    Velocity: (plane, velocity) ->
        @[plane].velocity = velocity
        return @

    Acceleration: (plane, acceleration) ->
        @[plane].acceleration = acceleration
        return @

class HitBox
    constructor: ->
        @x = 0
        @y = 0
        @width = 0
        @height = 0

class Point
    constructor: (@x, @y) ->

# some enums
Torch.GamePads =
    Pad1: 0,
    Pad2: 1,
    Pad3: 2,
    Pad4: 3

Torch.Rectangle = Rectangle
Torch.Vector = Vector
Torch.Body = Body
Torch.HitBox = HitBox
Torch.Point = Point

exports.Torch = Torch
