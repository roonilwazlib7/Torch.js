var Player = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("player_right");
    this.walkingRight = false;
    this.walkingLeft = false;
    this.Item = null;
    this.HandOffset = {
        x: 52,
        y: 33
    };
    this.drawIndex = 5;
    this.opacity = 0;
    this.ready = false;
    this.Hand = new Torch.Sprite(game, this.Rectangle.x + this.HandOffset.x, this.Rectangle.y + this.HandOffset.y);
    this.Hand.Bind.Texture("hand");
    this.Hand.drawIndex = 5;
    this.StrikeOffset = {x: 5, y: 7}
}
Player.is(Torch.Sprite).is(Torch.Platformer.Actor);

Player.prototype.Update = function()
{
    var that = this;
    var keys = that.game.Keys;
    if (!that.ready)
    {
        that.Enter();
    }
    else
    {
        that.UpdateActor();
        that.HandleItemOffset();
        that.Move();
    }


    that.BaseUpdate();
}
Player.prototype.Move = function()
{
    var that = this;
    //movement
    var velocity = 0.3;
    var keys = that.game.Keys;
    if (keys.D.down)
    {
        that.Body.x.velocity = velocity;
        if (!that.walkingRight)
        {
            that.Bind.TextureSheet("player_walk_right", {step: 200});
            that.walkingRight = true;
        }
    }
    else if (keys.A.down)
    {
        that.Body.x.velocity = -velocity;
        if (!that.walkingLeft)
        {
            that.Bind.TextureSheet("player_walk_left", {step: 200});
            that.walkingLeft = true;
        }
    }
    else
    {
        that.Body.x.velocity = 0;
        if (that.walkingRight)
        {
            that.Bind.Texture("player_right");
        }
        else if (that.walkingLeft)
        {
            that.Bind.Texture("player_left");
        }
        that.walkingRight = false;
        that.walkingLeft = false;
    }
    if (keys.W.down && that.onGround) that.Body.y.velocity = -0.4;
    if (keys.R.down) that.rotation += 0.01;
}
Player.prototype.SwitchItem = function(item)
{
    var that = this;
    if (that.Item) that.Item.Trash();
    that.Item = new item(that.game, that.Rectangle.x, that.Rectangle.y, that);
}
Player.prototype.HandleItemOffset = function()
{
    var that = this;
    var offSetSoFar = that.HandOffset;
    var extraX = 0;
    var extraY = 0
    that.HandOffset = offSetSoFar;
    if (!that.game.Keys.E.down && that.EWasDown)
    {
        var anim = new Torch.Animation.StepAnimation(that.game, 500, [function(){that.HandOffset.x += 2},function(){that.HandOffset.x += 2},function(){that.HandOffset.x += 2}]);
        that.EWasDown = false;
    }
    if (that.game.Keys.E.down)
    {
        that.EWasDown = true;
    }
    else
    {
        that.EWasDown = false;
    }

    if (that.walkingRight)
    {
        if (that.TextureSheetAnimation.textureIndex == 0)
        {
            extraY += -3;
        }
        else
        {
            extraY += 3;
        }
    }
    that.Hand.Rectangle.x = this.Rectangle.x + this.HandOffset.x + extraX;
    that.Hand.Rectangle.y = this.Rectangle.y + this.HandOffset.y + extraY;
}
Player.prototype.Enter = function()
{
    var that = this;
    that.opacity += 0.0007 * that.game.deltaTime;
    if (that.opacity >= 1)
    {
        that.opacity = 1;
        that.ready = true;
        player.SwitchItem(ShortSword);
    }
}





//items
var ShortSword = function(game,x,y,player)
{
    this.InitSprite(game,x,y)
    this.Bind.Texture("short-sword");
    this.player = player;
    this.drawIndex = player.drawIndex - 1;
    this.rightTexture = "short-sword";
    this.leftTexture = "short-sword-left";
}
ShortSword.is(Torch.Sprite);
ShortSword.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.Rectangle.x = that.player.Hand.Rectangle.x;
    that.Rectangle.y = that.player.Hand.Rectangle.y - (that.Rectangle.width / 2) - 5;
}
ShortSword.prototype.Right = function()
{
    var that = this;
    that.Bind.Texture(that.rightTexture);
}
ShortSword.prototype.Left = function()
{
    var that = this;
    that.Bind.Texture(that.leftTexture);
}
