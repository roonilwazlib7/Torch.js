class Player extends Torch.Sprite
  constructor: (game) ->
    @InitSprite(game, 0, 0)
    @Bind.Texture("player")
    @Center().CenterVertical()

    @On "Collision", (event) =>
        offset = event.collisionData
        if offset.vx < offset.halfWidths and offset.vy < offset.halfHeights
            if offset.x < offset.y
                @Velocity("y", 0)

                if offset.vx > 0
                    @Move("x", offset.x)
                    #colDir = "l"
                else if offset.vx < 0
                    #colDir = "r"
                    @Move("x", -offset.x)

            else if offset.x > offset.y

                if offset.vy > 0
                    #colDir = "t"
                    @Move("y", offset.y)
                    @Velocity("y", 0)

                else if  offset.vy < 0
                    #colDir = "b"
                    @Move("y", -offset.y)

  Update: ->
    super()

    keys = @game.Keys

    @Velocity("x", 0).Velocity("y", 0)

    @Velocity("x", 1) if keys.D.down
    @Velocity("x", -1) if keys.A.down
    @Velocity("y", 1) if keys.S.down
    @Velocity("y", -1) if keys.W.down

window.Player = Player
