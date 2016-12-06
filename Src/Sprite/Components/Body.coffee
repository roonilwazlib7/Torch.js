class Body
    constructor: (@sprite)->
        @game = @sprite.game
        @velocity = new Torch.Vector(0,0)
        @acceleration = new Torch.Vector(0,0)

    Update: ->
        @sprite.position.x += @velocity.x * @game.deltaTime
        @sprite.position.y += @velocity.y * @game.deltaTime

        @velocity.x += @acceleration.x * @game.deltaTime
        @velocity.y += @acceleration.y * @game.deltaTime

    Velocity: (plane, velocity) ->
        @velocity[plane] = velocity
        return @

    Acceleration: (plane, acceleration) ->
        @acceleration[plane] = acceleration
        return @

    Debug: (turnOn = true) ->
        @DEBUG = turnOn


Torch.Body = Body
