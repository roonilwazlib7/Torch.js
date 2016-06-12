var Player = function()
{
    this.PLAYER = true;
    this.InitSprite(50, 375);
    Game.Add(this);
    this.Body.y.acceleration = Game.Gravity;
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
    this.LeftPattern = [
        '.111..................22222............22222...........22222....................',
        '.111..22222.........222222223.......222222222.......222222222.........22222.....',
        '.11222222222.........131333333........1311333.........1311333......222222222....',
        '.333.1311333.......111111311311.....1113111313......1113111313.......1311333....',
        '.333113111313.....1133113311311....11131113313.....11131113313.....1113111313...',
        '.311131113313......33111111311......3333111133......3333111133....11131113313...',
        '..33333111133.......112333222........1111111.........1111111.......3333111133...',
        '...31111111........33322311122.........33223333........333233.......1111111.....',
        '....32333233333....33333311132....111333222333311.....33223333......1.323333....',
        '.3..233323333333...33333311222....11332221233.111....122122333.....1113333331...',
        '.3..2222233333311...333322222......3..2222222..11....222223333......1133333211..',
        '.332122122322.111....22223332......33222222222.......222111332.......222222233..',
        '.3322222222223.1.....2223333.......332222222222.......2221132........222222223..',
        '.33222222222333.......2333223.3....33222...22233......333222..........222.22233.',
        '.........2222..3..........3333..............333.........3333..........3333......',
        '......2222222333.........233333..............333.....3333333...........333....3.',
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
}
Player.prototype.Move = function()
{
    var that = this;
    var rec = that.Rectangle;
    var speed = Game.deltaTime * 0.3;
    if (Game.Keys.D.down)
    {
        that.Body.x.velocity = 0.1;
        if (that.MoveState != "Right")
        {
            that.MoveState = "Right";
            that.Bind.TextureSheet("player_right");
        }
    }
    if (Game.Keys.A.down)
    {
        that.Body.x.velocity = -0.1;
        if (that.MoveState != "Left")
        {
            that.MoveState = "Left";
            that.Bind.TextureSheet("player_left");
        }
    }
    if (!Game.Keys.A.down && !Game.Keys.D.down && !Game.Keys.W.down)
    {
        that.Body.x.velocity = 0;
        if (that.MoveState != "Idle")
        {
            that.MoveState = "Idle";
            that.Bind.PixlTexture(that.IdlePattern);
        }
    }
}
