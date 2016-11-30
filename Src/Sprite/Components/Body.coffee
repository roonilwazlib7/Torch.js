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

    Debug: (turnOn = true) ->
        @DEBUG = turnOn


Torch.Body = Body
