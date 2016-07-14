var Player = function(game)
{
    this.PLAYER = true;
    this.InitSprite(0, 55);
    this.idleStep = 300;
    if (game)
    {
        Game.Add(this);
        this.Bind.TextureSheet("player_idle", {step:this.idleStep});
        this.Scale();
        this.Body.y.acceleration = game.Gravity;
        this.ManualSpawn();
    }
    this.MoveState = "Idle"; //Idle, Right, Left
    this.JumpWasPressed = false;
    this.moveLocked = false;
    this.falling = false;
    this.fallTime = 0;

    this.jumping = false;
    this.movementAcceleration = 0.5;
    this.Body.x.maxVelocity = 0.3;

    this.drawIndex = 5;
    this.DrawParams = {};
}
Player.is(Torch.Sprite).is(Torch.Platformer.Actor).is(SpawnItem);

Player.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    if (!that.moveLocked)that.Move();
    that.UpdateActor();

    if (that.Rectangle.x > -50) Game.Viewport.x = -that.Rectangle.x + 450;
    Game.HealthBar.Rectangle.width = (that.Health / 100) * Game.HealthBar.maxWidth;
}
Player.prototype.Move = function()
{
    var that = this;
    var rec = that.Rectangle;
    var speed = Game.deltaTime * 0.3;
    if ( Game.Keys.D.down && !that.onRight)
    {
        that.Body.x.velocity = that.movementAcceleration * that.currentFriction;
        if (that.MoveState != "Right")
        {
            that.MoveState = "Right";
            //that.Bind.TextureSheet("player_right");
            //that.Scale();
        }
    }
    if (Game.Keys.A.down && !that.onLeft)
    {
        that.Body.x.velocity = -that.movementAcceleration * that.currentFriction;
        if (that.MoveState != "Left")
        {
            that.MoveState = "Left";
            //that.Bind.TextureSheet("player_left");
        }
    }
    if (Game.Keys.W.down && that.onGround && !that.inFluid )
    {
        that.Body.y.velocity = -0.6;
    }
    if (Game.Keys.W.down && that.inFluid)
    {
        that.Body.y.velocity = -0.3;
    }
    else if (!Game.Keys.W.down && that.inFluid)
    {
        that.Body.y.velocity = 0;
    }
    if ( !Game.Keys.A.down  && !Game.Keys.D.down )
    {
        that.Body.x.acceleration = 0;
        that.Body.x.velocity = 0;
        if (that.MoveState != "Idle")
        {
            that.MoveState = "Idle";
            this.Bind.TextureSheet("player_idle", {step:that.idleStep});
            that.Scale();
        }
    }
};
Player.prototype.MoveWithPad = function()
{
    var that = this;
    var rec = that.Rectangle;
    var speed = Game.deltaTime * 0.3;
    if ( (Game.Keys.D.down || ( Game.GamePads[0] && Game.GamePads[0].DPadRight.down) ) && !that.onRight)
    {
        that.Body.x.acceleration = 0.0001;
        if (that.MoveState != "Right")
        {
            that.MoveState = "Right";
            that.Bind.TextureSheet("player_right");
        }
    }
    if (Game.Keys.A.down || ( Game.GamePads[0] && Game.GamePads[0].DPadLeft.down) )
    {
        that.Body.x.acceleration = -0.0001;
        if (that.MoveState != "Left")
        {
            that.MoveState = "Left";
            that.Bind.TextureSheet("player_left");
        }
    }
    if (Game.Keys.W.down || ( Game.GamePads[0] && Game.GamePads[0].A.down) )
    {
        that.Body.y.velocity = -0.5;
    }
    if ( (!Game.Keys.A.down && !Game.GamePads[0].DPadLeft.down) && (!Game.Keys.D.down && !Game.GamePads[0].DPadRight.down) )
    {
        that.Body.x.acceleration = 0;
        that.Body.x.velocity = 0;
        if (that.MoveState != "Idle")
        {
            that.MoveState = "Idle";
            that.Bind.Texture("player");
        }
    }
}
Player.prototype.EnemyCollision = function(en, offset)
{
    en.PlayerCollision(this, offset);
};
