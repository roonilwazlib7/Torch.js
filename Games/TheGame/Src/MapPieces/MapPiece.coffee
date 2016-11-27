exports = this
class MapPiece extends Torch.Sprite
    MAPPIECE: true
    identifier: 0
    textureId: ""
    data: null
    constructor: (game, rawData) ->
        @data = @GetData(rawData)
        @InitSprite(game, @data.position.x, @data.position.y )
        @Bind.Texture(@textureId)

    GetData: (rawData) ->
        data = {}
        data.position = {x: parseInt(rawData[0], 16), y: parseInt(rawData[1], 16)}
        return data


class Bush extends MapPiece
    textureId: "bush"

class PlayerStart extends MapPiece
    textureId: "player-start"

exports.MapPieces = {
    PlayerStart: PlayerStart,
    Bush: Bush
}
