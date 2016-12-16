class BindManager
    constructor: (@sprite) ->

    Texture: (textureId, optionalParameters) ->
        tex = null
        if typeof(textureId) is "string"
            tex = @sprite.game.Assets.Textures[textureId]
            if not tex
                @sprite.game.FatalError("Sprite.Bind.Texture given textureId '#{textureId}' was not found")
        else
            tex = textureId

        scale = 1

        # if Torch.Scale and not @sprite.TEXT
        #     @sprite.Size.Scale(Torch.Scale, Torch.Scale)

        if typeof(textureId) is "string"
            @sprite.DrawTexture = tex
        else
            @sprite.DrawTexture = {image:textureId}

        @sprite.Size.Set(tex.width, tex.height)
        @sprite.DrawTexture.drawParams =
            clipX: 0
            clipY: 0
            clipWidth: @sprite.DrawTexture.image.width
            clipHeight: @sprite.DrawTexture.image.height

        return @sprite.DrawTexture
