/*
        Torch.Bind
*/
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

/*
        Torch.Sprite
*/
Torch.Sprite = function(game,x,y)
{
    this.InitSprite(game,x,y)
};
Torch.Sprite.prototype.InitSprite = function(game,x,y)
{
    if (x == null || x == undefined) Torch.Error("argument 'x' is required");
    if (y == null || y == undefined) Torch.Error("argument 'y' is required");
    this.Bind = new Torch.Bind(this);
    this.Rectangle = new Torch.Rectangle(x, y, 0, 0);
    this.Body = {
        x: {
            velocity: 0,
            acceleration: 0,
            lv: 0,
            la: 0,
            aTime: 0,
            maxVelocity: 100
        },
        y: {
            velocity: 0,
            acceleration: 0,
            lv: 0,
            la: 0,
            aTime: 0,
            maxVelocity: 100
        }
    }
    this.HitBox = {x: 0, y: 0, width: 0, height: 0};
    this.game = game;
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
    this.draw = true;
    this.wasClicked = false;
    this.trash = false;
    this.drawIndex = 0;
    this._torch_add = "Sprite";
    this._torch_uid = "";
    this.fixed = false;
    this.rotation = 0;
    this.opacity = 1;
    game.Add(this);
}
Torch.Sprite.prototype.UpdateBody = function()
{
    var that = this;
    var velX = that.Body.x.velocity;
    var velY = that.Body.y.velocity;
    var deltaTime = that.game.deltaTime;
    if (that.Body.x.acceleration != that.Body.x.la)
    {
        that.Body.x.la = that.Body.x.acceleration;
        that.Body.x.aTime = 0;
    }
    if (that.Body.x.acceleration != 0)
    {
        that.Body.x.aTime += deltaTime;
        velX += that.Body.x.aTime * that.Body.x.acceleration;
    }
    if (that.Body.y.acceleration != that.Body.y.la)
    {
        that.Body.y.la = that.Body.y.acceleration;
        that.Body.y.aTime = 0;
    }
    if (that.Body.y.acceleration != 0)
    {
        that.Body.y.aTime += deltaTime;
        velY += that.Body.y.aTime * that.Body.y.acceleration;
    }
    if (Math.abs(velX) < Math.abs(that.Body.x.maxVelocity))
    {
        that.Rectangle.x += velX * deltaTime;
    }
    else
    {
        var dir = velX < 0 ? -1 : 1;
        that.Rectangle.x += dir * that.Body.x.maxVelocity * deltaTime;
    }
    that.Rectangle.y += velY * deltaTime;
};
Torch.Sprite.prototype.ToggleFixed = function(tog)
{
    var that = this;
    if (tog === undefined)
    {
        if (that.fixed) that.fixed = false;
        else that.fixed = true;
    }
    else
    {
        that.fixed = tog;
    }
}
Torch.Sprite.prototype.BaseUpdate = function()
{
    var that = this;
    that.UpdateBody();
    that.UpdateEvents();
    var shiftX = that.Rectangle.width / 8;
    var shiftY = that.Rectangle.height / 8;
    that.HitBox = {
        x: that.Rectangle.x + shiftX,
        y: that.Rectangle.y + shiftY,
        width: that.Rectangle.width - (2 * shiftX),
        height: that.Rectangle.height - (2 * shiftY)
    };
}
Torch.Sprite.prototype.Update = function()
{
    var that = this
    that.BaseUpdate();
}
Torch.Sprite.prototype.GetCurrentDraw = function()
{
    var that = this;
    if (that.TexturePack)
    {
        return that.TexturePackAnimation.GetCurrentFrame();
    }
    else if (that.TextureSheet)
    {
        return that.TextureSheetAnimation.GetCurrentFrame();
    }
    else if (that.DrawTexture)
    {
        return that.DrawTexture;
    }
}
Torch.Sprite.prototype.Draw = function()
{
    var that = this;
    var DrawRec = new Torch.Rectangle(that.Rectangle.x, that.Rectangle.y, that.Rectangle.width, that.Rectangle.height);
    if (that.fixed)
    {
        DrawRec.x -= that.game.Viewport.x;
        DrawRec.y -= that.game.Viewport.y;
    }
    if (that.TexturePack)
    {
        that.game.Draw(that.GetCurrentDraw(), DrawRec, that.DrawParams);
    }
    else if (that.TextureSheet)
    {
        var Params = that.DrawParams ? Object.create(that.DrawParams) : {};
        var frame = that.GetCurrentDraw();
        Params.clipX = frame.clipX;
        Params.clipY = frame.clipY;
        Params.clipWidth = frame.clipWidth;
        Params.clipHeight = frame.clipHeight;
        Params.IsTextureSheet = true;
        Params.rotation = that.rotation;
        Params.alpha = that.opacity;
        that.game.Draw(that.DrawTexture, DrawRec, Params);
    }
    else if (that.DrawTexture)
    {
        var DrawParams = {
            alpha: that.opacity,
            rotation: that.rotation
        };
        that.game.Draw(that.GetCurrentDraw(), DrawRec, DrawParams);
    }
}
Torch.Sprite.prototype.UpdateEvents = function()
{
    var that = this;
    if (!this.game.Mouse.GetRectangle(this.game).Intersects(that.Rectangle) && that.mouseOver)
    {
        that.mouseOver = false;
        if (that.onMouseLeave)that.onMouseLeave(that);
    }
    if (this.game.Mouse.GetRectangle(this.game).Intersects(that.Rectangle))
    {
        if (that.onMouseOver && !that.mouseOver) that.onMouseOver(that);
        that.mouseOver = true;
    }
    else if (that.fixed)
    {
        var mouseRec = that.game.Mouse.GetRectangle(that.game);
        var reComputedMouseRec = new Torch.Rectangle(mouseRec.x, mouseRec.y, mouseRec.width, mouseRec.height);
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
};
Torch.Sprite.prototype.GetDirectionVector = function(otherSprite)
{
    var that = this;
    var vec = new Torch.Vector( (otherSprite.Rectangle.x - that.Rectangle.x), (otherSprite.Rectangle.y - that.Rectangle.y) );
    vec.Normalize();
    return vec;
};
Torch.Sprite.prototype.GetDistance = function(otherSprite)
{
    var that = this;
    var thisVec = new Torch.Vector(that.Rectangle.x, that.Rectangle.y);
    var otherVec = new Torch.Vector(otherSprite.Rectangle.x, otherSprite.Rectangle.y);
    return thisVec.GetDistance(otherVec);
}
Torch.Sprite.prototype.Center = function()
{
    var that = this;
    var width = that.game.canvasNode.width;
    var x = (width / 2) - (that.Rectangle.width/2);
    that.Rectangle.x = x;
}
Torch.Sprite.prototype.CenterVertical = function()
{
    var that = this;
    var height = that.game.canvasNode.height;
    var y = (height / 2) - (that.Rectangle.height/2);
    that.Rectangle.y = y;
}
Torch.Sprite.prototype.ToErrorString = function()
{
    var that = this;
    var str = "";
    var br = "<br/>";
    var obj = {_torch_uid: that._torch_uid, Rectangle: that.Rectangle};
    str += JSON.stringify(obj, null, 4);
    return str + "<br/>";
}

Torch.GhostSprite = function(){};
Torch.GhostSprite.is(Torch.Sprite);
Torch.GhostSprite.prototype.GHOST_SPRITE = true;
