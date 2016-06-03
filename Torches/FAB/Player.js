var Player = function()
{
    this.InitSprite(0,0);
    Game.Add(this);

    this.Bind.Texture("player_idle");

    this.Rectangle.x = (Game.Scene.width / 2) - (this.Rectangle.width / 2);
    this.Rectangle.y = (Game.Scene.height - this.Rectangle.height - 10);

    this.score = 0;
    this.moveTime = 0;
    this.shootCoolOff = 0;
    this.powerCoolOff = 0;
    this.powerup = false;

    this.drawIndex = 10;

    //constants
    this.BULLET_TIMEOUT = 200;
};

Player.is(Torch.Sprite);

Player.prototype.GetMoveSpeed = function()
{
    var that = this;
    var moveConstant = 0.4;
    return moveConstant * Game.deltaTime;
}

Player.prototype.MoveRight = function()
{
    var that = this;
    that.Rectangle.x += that.GetMoveSpeed();
    that.Bind.Texture("player_right");
}
Player.prototype.MoveLeft = function()
{
    var that = this;
    that.Rectangle.x -= that.GetMoveSpeed();
    that.Bind.Texture("player_left");
}
Player.prototype.MoveUp = function()
{
    var that = this;

    //that.Rectangle.y -= that.GetMoveSpeed();
};
Player.prototype.MoveDown = function()
{
    var that = this;
    //that.Rectangle.y += that.GetMoveSpeed();
}
Player.prototype.Idle = function()
{
    var that = this;
    that.Bind.Texture("player_idle");
}

Player.prototype.Update = function()
{
    var that = this;
    if (that.powerup) that.powerCoolOff += Game.deltaTime;
    if (that.powerCoolOff >= 15000)
    {
        that.powerCoolOff = 0;
        that.powerup = false;
    }
    that.BaseUpdate();
    if (Game.Keys.D.down && that.Rectangle.x < Game.Scene.width - 10) that.MoveRight();
    if (Game.Keys.A.down && that.Rectangle.x > 50) that.MoveLeft();
    if (Game.Keys.W.down) that.MoveUp();
    if (Game.Keys.S.down) that.MoveDown();
    if (!Game.Keys.D.down && !Game.Keys.A.down && !Game.Keys.S.down && !Game.Keys.W.down) {
        //no keys are being pressed
        that.Idle();
    }
    if (Game.Keys.Space.down && that.shootCoolOff <= 0)
    {
        Game.Assets.GetSound("shot_sound").toggle();
        //create bullet
        var b = new Bullet(that.Rectangle.x + 7, that.Rectangle.y + 14, "player");
        var b2 = new Bullet(that.Rectangle.x + that.Rectangle.width - 18, that.Rectangle.y, "player");
        that.shootCoolOff = that.BULLET_TIMEOUT;
    }
    if (that.shootCoolOff >= 0)
    {
        that.shootCoolOff -= Game.deltaTime;
    }
}
