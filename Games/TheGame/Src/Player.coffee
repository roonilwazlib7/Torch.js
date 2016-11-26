class Player extends Torch.Sprite
  constructor: (game) ->
    @InitSprite(game, 0, 0)
    @Bind.Texture("player")
    @Center().CenterVertical()

    @On "Collision", (event) =>
        @Collisions.SimpleCollisionHandle(event)
  Update: ->
    super()

    keys = @game.Keys

    @Velocity("x", 0).Velocity("y", 0)

    @Velocity("x", 1) if keys.D.down
    @Velocity("x", -1) if keys.A.down
    @Velocity("y", 1) if keys.S.down
    @Velocity("y", -1) if keys.W.down

window.Player = Player
