exports = this
class MapPiece extends Torch.Sprite
    MAPPIECE: true
    identifier: 0
    textureId: ""
    data: null
    constructor: (game, rawData) ->
        @data = @GetData(rawData, game)
        @InitSprite(game, @data.position.x, @data.position.y )
        @Bind.Texture(@textureId)
        @DrawIndex(10)

    GetData: (rawData, game) ->
        SCALE = 64
        data = {}
        data.position =
            x: parseInt(rawData[0], 16) * SCALE
            y: parseInt(rawData[1], 16) * SCALE + game.hud.hud_background.Height()

        return data


class Bush extends MapPiece
    textureId: "bush"

class PlayerStart extends MapPiece
    textureId: "player-start"

class Water extends MapPiece
    textureId: "water"
    identifier: 1

exports.MapPieces = {
    Bush: Bush,
    Water: Water
}
