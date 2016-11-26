class Player extends Torch.Sprite
  constructor: (game) ->
    @InitSprite(game, 0, 0)
    @Bind.Texture("player")
    @Center().CenterVertical()

    @On "Collision", (event) =>
        # @Velocity("x", 0).Velocity("y", 0)
        offset = event.collisionData
        if offset.vx < offset.halfWidths and offset.vy < offset.halfHeights
            if offset.x < offset.y

                if offset.vx > 0
                    @Move("x", offset.x/2)
                    #colDir = "l"
                else if offset.vx < 0
                    #colDir = "r"
                    @Move("x", -offset.x/2)

            else if offset.x > offset.y

                if offset.vy > 0
                    #colDir = "t"
                    @Move("y", offset.y/2)

                else if  offset.vy < 0
                    #colDir = "b"
                    @Move("y", -offset.y/2)

  Update: ->
    super()

    keys = @game.Keys

    @Velocity("x", 0).Velocity("y", 0)

    @Velocity("x", 1) if keys.D.down
    @Velocity("x", -1) if keys.A.down
    @Velocity("y", 1) if keys.S.down
    @Velocity("y", -1) if keys.W.down

window.Player = Player
