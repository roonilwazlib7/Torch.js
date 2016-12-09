exports = this
class MapPiece extends Torch.Sprite
    MAPPIECE: true
    identifier: 0
    textureId: ""
    data: null
    scaleWidth: 1
    scaleHeight: 1
    hardBlock: true
    constructor: (game, rawData) ->
        @data = @GetData(rawData, game)
        @InitSprite(game, @data.position.x, @data.position.y )
        @Bind.Texture(@textureId)
        @drawIndex = 10

    GetData: (rawData, game) ->
        SCALE = 64
        data = {}
        data.position =
            x: parseInt(rawData[0], 16) * SCALE
            y: parseInt(rawData[1], 16) * SCALE + game.hud.hud_background.Size.height

        return data


class Bush extends MapPiece
    textureId: "bush"

class PlayerStart extends MapPiece
    textureId: "player-start"

class Water extends MapPiece
    textureId: "water"
    identifier: 1

class Branch extends MapPiece
    textureId: "branch"
    identifier: 2

class LightGrass extends MapPiece
    hardBlock: false
    textureId: "light-grass"
    identifier: 3

class Bumps extends MapPiece
    hardBlock: false
    textureId: "bumps"
    identifier: 4

exports.MapPieces = {
    Bush: Bush,
    Water: Water,
    Branch: Branch,
    LightGrass: LightGrass,
    Bumps: Bumps
}
