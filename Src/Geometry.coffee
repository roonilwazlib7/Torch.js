class Rectangle
    constructor: (@x, @y, @width, @height) ->
        @z = 0

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
    constructor: (@x, @y, @z = 0) ->

Torch.Rectangle = Rectangle
Torch.Vector = Vector
Torch.Body = Body
Torch.HitBox = HitBox
Torch.Point = Point
