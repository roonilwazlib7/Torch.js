exports = this

class Bullet extends Torch.Sprite

    constructor: (game, x, y) ->

        @InitSprite(game, x, y)

        @Bind.Texture("bullet")

        @VELOCITY = 1
        @target = ""

        @On "OutOfBounds", => @Trash()

        @DrawIndex(-1)

    Target: (target) ->
        @target = target
        if @target is "player"
            @Velocity("y", @VELOCITY)

        else if @target is "enemy"
            @Velocity("y", -@VELOCITY)
        return @

    Explode: ->
        @Velocity("x", 0).Velocity("y", 0)
        @Bind.Texture("bullet-explode")
        @game.Timer.SetFutureEvent 100, =>
            @Trash()

    Update: ->
        super()
        if @target is "player"
            if @CollidesWith(player).AABB()
                @Explode()

        else if @target is "enemy"
            enemies = enemyManager.Enemies()
            for en in enemies
                if @CollidesWith(en).AABB()
                    @Explode()

exports.Bullet = Bullet
