var Player = function()
{
    this.PLAYER = true;
    this.InitSprite(0, 55);
    Game.Add(this);
    this.Body.y.acceleration = Game.Gravity;
    this.MoveState = "Idle"; //Idle, Right, Left
    this.JumpWasPressed = false;
    this.moveLocked = false;
    this.falling = false;
    this.fallTime = 0;

    this.jumping = false;
    this.movementAcceleration = 0.001;
    this.Body.x.maxVelocity = 0.3;
    this.idleStep = 300;
    this.Bind.TextureSheet("player_idle", {step:this.idleStep});
    this.Scale();
    this.drawIndex = 20;
}
Player.is(Torch.Sprite).is(PhysicsObject).is(SpawnItem);

Player.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    if (!that.moveLocked)that.Move();
    that.PhysicsObject();

    if (that.Rectangle.x > -50) Game.Viewport.x = -that.Rectangle.x + 450;
}
Player.prototype.Move = function()
{
    var that = this;
    var rec = that.Rectangle;
    var speed = Game.deltaTime * 0.3;
    if ( Game.Keys.D.down && !that.onRight)
    {
        that.Body.x.acceleration = that.movementAcceleration;;
        if (that.MoveState != "Right")
        {
            that.MoveState = "Right";
            //that.Bind.TextureSheet("player_right");
            //that.Scale();
        }
    }
    if (Game.Keys.A.down && !that.onLeft)
    {
        that.Body.x.acceleration = -that.movementAcceleration;;
        if (that.MoveState != "Left")
        {
            that.MoveState = "Left";
            //that.Bind.TextureSheet("player_left");
        }
    }
    if (Game.Keys.W.down && that.onGround)
    {
        that.Body.y.velocity = -0.6;
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
Player.prototype.EnemyCollision = function(item, offset)
{
    var that = this;
    if (offset)
    {
        if (offset.vx < offset.halfWidths && offset.vy < offset.halfHeights)
        {
            if (offset.x < offset.y && Math.abs(offset.x) >= 0.2)
            {

            }
            else
            {
                if (offset.vy > 0)
                {
                    //colDir = "t";
                    that.Rectangle.y += offset.y;
                    that.Body.y.velocity = 0;
                }
                else
                {
                    //colDir = "b";
                    that.Rectangle.y -= offset.y;
                    //that.Body.y.acceleration = 0;
                    that.Body.y.velocity = -0.1;
                    item.Sprite.Trash();
                    //that.onGround = true;
                }
            }
        }

    }

};
