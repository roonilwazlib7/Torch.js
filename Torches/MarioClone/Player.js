var Player = function()
{
    this.PLAYER = true;
    this.InitSprite(50, 350);
    Game.Add(this);
    this.MoveState = "Idle"; //Idle, Right, Left
    this.JumpWasPressed = false;
    this.moveLocked = false;
    this.falling = false;
    this.fallTime = 0;

    this.jumping = false;
    this.jumpStart = 0;
    this.jumpTime = 0;
    this.jumpHeightMax = 100;
    this.jumpSpeed = 0.00001;
    this.initalJumpSpeed = 5;
    this.IdlePattern = [
        '.....11111......',
        '....111111111...',
        '....2223323.....',
        '...2323332333...',
        '...23223332333..',
        '...2233332222...',
        '.....3333333....',
        '....221222......',
        '...2221221222...',
        '..222211112222..',
        '..332131131233..',
        '..333111111333..',
        '..331111111133..',
        '....111..111....',
        '...222....222...',
        '..2222....2222..'
    ];
    this.Bind.PixlTexture(this.IdlePattern);
}
Player.is(Torch.Sprite).is(PhysicsObject);

Player.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    if (!that.moveLocked)that.Move();
    that.PhysicsObject();
    if (!Game.Keys.W.down)
    {
        that.JumpWasPressed = false;
    }
    if (that.jumping)
    {
        var dif = Math.abs( that.Rectangle.y - that.jumpStart )
        if (dif < that.jumpHeightMax)
        {

        }
        else{
            that.Body.y.acceleration = 0;
            that.Body.y.velocity = 0;
            that.jumping = false;
            that.jumpTime = 0;
            that.jumpStart = 0;
        }
        if (that.blockAbove)
        {
            that.Body.y.acceleration = 0;
            that.Body.y.velocity = 0;
            that.jumping = false;
            that.jumpTime = 0;
            that.jumpStart = 0;
        }
    }
}
Player.prototype.Move = function()
{
    var that = this;
    var rec = that.Rectangle;
    var speed = Game.deltaTime * 0.3;
    if (Game.Keys.D.down && !that.blockInFront)
    {
        that.Body.x.velocity = 0.1;
        if (that.MoveState != "Right")
        {
            that.MoveState = "Right";
            that.Bind.TextureSheet("player_right");
        }
    }
    if (Game.Keys.A.down && !that.blockInBack)
    {
        that.Body.x.velocity = -0.1;
        if (that.MoveState != "Left")
        {
            that.MoveState = "Left";
            that.Bind.TextureSheet("player_left");
        }
    }
    if (Game.Keys.W.down && !that.blockAbove && !that.JumpWasPressed && that.blockBelow && !that.jumping)
    {
        that.JumpWasPressed = true;
        that.jumpStart = that.Rectangle.y;
        that.jumping = true;
        that.Body.y.velocity = -1.2;
        that.Body.y.acceleration = 0.005;
        if (that.MoveState != "Jump")
        {
            that.MoveState = "Jump";
            that.Bind.Texture("player_jump");
        }
    }
    if (!Game.Keys.A.down && !Game.Keys.D.down && !Game.Keys.W.down)
    {
        that.Body.x.velocity = 0;
        if (that.MoveState != "Idle")
        {
            that.MoveState = "Idle";
            //that.Bind.Texture("player");
            that.Bind.PixlTexture(that.IdlePattern);
        }
    }
    if (that.blockInFront || that.blockInBac)
    {
        if (that.blockInFront)
        {
            that.Body.x.velocity = -0.01;
        }

    }

}
