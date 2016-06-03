var Bullet = function(x, y, enemyOrplayer)
{
    this.InitSprite(x,y);
    Game.Add(this);

    if (enemyOrplayer == "player")
    {
        if (!Game.Player.powerup)
        {
            this.Bind.Texture("bullet_player");
        }
        else
        {
            this.Bind.Texture("bullet_player_powerup");
        }
    }
    else if (enemyOrplayer == "enemy")
    {
        this.Bind.Texture("bullet_enemy");
    }

    this.HIT = false;
    this.hitTime = 0;
    this.drawIndex = 10;
}

Bullet.is(Torch.Sprite);

Bullet.prototype.Update = function()
{
    var that = this;
    if (!that.HIT)
    {
        that.Rectangle.y -= 1 * Game.deltaTime;

        if (that.Rectangle.y <= -50)that.trash = true;

        for (var i = 0; i < Game.spriteList.length; i++)
        {
            var sp = Game.spriteList[i];
            if (sp.ENEMY)
            {
                if (sp.Rectangle.Intersects(that.Rectangle) && !sp.trash && !that.trash && sp.Rectangle.y > -25)
                {
                    that.Bind.Texture("bullet_player_hit");
                    that.HIT = true;
                    if (!sp.shield && !Game.stealBrain)
                    {
                        if (Game.Player.powerup)
                        {
                            sp.health = 0;
                        }
                        else
                        {
                            sp.health -= 50;
                        }
                    }
                }
            }
            else if (sp.POWERUP)
            {
                if (sp.Rectangle.Intersects(that.Rectangle))
                {
                    that.Bind.Texture("bullet_player_hit");
                    that.HIT = true;
                    Game.Player.powerup = true;
                    sp.Hit();
                }
            }
        }
    }
    else if (that.hitTime < 100)
    {
        that.hitTime += Game.deltaTime;
    }
    else if (that.HIT) {
        console.log("trash");
        that.Trash();
    }
};
