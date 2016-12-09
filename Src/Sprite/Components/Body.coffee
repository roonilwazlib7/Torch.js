class Body
    constructor: (@sprite)->

        Torch.Assert(@sprite isnt null and @sprite.__torch__ is Torch.Types.Sprite)

        @game = @sprite.game
        @velocity = new Torch.Vector(0,0)
        @acceleration = new Torch.Vector(0,0)
        @omega = 0
        @alpha = 0

    Update: ->
        @sprite.position.x += @velocity.x * @game.Loop.updateDelta
        @sprite.position.y += @velocity.y * @game.Loop.updateDelta

        @velocity.x += @acceleration.x * @game.Loop.updateDelta
        @velocity.y += @acceleration.y * @game.Loop.updateDelta

        @sprite.rotation += @omega * @game.Loop.updateDelta

    Debug: (turnOn = true) ->
        @DEBUG = turnOn


Torch.Body = Body
