var Player = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("player_right");
    this.walkingRight = false;
    this.walkingLeft = false;
    this.Item = null;
    this.ItemOffset = {
        x: 50,
        y: 12
    };
    this.drawIndex = 5;
    this.opacity = 0;
    this.ready = false;
}
Player.is(Torch.Sprite).is(Torch.Platformer.Actor);

Player.prototype.Update = function()
{
    var that = this;

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
    var offSetSoFar = that.ItemOffset;
    var walking_right_offset = {x: 50, y:12};
    var walking_left_offset = {x: -23, y: 12};
    if (that.walkingRight)
    {
        offSetSoFar = walking_right_offset;
        that.Item.Right();
    }
    if (that.walkingLeft)
    {
        offSetSoFar = walking_left_offset;
        that.Item.Left();
    }
    that.ItemOffset = offSetSoFar;
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
    that.Rectangle.x = that.player.Rectangle.x + that.player.ItemOffset.x;
    that.Rectangle.y = that.player.Rectangle.y + that.player.ItemOffset.y;
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
