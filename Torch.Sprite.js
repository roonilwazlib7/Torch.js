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
    that.sprite.Rectangle.width = tex.width;
    that.sprite.Rectangle.height = tex.height;
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
/*
        Torch.Sprite
*/
Torch.Sprite = function(x,y)
{
    this.InitSprite(x,y)
};
Torch.Sprite.prototype.InitSprite = function(x,y)
{
    this.Bind = new Torch.Bind(this);
    this.Rectangle = new Torch.Rectangle(x, y, 0, 0);
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
    this.additionalUpdates = [];
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
Torch.Sprite.prototype.Fixed = function()
{
    this.fixed = true;
}
Torch.Sprite.prototype.UnFixed = function()
{
    this.fixed = false;
}
Torch.Sprite.prototype.BaseUpdate = function()
{
    var that = this;
    if (that.TextureSheetAnimation && that.TextureSheetAnimation.hasRun && that.TextureSheetAnimation.Kill)
    {
        that.game.Remove(this);
    }
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

    that.additionalUpdates.forEach(function(update)
    {
        update(that);
    });

    if (that.moveToPoint)
    {
        that.elapsedMoveToTime += that.game.deltaTime;

        var v = new Torch.Vector(that.moveToPoint.x - that.Rectangle.x, that.moveToPoint.y - that.Rectangle.y);
        v.Normalize();
        var moveToSpeed = that.defaultEasing * that.moveToSpeed;
        switch(that.moveToTween)
        {
            case Torch.Tween.Linear:
                that.Rectangle.x += v.x * moveToSpeed * that.game.deltaTime;
                that.Rectangle.y += v.y * moveToSpeed * that.game.deltaTime;
            break;

            case Torch.Tween.Quadratic:
                that.Rectangle.x += v.x * (that.elapsedMoveToTime * that.elapsedMoveToTime) * moveToSpeed * that.game.deltaTime;
                that.Rectangle.y += v.y * (that.elapsedMoveToTime * that.elapsedMoveToTime) * moveToSpeed * that.game.deltaTime;
            break;

            case Torch.Tween.Cubic:
                that.Rectangle.x += v.x * (that.elapsedMoveToTime * that.elapsedMoveToTime * that.elapsedMoveToTime) * moveToSpeed * that.game.deltaTime;
                that.Rectangle.y += v.y * (that.elapsedMoveToTime * that.elapsedMoveToTime * that.elapsedMoveToTime) * moveToSpeed * that.game.deltaTime;
            break;

            case Torch.Tween.Inverse:
                that.Rectangle.x += v.x * (1 / that.elapsedMoveToTime) * moveToSpeed * that.game.deltaTime;
                that.Rectangle.y += v.y * (1 / that.elapsedMoveToTime) * moveToSpeed * that.game.deltaTime;
            break;

            case Torch.Tween.InverseSquare:
                that.Rectangle.x += v.x * (1 / Math.pow(that.elapsedMoveToTime, 2) ) * moveToSpeed * that.game.deltaTime;
                that.Rectangle.y += v.y * (1 / Math.pow(that.elapsedMoveToTime, 2) )* moveToSpeed * that.game.deltaTime;
            break;

            case Torch.Tween.SquareRoot:
                that.Rectangle.x += v.x * Math.sqrt(that.elapsedMoveToTime) * moveToSpeed * that.game.deltaTime;
                that.Rectangle.y += v.y * Math.sqrt(that.elapsedMoveToTime) * moveToSpeed * that.game.deltaTime;
            break;
        }

        var distVec = new Torch.Vector(that.Rectangle.x, that.Rectangle.y);
        if (distVec.GetDistance(that.moveToPoint) <= 10)
        {
            that.Rectangle.x = that.moveToPoint.x;
            that.Rectangle.y = that.moveToPoint.y;
            that.moveToPoint = null;
            that.elapsedMoveToTime = 0;
            if (that.onMoveFinish) that.onMoveFinish(that);
        }
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
//Events
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
Torch.Sprite.prototype.Move = function(movePoint, speed, moveFinish, tween)
{
    var that = this;
    that.moveToPoint = movePoint;
    that.moveToSpeed = speed;
    that.onMoveFinish = moveFinish;

    if (!tween)
    {
        that.moveToTween = Torch.Tween.Linear;
    }
    else
    {
        that.moveToTween = tween;
        switch (tween)
        {
            case "Torch-Tween-Linear":
                that.defaultEasing = 0.1;
            break;

            case "Torch-Tween-Quadratic":
                that.defaultEasing = 0.000001;
            break;

            case "Torch-Tween-Cubic":
                that.defaultEasing = 0.00000001;
            break;

            case "Torch-Tween-Inverse":
                that.defaultEasing = 50;
            break;

            case "Torch-Tween-SquareRoot":
                that.defaultEasing = 0.01;
            break;

            case "Torch-Tween-InverseSquare":
                that.defaultEasing = 1500;
            break;

            default:
                that.defaultEasing = 0.1;
            break
        }
    }
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
Torch.Sprite.prototype.AddUpdate = function(updateFunction)
{
    var that = this;
    that.additionalUpdates.push(updateFunction);
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
Torch.Sprite.prototype.TieLocation = function(otherSprite, adjustments)
{
    var that = this;
    var adjust = {};
    adjust.x = adjustments.x ? adjustments.x : 0;
    adjust.y = adjustments.y ? adjustments.y : 0;
    that.AddUpdate(function(sprite)
    {
        sprite.Rectangle.x = otherSprite.Rectangle.x + adjust.x;
        sprite.Rectangle.y = otherSprite.Rectangle.y + adjust.y;
    });
}

Torch.Canvas = function(textLayers, x, y, maxFontSize)
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

Torch.Canvas.prototype.ApplyLayer = function(layer, cnv)
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

Torch.Canvas.prototype.GetBitmap = function()
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
