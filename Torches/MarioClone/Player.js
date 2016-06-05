var Player = function()
{
    this.InitSprite(50);
    Game.Add(this);
    this.Bind.Texture("player");
    this.MoveState = "Idle"; //Idle, Right, Left
    this.blockInFront = false;
    this.blockInBack = false;
    this.blockAbove = false;
}
Player.is(Torch.Sprite);

Player.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.Move();
    that.Fall();
}
Player.prototype.Move = function()
{
    var that = this;
    var rec = that.Rectangle;
    var speed = Game.deltaTime * 0.3;
    if (Game.Keys.D.down && !that.blockInFront)
    {
        rec.x += speed;
        if (that.MoveState != "Right")
        {
            that.MoveState = "Right";
            that.Bind.TextureSheet("player_right");
        }
    }
    if (Game.Keys.A.down && !that.blockInBack)
    {
        rec.x -= speed;
        if (that.MoveState != "Left")
        {
            that.MoveState = "Left";
            that.Bind.TextureSheet("player_left");
        }
    }
    if (Game.Keys.W.down && !that.blockAbove)
    {
        rec.y -= speed;
        if (that.MoveState != "Jump")
        {
            that.MoveState = "Jump";
            that.Bind.Texture("player_jump");
        }
    }
    if (!Game.Keys.A.down && !Game.Keys.D.down && !Game.Keys.W.down)
    {
        if (that.MoveState != "Idle")
        {
            that.MoveState = "Idle";
            that.Bind.Texture("player");
        }
    }
}
Player.prototype.Fall = function()
{
    var that = this;

    var touchingBlock = false;
    that.blockInFront = false;
    that.blockInBack = false;
    that.blockAbove = false;
    for (var i = 0; i < Spawner.SpawnScaffold.length; i++)
    {
        var item = Spawner.SpawnScaffold[i];
        if (item.spawned && item.Sprite && item.Sprite.BLOCK)
        {
            if (that.Rectangle.Intersects(item.Sprite.Rectangle) && (that.Rectangle.y + that.Rectangle.height - 5) < item.Sprite.Rectangle.y)
            {
                that.Rectangle.y = item.Sprite.Rectangle.y - that.Rectangle.height;
                touchingBlock = true;
            }
            if (that.Rectangle.Intersects(item.Sprite.Rectangle) && (that.Rectangle.y + that.Rectangle.height - 5) > item.Sprite.Rectangle.y)
            {
                that.Rectangle.y = item.Sprite.Rectangle.y + that.Rectangle.height;
                that.blockAbove = true;
            }
            if (that.Rectangle.Intersects(item.Sprite.Rectangle) && item.Sprite.Rectangle.x > that.Rectangle.x)
            {
                that.blockInFront = true;
            }
            if (that.Rectangle.Intersects(item.Sprite.Rectangle) && item.Sprite.Rectangle.x < that.Rectangle.x)
            {
                that.blockInBack = true;
            }
        }
    }
    if (!touchingBlock){
        that.Rectangle.y += Game.GetGravity();
        if (that.firstTouch) console.log("down");
    }
}
