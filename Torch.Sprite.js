(function()
{
    var Bind = new Class(function(sprite)
    {
        ;"Bind";
        this.sprite = sprite;
    });
    Bind.Prop("Texture", function(textureId, optionalParameters)
    {
        var that = this;
        var tex = that.sprite.game.Assets.Textures[textureId];
        that.sprite.DrawTexture = tex;
        that.sprite.Rectangle.width = tex.width;
        that.sprite.Rectangle.height = tex.height;
    });
    Bind.Prop("TexturePack", function(texturePackId, optionalParameters)
    {
        var that = this;

        if (!optionalParameters) optionalParameters = {};

        that.sprite.TexturePack = that.sprite.game.Assets.TexturePacks[texturePackId];
        var anim = new Torch.Animation.TexturePack(that.sprite.TexturePack, that.sprite.game);

        if (optionalParameters.step) anim.step = optionalParameters.step;

        anim.Start();
        that.sprite.TexturePackAnimation = anim;
        that.sprite.Rectangle.width = anim.GetCurrentFrame().width;
        that.sprite.Rectangle.height = anim.GetCurrentFrame().height;
    });
    Bind.Prop("TextureSheet", function(textureSheetId, optionalParameters)
    {
        var that = this;

        if (!optionalParameters) optionalParameters = {};

        that.sprite.TextureSheet = that.sprite.game.Assets.TextureSheets[textureSheetId];
        that.sprite.DrawTexture = that.sprite.game.Assets.Textures[textureSheetId];

        var anim = new Torch.Animation.TextureSheet(that.sprite.TextureSheet, that.sprite.game);

        if (optionalParameters.step) anim.step = optionalParameters.step;

        anim.Start();
        that.sprite.TextureSheetAnimation = anim;

        that.sprite.Rectangle.width = anim.GetCurrentFrame().clipWidth;
        that.sprite.Rectangle.height = anim.GetCurrentFrame().clipHeight;
    });

    var Sprite = new Class(function(x, y)
    {
        ;"Sprite";
        this.Bind = new Bind(this);
        this.Rectangle = new Torch.Rectangle(x, y, 0, 0);
        this.game = null;
        this.DrawTexture = null;
        this.TexturePack = null;
        this.TextureSheet = null;
        this.onClick = null;
        this.onMouseOver = null;
        this.onMouseLeave = null;
        this.mouseOver = false;
        this.DrawParams = {};
        this.additionalUpdates = [];
        this.drawIndex = 0;
        this._torch_add = "Sprite";
    });
    Sprite.Prop("Update", function()
    {
        var that = this;
        if (this.game.Mouse.GetRectangle(this.game).Intersects(that.Rectangle) && !that.mouseOver)
        {
            that.mouseOver = true;
            if (that.onMouseOver) that.onMouseOver(that);
        }
        else
        {
            that.mouseOver = false;
        }

        that.additionalUpdates.forEach(function(update)
        {
            update(that);
        });
    });
    Sprite.Prop("Draw", function()
    {
        var that = this;
        if (that.TexturePack)
        {
            that.game.Draw(that.TexturePackAnimation.GetCurrentFrame(), that.Rectangle, that.DrawParams);
        }
        else if (that.TextureSheet)
        {
            that.game.Draw(that.DrawTexture, that.Rectangle, that.TextureSheetAnimation.GetCurrentFrame());
        }
        else
        {
            that.game.Draw(that.DrawTexture, that.Rectangle, that.DrawParams);
        }

    });

    Sprite.Prop("Click", function(eventFunction)
    {
        var that = this;
        that.onClick = eventFunction;
    });

    Sprite.Prop("MouseOver", function(eventFunction)
    {
        var that = this;
        that.onMouseOver = eventFunction;
    });

    Sprite.Prop("MouseLeave", function(eventFunction)
    {
        var that = this;
        that.onMouseLeave = eventFunction;
    })

    Torch.Sprite = Sprite;

})();
