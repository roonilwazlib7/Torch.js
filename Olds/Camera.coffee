class Camera
    Update: ->
        @update_Track()

    Track: (sprite) ->
        @track = true
        @trackSprite = sprite
        @lastTrackX = sprite.Rectangle.x
        game = @trackSprite.game
        x = @trackSprite.Rectangle.x + (game.Viewport.width / 2) + (@trackSprite.Rectangle.width / 2)
        game.Viewport.x = x
        # if (!sprite._torch_add)
        # {
        # }

    update_Track: ->
        if @track
            if @trackSprite.Rectangle.x != @lastTrackX
                @trackSprite.game.Viewport.x -= (@trackSprite.Rectangle.x - @lastTrackX)
                @lastTrackX = @trackSprite.Rectangle.x

# expose to Torch
Torch.Camera = Camera
