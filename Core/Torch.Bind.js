Torch.Bind = function(sprite)
{
    this.sprite = sprite;
}
Torch.Bind.prototype.Reset = function()
{
    var that = this;
    var sprite = that.sprite;

    if (sprite.TextureSheetAnimation)
    {
        that.sprite.TextureSheetAnimation.Stop();
        that.sprite.anim = null;
        that.sprite.TextureSheet = null;
    }
    if (sprite.TexturePackAnimation)
    {
        that.sprite.TexturePackAnimation.Stop();
        that.sprite.anim = null;
        that.sprite.TexturePack = null;
    }

}
Torch.Bind.prototype.Texture = function(textureId, optionalParameters)
{
    var that = this;
    var tex;
    if (typeof(textureId) == "string")
    {
        tex = that.sprite.game.Assets.Textures[textureId];
        if (!tex)
        {
            that.sprite.game.FatalError(new Error("Sprite.Bind.Texture given textureId '{0}' was not found".format(textureId)));
        }
    }
    else
    {
        tex = textureId;
    }
    var scale = 1;

    that.Reset();

    if (Torch.Scale && !that.sprite.TEXT)
    {
        scale = Torch.Scale;
    }
    that.sprite.DrawTexture = typeof(textureId) == "string" ? tex : {image:textureId};

    that.sprite.Rectangle.width = tex.width * scale;
    that.sprite.Rectangle.height = tex.height * scale;
};
Torch.Bind.prototype.TexturePack = function(texturePackId, optionalParameters)
{
    var that = this;

    if (!optionalParameters) optionalParameters = {};

    var texturePack = that.sprite.game.Assets.TexturePacks[texturePackId];
    if (!texturePack)
    {
        that.sprite.game.FatalError(new Error("Sprite.Bind.TexturePack given texturePackId '{0}' was not found".format(texturePackId)));
    }
    else
    {
        that.sprite.TexturePack = texturePack;
    }
    var anim = new Torch.Animation.TexturePack(that.sprite.TexturePack, that.sprite.game);

    if (optionalParameters.step) anim.step = optionalParameters.step;

    anim.Start();
    that.sprite.TexturePackAnimation = anim;
    that.sprite.Rectangle.width = anim.GetCurrentFrame().width;
    that.sprite.Rectangle.height = anim.GetCurrentFrame().height;
};
Torch.Bind.prototype.TextureSheet = function(textureSheetId, optionalParameters)
{
    var that = this;
    if (!optionalParameters) optionalParameters = {};
    var textureSheet = that.sprite.game.Assets.TextureSheets[textureSheetId];
    var drawTexture = that.sprite.game.Assets.Textures[textureSheetId];

    if (!textureSheet || !drawTexture)
    {
        that.sprite.game.FatalError(new Error("Sprite.Bind.TextureSheet given textureSheetId '{0}' was not found".format(textureSheetId)));
    }
    else
    {
        that.sprite.DrawTexture = drawTexture;
        that.sprite.TextureSheet = textureSheet;
    }

    var anim = new Torch.Animation.TextureSheet(that.sprite.TextureSheet, that.sprite.game);
    anim.sprite = that.sprite;
    if (optionalParameters.delay)
    {
        anim.delay = optionalParameters.delay;
        anim.delayCount = anim.delay;
    }
    if (optionalParameters.step) anim.step = optionalParameters.step;

    anim.Start();
    that.sprite.TextureSheetAnimation = anim;

    that.sprite.Rectangle.width = anim.GetCurrentFrame().clipWidth * Torch.Scale;
    that.sprite.Rectangle.height = anim.GetCurrentFrame().clipHeight * Torch.Scale;
}
