class Bind
    constructor: (sprite) ->
        return new WebGLBind(sprite) if sprite.GL
        return new CanvasBind(sprite)



class CanvasBind
    constructor: (@sprite) ->

    Reset: ->
        if @sprite.TextureSheetAnimation
            @sprite.TextureSheetAnimation.Stop()
            @sprite.anim = null
            @sprite.TextureSheet = null

        if @sprite.TexturePackAnimation
            @sprite.TexturePackAnimation.Stop()
            @sprite.anim = null
            @sprite.TexturePack = null

    WebGLTexture: (textureId) ->
        texture = null
        map = null

        if textureId.gl_2d_canvas_generated_image
            texture = textureId
            map = textureId.texture
        else
            texture = @sprite.game.Assets.Textures[textureId]
            map = @sprite.game.Assets.Textures[textureId].gl_texture

        if not @sprite.Scale()
            width = texture.width * Torch.Scale
            height = texture.height * Torch.Scale
        else
            width = texture.width * @sprite.Scale()
            height = texture.height * @sprite.Scale()

        @sprite.gl_shape = new THREE.PlaneGeometry( width, height, 8, 8 )

        material = new THREE.MeshPhongMaterial({map: map})
        material.transparent = true

        @sprite.gl_three_sprite = new Torch.ThreeSprite(@sprite, material, @sprite.gl_shape)
        @sprite.gl_orig_width = width
        @sprite.gl_orig_height = height
        @sprite.Rectangle.width = width
        @sprite.Rectangle.height = height

    Texture: -> (textureId, optionalParameters) ->

        if @sprite.GL
            @WebGLTexture(textureId)
            return

        tex = null
        if typeof(textureId) is "string"
            tex = @sprite.game.Assets.Textures[textureId]
            if not tex
                @sprite.game.FatalError("Sprite.Bind.Texture given textureId '#{textureId}' was not found")
        else
            tex = textureId

        scale = 1

        @Reset()

        if Torch.Scale and not @sprite.TEXT
            scale = Torch.Scale

        if typeof(textureId) is "string"
            @sprite.DrawTexture = tex
        else
            @sprite.DrawTexture = {image:textureId}

        @sprite.Rectangle.width = tex.width * scale
        @sprite.Rectangle.height = tex.height * scale

        return @sprite.DrawTexture

    TexturePack: ->
        ###
        this whole thing needs to be re-written
        here is the old javascript:

            var that = this;

            if (!optionalParameters) optionalParameters = {};

            var texturePack = @sprite.game.Assets.TexturePacks[texturePackId];
            if (!texturePack)
            {
                @sprite.game.FatalError(new Error("Sprite.Bind.TexturePack given texturePackId '{0}' was not found".format(texturePackId)));
            }
            else
            {
                @sprite.TexturePack = texturePack;
            }
            var anim = new Torch.Animation.TexturePack(@sprite.TexturePack, @sprite.game);

            if (optionalParameters.step) anim.step = optionalParameters.step;

            anim.Start();
            @sprite.TexturePackAnimation = anim;
            @sprite.Rectangle.width = anim.GetCurrentFrame().width;
            @sprite.Rectangle.height = anim.GetCurrentFrame().height;
            return anim;

        ###

    TextureSheet: (textureSheetId, optionalParameters = {}) ->
        textureSheet = @sprite.game.Assets.TextureSheets[textureSheetId]
        drawTexture = @sprite.game.Assets.Textures[textureSheetId]

        if not textureSheet or not drawTexture
            @sprite.game.FatalError("Sprite.Bind.TextureSheet given textureSheetId '#{textureSheetId}' was not found")
        else
            @sprite.DrawTexture = drawTexture
            @sprite.TextureSheet = textureSheet

        anim = new Torch.Animation.TextureSheet(@sprite.TextureSheet, @sprite.game)
        anim.sprite = @sprite

        if optionalParameters.delay
            anim.delay = optionalParameters.delay
            anim.delayCount = anim.delay

        if optionalParameters.step
            anim.step = optionalParameters.step

        anim.Start()
        @sprite.TextureSheetAnimation = anim

        @sprite.Rectangle.width = anim.GetCurrentFrame().clipWidth * Torch.Scale
        @sprite.Rectangle.height = anim.GetCurrentFrame().clipHeight * Torch.Scale
        return anim

class WebGLBind extends CanvasBind
    constructor: (@sprite) ->

    Texture: (textureId) ->
        texture = null
        map = null

        if textureId.gl_2d_canvas_generated_image
            texture = textureId
            map = textureId.texture
        else
            texture = @sprite.game.Assets.Textures[textureId]
            map = @sprite.game.Assets.Textures[textureId].gl_texture

        if not @sprite.Scale()
            width = texture.width * Torch.Scale
            height = texture.height * Torch.Scale
        else
            width = texture.width * @sprite.Scale()
            height = texture.height * @sprite.Scale()

        @sprite.gl_shape = new THREE.PlaneGeometry( width, height, 8, 8 )

        material = new THREE.MeshPhongMaterial({map: map})
        material.transparent = true

        @sprite.gl_three_sprite = new Torch.ThreeSprite(@sprite, material, @sprite.gl_shape)
        @sprite.gl_orig_width = width
        @sprite.gl_orig_height = height
        @sprite.Rectangle.width = width
        @sprite.Rectangle.height = height

#expose to Torch
Torch.Bind = Bind
