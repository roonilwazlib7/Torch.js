Torch.Collision =
    AABB: 1
    Circle: 2
    SAT: 3

class CollisionManager
    mode: Torch.Collision.AABB
    sprite: null
    filter: null
    limit: null

    constructor: (@sprite) ->
        @filter = {}
        @game = @sprite.game

    NotFiltered: (sprite) ->
        # evaluate the sprite to see if it is filtered out
        # by comparing its attributes with filter objects

        # check game-wide filters
        for key,value of @game.filter
            # check special flag
            if key is "__type__"
                return false if value.constructor.name is sprite.constructor.name
            else
                return false if value is sprite[key]

        # check sprite-specific filters
        for key,value of @filter
            # check special flag
            if key is "__type__"
                return false if value.constructor.name is sprite.constructor.name
            else
                return false if value is sprite[key]

        return true

    InLimit: (sprite) ->
        # evaluate sprite to make sure it has attributes
        # that match limit object

        # check sprite-specific limits
        for key,value of @limit
            # check special flag
            if key is "__type__"
                return true if value.constructor.name is sprite.constructor.name
            else
                return true if value is sprite[key]

        return false

    Valid: (sprite) ->
        if @limit isnt null
            return @InLimit(sprite)

        return @NotFiltered(sprite)

    Filter: (_filter) ->
        @filter = _filter

    Limit: (_limit) ->
        @limit = _limit

    Mode: (_mode) ->
        mode = _mode

    Update: ->
        return if not @sprite.game
        @game = @sprite.game

        for otherSprite in @game.spriteList
            if @sprite.NotSelf(otherSprite) and @Valid(otherSprite)
                collisionDetected = false
                collisionData = {}
                switch @mode
                    when Torch.Collision.AABB
                        collisionData = @sprite.CollidesWith(otherSprite).AABB()
                        collisionDetected = collisionData isnt false

                if collisionDetected
                    collisionData.self = @sprite
                    collisionData.collider = otherSprite

                    @sprite.Emit("Collision", new Torch.Event(@game, {collisionData: collisionData}))

Torch.CollisionManager = CollisionManager
