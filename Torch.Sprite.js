/*
        Torch.Bind
*/
Torch.Bind = function(sprite)
{
    this.sprite = sprite;
}
Torch.Bind.prototype.Texture = function(textureId, optionalParameters)
{
    var that = this;
    var tex = that.sprite.game.Assets.Textures[textureId];

    if (that.sprite.TextureSheetAnimation)
    {
        that.sprite.TextureSheetAnimation.Stop();
        that.sprite.DrawParams = {};
        //that.sprite.TextureSheetAnimation.Kill = true;
        that.sprite.anim = null;
        that.sprite.TextureSheet = null;
    }

    that.sprite.DrawTexture = tex;
    var scale = 1;
    if (Torch.Scale) scale = Torch.Scale;
    that.sprite.Rectangle.width = tex.width * scale;
    that.sprite.Rectangle.height = tex.height * scale;
};
Torch.Bind.prototype.TexturePack = function(texturePackId, optionalParameters)
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
};
Torch.Bind.prototype.TextureSheet = function(textureSheetId, optionalParameters)
{
    var that = this;
    if (!optionalParameters) optionalParameters = {};
    that.sprite.TextureSheet = that.sprite.game.Assets.TextureSheets[textureSheetId];
    that.sprite.DrawTexture = that.sprite.game.Assets.Textures[textureSheetId];

    var anim = new Torch.Animation.TextureSheet(that.sprite.TextureSheet, that.sprite.game);
    anim.sprite = that.sprite;

    if (optionalParameters.step) anim.step = optionalParameters.step;

    anim.Start();
    that.sprite.TextureSheetAnimation = anim;

    that.sprite.Rectangle.width = anim.GetCurrentFrame().clipWidth;
    that.sprite.Rectangle.height = anim.GetCurrentFrame().clipHeight;
}
Torch.Bind.prototype.PixlTexture = function(pixlData, colorPallette)
{
    var that = this;

    if (that.sprite.TextureSheetAnimation)
    {
        that.sprite.TextureSheetAnimation.Stop();
        that.sprite.DrawParams = {};
        that.sprite.anim = null;
        that.sprite.TextureSheet = null;
    }

    var tex = pixl(pixlData, colorPallette);
    var im = new Image();
    im.src = tex.src;
    im.onload = function()
    {
        var scale = 1;
        if (Torch.Scale) scale = Torch.Scale;
        that.sprite.Rectangle.width = im.width * scale;
        that.sprite.Rectangle.height = im.height * scale;
        that.sprite.DrawTexture = tex;
    }


}
/*
        Torch.Sprite
*/
Torch.Sprite = function(x,y)
{
    this.InitSprite(x,y)
};
Torch.Sprite.prototype.InitSprite = function(x,y)
{
    if (x == null || x == undefined) Torch.Error("argument 'x' is required");
    if (y == null || y == undefined) Torch.Error("argument 'y' is required");
    this.Bind = new Torch.Bind(this);
    this.Rectangle = new Torch.Rectangle(x, y, 0, 0);
    this.BoundingBox = new Torch.Rectangle(x, y, 0, 0);
    this.Body = {
        x: {
            velocity: 0,
            acceleration: 0,
            lv: 0,
            la: 0,
            aTime: 0
        },
        y: {
            velocity: 0,
            acceleration: 0,
            lv: 0,
            la: 0,
            aTime: 0
        }
    }
    this.game = null;
    this.DrawTexture = null;
    this.TexturePack = null;
    this.TextureSheet = null;
    this.onClick = null;
    this.onClickAway = null;
    this.onMouseOver = null;
    this.onMouseLeave = null;
    this.onMoveFinish = null;
    this.mouseOver = false;
    this.clickTrigger = false;
    this.clickAwayTrigger = false;
    this.trash = false;
    this.DrawParams = {};
    this.drawIndex = 0;
    this._torch_add = "Sprite";
    this._torch_uid = "";
    this.moveToPoint = null;
    this.moveToSpeed = null;
    this.moveToTween = null;
    this.elapsedMoveToTime = null;
    this.defaultEasing = null;
    this.debugged = false;
    this.fixed = false;
    this.draw = true;
    this.wasClicked = false;
}
Torch.Sprite.prototype.GetBoundingBox = function()
{
    var that = this;
    var bound = 1;
    var boundingBox = new Torch.Rectangle(that.Rectangle.x + bound, that.Rectangle.y + bound, that.Rectangle.width - bound,that.Rectangle.height - bound);
    return boundingBox;
};
Torch.Sprite.prototype.UpdateBody = function()
{
    var that = this;
    var velX = that.Body.x.velocity;
    var velY = that.Body.y.velocity;
    if (that.Body.x.acceleration != that.Body.x.la)
    {
        that.Body.x.la = that.Body.x.acceleration;
        that.Body.x.aTime = 0;
    }
    if (that.Body.x.acceleration != 0)
    {
        that.Body.x.aTime += that.game.deltaTime;
        velX += that.Body.x.aTime * that.Body.x.acceleration;
    }
    if (that.Body.y.acceleration != that.Body.y.la)
    {
        that.Body.y.la = that.Body.y.acceleration;
        that.Body.y.aTime = 0;
    }
    if (that.Body.y.acceleration != 0)
    {
        that.Body.y.aTime += that.game.deltaTime;
        velY += that.Body.y.aTime * that.Body.y.acceleration;
    }
    that.Rectangle.x += velX * that.game.deltaTime;
    that.Rectangle.y += velY * that.game.deltaTime;
};

Torch.Sprite.prototype.ToggleFixed = function()
{
    var that = this;
    if (that.fixed) that.fixed = false;
    else that.fixed = true;
}
Torch.Sprite.prototype.BaseUpdate = function()
{
    var that = this;
    that.UpdateBody();
    that.BoundingBox = that.GetBoundingBox();
    if (this.game.Mouse.GetRectangle(this.game).Intersects(that.Rectangle))
    {
        if (that.onMouseOver && !that.mouseOver) that.onMouseOver(that);
        that.mouseOver = true;
    }
    else if (that.fixed)
    {
        var reComputedMouseRec = Object.Clone( that.game.Mouse.GetRectangle(that.game) );
        reComputedMouseRec.x += that.game.Viewport.x;
        reComputedMouseRec.y += that.game.Viewport.y;
        if (reComputedMouseRec.Intersects(that.Rectangle))
        {
            that.mouseOver = true;
        }
        else
        {
            that.mouseOver = false;
        }
    }
    else
    {
        that.mouseOver = false;
    }

    if (that.mouseOver && that.game.Mouse.down && ! that.clickTrigger)
    {
        that.clickTrigger = true;
    }

    if (that.clickTrigger && !that.game.Mouse.down && that.mouseOver)
    {
        that.wasClicked = true;
        if (that.onClick)
        {
            that.onClick(that);

        }
        that.clickTrigger = false;
    }
    if (that.clickTrigger && !that.game.Mouse.down && !that.mouseOver)
    {
        that.clickTrigger = false;
    }

    if (!that.game.Mouse.down && !that.mouseOver && that.clickAwayTrigger)
    {
        if (that.onClickAway)
        {
            that.onClickAway();
            that.wasClicked = false;
            that.clickAwayTrigger = false;
        }
    }
    else if (that.clickTrigger && !that.game.Mouse.down && that.mouseOver)
    {
        that.clickAwayTrigger = false;
    }
    else if (that.game.Mouse.down && !that.mouseOver)
    {
        that.clickAwayTrigger = true;
    }
}
Torch.Sprite.prototype.Update = function()
{
    var that = this
    that.BaseUpdate();
}
Torch.Sprite.prototype.Draw = function()
{
    var that = this;
    var DrawRec = new Torch.Rectangle(that.Rectangle.x, that.Rectangle.y, that.Rectangle.width, that.Rectangle.height);//{x: that.Rectangle.x, y: that.Rectangle.y, width: that.Rectangle.width, height: that.Rectangle.height}//Object.Clone(that.Rectangle);
    if (that.fixed)
    {
        DrawRec.x -= that.game.Viewport.x;
        DrawRec.y -= that.game.Viewport.y;
    }
    if (that.TexturePack)
    {
        that.game.Draw(that.TexturePackAnimation.GetCurrentFrame(), DrawRec, that.DrawParams);
    }
    else if (that.TextureSheet)
    {
        that.game.Draw(that.DrawTexture, DrawRec, that.TextureSheetAnimation.GetCurrentFrame());
    }
    else
    {
        that.game.Draw(that.DrawTexture, DrawRec, that.DrawParams);
    }
}
Torch.Sprite.prototype.Click = function(eventFunction)
{
    var that = this;
    that.onClick = eventFunction;
};
Torch.Sprite.prototype.ClickAway = function(eventFunction)
{
    var that = this;
    that.onClickAway = eventFunction;
}
Torch.Sprite.prototype.MouseOver = function(eventFunction)
{
    var that = this;
    that.onMouseOver = eventFunction;
}
Torch.Sprite.prototype.MouseLeave = function(eventFunction)
{
    var that = this;
    that.onMouseLeave = eventFunction;
}
Torch.Sprite.prototype.OnceEffect = function()
{
    var that = this;
    that.TextureSheetAnimation.Kill = true;
}
Torch.Sprite.prototype.Once = function()
{
    var that = this;
    that.once = true;
}
Torch.Sprite.prototype.Hide = function()
{
    this.draw = false;
}
Torch.Sprite.prototype.Show = function()
{
    this.draw = true;
}
Torch.Sprite.prototype.Trash = function()
{
    this.trash = true;
}
Torch.Sprite.prototype.NotSelf = function(otherSprite)
{
    var that = this;
    return (otherSprite._torch_uid != that._torch_uid);
}
/*
        Torch.Text
*/

Torch.Text = function(textLayers, x, y, maxFontSize)
{
    var that = this;
    that._torch_add = "Sprite";
    that.maxFontSize = maxFontSize;
    that.textLayers = textLayers;
    that.InitSprite(x,y);
    that.DrawTexture = that.GetBitmap();
    that.Rectangle.width = that.DrawTexture.image.width;
    that.Rectangle.height = that.DrawTexture.image.height;
    that.drawIndex = 100;
};

Torch.Text.is(Torch.Sprite);

Torch.Text.prototype.ApplyLayer = function(layer, cnv)
{
    var that = this;
    if (layer.font) cnv.font = layer.font;
    if (layer.fillStyle) {
        cnv.fillStyle = layer.fillStyle;
        cnv.fillText(layer.text, 10, that.maxFontSize / 1.3);
    }
    if (layer.strokeStyle) {
        cnv.strokeStyle = layer.strokeStyle;
        cnv.strokeText(layer.text, 10, 10);
    }
}

Torch.Text.prototype.GetBitmap = function()
{
    var that = this;
    var cv = document.createElement("canvas");

    cv.width = that.textLayers[0].text.length * that.maxFontSize * 0.8;
    cv.height = that.maxFontSize;
    cnv = cv.getContext("2d");

    for (var i = 0; i < that.textLayers.length; i++)
    {
        if (that.textLayers[i].background)
        {
            cnv.fillStyle = that.textLayers[i].background;
            cnv.fillRect(0,0,cv.width,cv.height)
        }
        that.ApplyLayer(that.textLayers[i], cnv);
    }


    var image = new Image();
    image.src = cv.toDataURL();
    return {image: image};
}
