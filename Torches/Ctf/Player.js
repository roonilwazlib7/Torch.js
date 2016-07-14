var PlayerData = [
    "111",
    "111",
    "111"
]
var PlayerPallette = {
    "1": "purple"
}

function PlayerLoad()
{
    Game.Load.Texture(pixl(PlayerData, PlayerPallette).src, "Player");
}
function PlayerPath(x,y, alpha)
{
    this.InitSprite(x,y);
    this.Bind.Texture("Player");
    this.timeAlive = 0;
    this.DrawParams = {alpha: alpha / 2}
}
PlayerPath.is(Torch.Sprite);

function PlayerSlave(x,y)
{
    this.InitSprite(x,y);
    this.Bind.Texture("Player");
    this.timeAlive = 0;
    this.DrawParams = {alpha: 0.8}
    this.MOVE_SPEED = 0.2;
}
PlayerSlave.is(Torch.Sprite);
PlayerSlave.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    var keys = Game.Keys;
    if (keys.A.down || keys.D.down || keys.W.down || keys.S.down)
    {
        var p = new PlayerPath(that.Rectangle.x, that.Rectangle.y, that.DrawParams.alpha);
    }
    if (keys.D.down)
    {
        that.Rectangle.x += that.MOVE_SPEED * Game.deltaTime;
    }
    if (keys.A.down)
    {
        that.Rectangle.x -= that.MOVE_SPEED * Game.deltaTime;
    }
    if (keys.W.down)
    {
        that.Rectangle.y -= that.MOVE_SPEED * Game.deltaTime;
    }
    if (keys.S.down)
    {
        that.Rectangle.y += that.MOVE_SPEED * Game.deltaTime;
    }
}


PlayerPath.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.timeAlive += Game.deltaTime;
    that.DrawParams.alpha -= that.timeAlive / 10000;
    if (that.DrawParams.alpha <= 0)
    {
        that.Trash();
    }
}
function Player(x,y)
{
    this.InitSprite(x,y);
    this.Bind.Texture("Player");
    this.Slaves = new Torch.SpriteGroup([]);

    var particle = function(x,y)
    {
        this.InitSprite(x,y);
        this.Bind.Texture("Player");
    }
    particle.is(Torch.Sprite);
    this.Particle = particle;
}
Player.is(Torch.Sprite);
Player.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    var keys = Game.Keys;
    if (keys.A.down || keys.D.down || keys.W.down || keys.S.down)
    {
        var p = new PlayerPath(that.Rectangle.x, that.Rectangle.y, 1);
    }
    if (keys.D.down)
    {
        that.Rectangle.x += 0.3 * Game.deltaTime;
    }
    if (keys.A.down)
    {
        that.Rectangle.x -= 0.3 * Game.deltaTime;
    }
    if (keys.W.down)
    {
        that.Rectangle.y -= 0.3 * Game.deltaTime;
    }
    if (keys.S.down)
    {
        that.Rectangle.y += 0.3 * Game.deltaTime;
    }

    if (!keys.K.down && that.kWasUp)
    {
        that.Multiply();
        that.kWasUp = false;

    }
    else if (keys.K.down)
    {
        that.kWasUp = true;
    }
}
Player.prototype.Die = function()
{
    var that = this;
    that.Trash();
}
Player.prototype.Multiply = function()
{
    var that = this;
    that.Slaves.Add([new PlayerSlave(that.Rectangle.x, that.Rectangle.y - 50), new PlayerSlave(that.Rectangle.x, that.Rectangle.y + 50)]);
}
