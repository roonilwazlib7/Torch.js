TorchModule class SpriteGroup
    constructor: (@sprites = [], @game) ->
        for sprite in @sprites
            sprite.anchorX = sprite.Rectangle.x
        return @

    Factory: (spriteClass) ->
        @spriteFactory = spriteClass
        return @

    Add: (sprites, x, y, args...) ->
        if sprites is null or sprites is undefined and @spriteFactory isnt undefined
            newSprite = new @spriteFactory(@game, x, y, args...)
            @sprites.push(newSprite)
            return newSprite
        else
            @sprites = @sprites.concat(sprites)
        return @

    Trash: ->
        for sprite in @sprites then sprite.Trash()
        return @

    Shift: (transition) ->
        for sprite in @sprites
            if transition.x
                sprite.Rectangle.x = sprite.anchorX + transition.x
                #if (transition.y) sprite.Rectangle.y = sprite.Rectangle.y + transition.y;

    Hide: ->
        for sprite in @sprites then sprite.draw = false
        return @

    Show: ->
        for sprite in @sprites then sprite.draw = true
        return @

    Center: ->
        for sprite in @sprites then sprite.Center()
        return @

    ToggleFixed: ->
        for sprite in @sprites then sprite.ToggleFixed()
        return @
