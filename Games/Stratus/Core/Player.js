var Player = function(game, x, y)
{
    var that = this;
    this.InitSprite(game, x, y);
    this.Bind.Texture("player_right");
    this.DrawIndex(5).Opacity(0);

    this.walkingRight = false;
    this.walkingLeft = false;
    this.ready = false;

    this.Item = null;
    this.HandOffset = new Torch.Point(52, 33);
    this.StrikeOffset = new Torch.Point(0,0);
    this.Hand = new Hand(that, "#FFE97F").DrawIndex(5);

    this.enterCounter = 0;
    this.MOVE_VELOCITY = 0.3;
    this.JUMP_VELOCITY = -0.5;
    this.WALK_ANIMATION_STEP = 200;

    this.facing = Facing.Right;
    this.walking = Walking.None;

    this.OnTrash = function()
    {
        that.Hand.Trash();
    }

}
Player.is(Torch.Sprite).is(Torch.Platformer.Actor);

Player.prototype.Update = function()
{
    var that = this;
    that.UpdateSprite();
    var keys = that.game.Keys;
    if (!that.ready)
    {
        that.Enter();
    }
    else if (!that.dead)
    {
        that.UpdateActor();
        that.Move();
        that.HandleStrikes();
        healthText.text = player.Health;
    }
    if (that.Health <= 0 && !that.dead)
    {
        that.dead = true;
        that.deadCounter = 0;
        that.opacity = 0;
        that.Hand.Trash();
        Explode(that);
        //that.Item.Trash();
    }
    if(that.dead)
    {
        that.deadCounter += that.game.deltaTime;
        if (that.deadCounter >= 6000)
        {
            for (var i = 0; i < that.game.spriteList.length; i++)
            {
                that.game.spriteList[i].Trash();
            }
            var gameOver = new Torch.Sprite(that.game, 0, 0);
            gameOver.Bind.Texture("game-over");
            gameOver.Center();
            gameOver.CenterVertical();
            gameOver.ToggleFixed();

            var continueButton = new Torch.Sprite(that.game, 0, 0);
            continueButton.Bind.Texture("continue");
            continueButton.ToggleFixed();
            continueButton.Center();
            continueButton.Rectangle.y = gameOver.Rectangle.y + gameOver.Rectangle.height + continueButton.Rectangle.height + 10;
            continueButton.Click(function(){
                StartGame();
            });

        }
    }
}
Player.prototype.Hit = function(amount)
{
    var that = this;
    if (!that.hitLock)
    {
        //player.Rectangle.x -= offset.x;
        player.Body.y.velocity = -0.3;
        player.HitLock();
        //that.game.Assets.GetSound("player-hurt").play();
        if (player.Health > 0)
        {
            healthBar.Rectangle.width -= (amount * healthBar.inc);
            player.Health -= amount;
        }
    }
    return that;
}
Player.prototype.Move = function()
{
    var that = this,
        keys = that.game.Keys;
    if (keys.D.down)
    {
        if (!that.onRight)
        {
            that.Body.Velocity("x", that.MOVE_VELOCITY);
        }
        if (that.walking != Walking.Right)
        {
            that.Bind.TextureSheet("player_walk_right").Step(that.WALK_ANIMATION_STEP);
            that.walking = Walking.Right;
            that.facing = Facing.Right;
        }
    }
    if (keys.A.down)
    {
        if (!that.onLeft)
        {
            that.Body.Velocity("x", -that.MOVE_VELOCITY);
        }
        if (that.walking != Walking.Left)
        {
            that.Bind.TextureSheet("player_walk_left").Step(that.WALK_ANIMATION_STEP);
            that.walking = Walking.Left;
            that.facing = Facing.Left
        }
    }
    if (!keys.D.down && !keys.A.down)
    {
        that.Body.Velocity("x", 0);
        if (that.walking == Walking.Right)
        {
            that.Bind.Texture("player_right");
        }
        else if (that.walking == Walking.Left)
        {
            that.Bind.Texture("player_left");
        }
        that.walking = Walking.None;
    }
    if (keys.W.down && that.onGround)
    {
        that.Rectangle.y -= 5;
        that.Body.Velocity("y", that.JUMP_VELOCITY);
    }
}
Player.prototype.SwitchItem = function(item)
{
    var that = this;
    if (that.Item != undefined)
    {
        that.Item.Trash();
    }
    that.Item = new item(that.game, that.Rectangle.x, that.Rectangle.y, that);
}
Player.prototype.HandleStrikes = function()
{
    var that = this;
    if (!that.game.Keys.Space.down && that.SpaceWasDown)
    {
        var anim;
        if (that.facing == Facing.Right)
        {
            that.Hand.PunchRight();
        }
        else
        {
            that.Hand.PunchLeft();
        }
        that.SpaceWasDown = false;
    }
    if (that.game.Keys.Space.down)
    {
        that.SpaceWasDown = true;
    }
    else
    {
        that.SpaceWasDown = false;
    }
}
Player.prototype.Enter = function()
{
    var that = this;
    that.enterCounter += Game.deltaTime;
    that.Opacity(0.0007 * that.enterCounter);

    if (that.Opacity() >= 1)
    {
        that.opacity = 1;
        that.ready = true;
    }
}
