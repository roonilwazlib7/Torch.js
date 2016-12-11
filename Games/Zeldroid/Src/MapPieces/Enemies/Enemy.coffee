exports = this

class Enemy extends MapPieces.MapPiece
    hardBlock: true
    hp: 3
    ENEMY: true
    identifier: 200

    @Load: (game) ->
        game.Load.Texture("Assets/Art/enemies/blob.png", "blob")

class Blob extends Enemy
    textureId: "blob"
    identifier: 201


Torch.ExtendObject MapPieces,
    Blob: Blob


exports.Enemy = Enemy
