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
        width = @sprite.game.Assets.Textures[textureId].width * Torch.Scale
        height = @sprite.game.Assets.Textures[textureId].height * Torch.Scale

        @sprite.gl_shape = new THREE.PlaneGeometry( width, height, 8, 8 )

        map = @sprite.game.Assets.Textures[textureId].gl_texture

        material = new THREE.MeshPhongMaterial({map: map})
        material.transparent = true

        object = new THREE.Mesh(@sprite.gl_shape , material )

        object.position.z = @sprite.Rectangle.z # -10
        object.position.x = @sprite.Rectangle.x
        object.position.y = @sprite.Rectangle.y
        object.name = @sprite._torch_uid

        @sprite.game.gl_scene.add(object)

        @sprite.gl_orig_width = width
        @sprite.gl_orig_height = height
        @sprite.gl_scene_object = object
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

class WebGLBind
    constructor: (@sprite) ->

    Texture: (textureId) ->
        textureAsset = null
        if textureId.gl_2d_canvas_generated_image
            # same as in Load, should consolidate the two
            texture = new THREE.TextureLoader().load(this.src)
            texture.magFilter = THREE.NearestFilter
            texture.minFilter = THREE.LinearMipMapLinearFilter

            textureAsset =
                width: textureId.image.width
                height: textureId.image.height
                gl_texture: texture
        else
            textureAsset = @sprite.game.Assets.Textures[textureId]

        width = textureAsset.width * Torch.Scale
        height = textureAsset.height * Torch.Scale
        map = textureAsset.gl_texture

        shape = new THREE.PlaneGeometry(width, height, 8, 8)
        material = new THREE.MeshPhongMaterial({map: map, transparent: true})

        @sprite.gl_three_sprite = new Torch.ThreeSprite(@sprite, material, shape)

        @sprite.gl_orig_width = width
        @sprite.gl_orig_height = height
        @sprite.Rectangle.width = width
        @sprite.Rectangle.height = height

#expose to Torch
Torch.Bind = Bind
