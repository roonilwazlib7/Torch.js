exports = this
class MapPiece extends Torch.Sprite
    MAPPIECE: true
    identifier: 0
    textureId: ""
    data: null
    scaleWidth: 1
    scaleHeight: 1
    hardBlock: true
    hp: 2
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

    Update: ->
        super()

        if @hp <= 0
            @Die()

    Die: ->
        @emitter = @game.Particles.ParticleEmitter 500, 0, 0, true, @textureId,
            spread: 20
            gravity: 0.0001
            minAngle: 0
            maxAngle: Math.PI * 2
            minScale: 0.1
            maxScale: 0.5
            minVelocity: 0.01
            maxVelocity: 0.01
            minAlphaDecay: 400
            maxAlphaDecay: 450
            minOmega: 0.001
            maxOmega: 0.001
        @emitter.auto = false
        @emitter.position = @position.Clone()
        @emitter.EmitParticles()

        @Trash()


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
