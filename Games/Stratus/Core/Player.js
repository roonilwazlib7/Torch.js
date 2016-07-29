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
    this.StrikeOffset = {x: 0, y: 0}
    this.facing = "right";
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
    else if (!that.dead)
    {
        that.UpdateActor();
        that.HandleItemOffset();
        that.Move();
        that.HandleStrikes();
        healthText.text = player.Health;
    }
    if (that.Health <= 0 && !that.dead)
    {
        that.dead = true;
        that.rotation = Math.PI;
        that.Hand.Trash();
        that.Item.Trash();
        that.Body.y.acceleration = 0.001;
        that.Body.y.velocity = -0.5;
    }
    if(that.dead)
    {
        that.opacity -= 0.001 * that.game.deltaTime;
        if (that.opacity <= 0)
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
    that.BaseUpdate();
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
            that.facing = "right";
        }
    }
    else if (keys.A.down)
    {
        that.Body.x.velocity = -velocity;
        if (!that.walkingLeft)
        {
            that.Bind.TextureSheet("player_walk_left", {step: 200});
            that.walkingLeft = true;
            that.facing = "left";
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
    if (keys.W.down && that.onGround)
    {
        console.log("jumping...");
        that.Rectangle.y -= 5;
        that.Body.y.velocity = -0.5;
    }
    if (keys.R.down) that.rotation += 0.01;
}
Player.prototype.SwitchItem = function(item)
{
    var that = this;
    if (that.Item) that.Item.Trash();
    that.Item = new item(that.game, that.Rectangle.x, that.Rectangle.y, that);
}
Player.prototype.HandleStrikes = function()
{
    var that = this;
    if (!that.game.Keys.E.down && that.EWasDown)
    {
        var anim;
        if (that.facing == "right")
        {
            anim = new Torch.Animation.StepAnimation(that.game, 100, GetPlayerStrikeRightFrameList(that),
            function(){
                console.log("starting");
                that.Item.striking = true;
            },
            function(){
                console.log("ending");
                that.Item.striking = false;
            });
        }
        else
        {
            anim = new Torch.Animation.StepAnimation(that.game, 100, GetPlayerStrikeLeftFrameList(that),
            function(){
                console.log("starting");
                that.Item.striking = true;
            },
            function(){
                console.log("ending");
                that.Item.striking = false;
            });
        }
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
}
Player.prototype.HandleItemOffset = function()
{
    var that = this;
    if (that.facing == "right")
    {
        that.HandOffset = {
                x: that.Rectangle.width - 5,
                y: 33
        };
    }
    else
    {
        that.HandOffset = {
            x: -5,
            y: 33
        }
    }
    that.Hand.Rectangle.x = this.Rectangle.x + this.HandOffset.x + that.StrikeOffset.x;
    that.Hand.Rectangle.y = this.Rectangle.y + this.HandOffset.y + that.StrikeOffset.y;
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

//lets define some big objects

var GetPlayerStrikeRightFrameList = function(player){
    var that = player;
    return [
        function(){that.StrikeOffset = {x: -15, y: -20}},
        function(){that.StrikeOffset.x += 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x += 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x += 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x += 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x += 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x += 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x += 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x += 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x += 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x += 2; that.StrikeOffset.y += 2}
    ];
}

var GetPlayerStrikeLeftFrameList = function(player){
    var that = player;
    return [
        function(){that.StrikeOffset = {x: 15, y: -20}},
        function(){that.StrikeOffset.x -= 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x -= 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x -= 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x -= 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x -= 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x -= 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x -= 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x -= 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x -= 2; that.StrikeOffset.y += 2},
        function(){that.StrikeOffset.x -= 2; that.StrikeOffset.y += 2}
    ];
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
    this.lastDirection = "right";
    this.Offset = {x: 0, y: 0}
}
ShortSword.is(Torch.Sprite);
ShortSword.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.Rectangle.x = that.player.Hand.Rectangle.x + that.Offset.x;
    that.Rectangle.y = that.player.Hand.Rectangle.y - (that.Rectangle.width / 2) - 5 + that.Offset.y;
    if (that.lastDirection != that.player.facing)
    {
        that.lastDirection = that.player.facing;
        if (that.player.facing == "right")
        {
            that.Right();
        }
        else
        {
            that.Left();
        }
    }
}
ShortSword.prototype.Right = function()
{
    var that = this;
    that.Bind.Texture(that.rightTexture);
    this.Offset = {x: 0, y: 0}
}
ShortSword.prototype.Left = function()
{
    var that = this;
    that.Bind.Texture(that.leftTexture);
    this.Offset = {x: -that.Rectangle.width, y: 0}
}
