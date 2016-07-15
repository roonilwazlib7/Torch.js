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
    this.Bounds = {
        left: 0,
        right: 1280,
        top: 0,
        bottom: 720
    };

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

    if (!Game.Mouse.down && that.mouseWasDown)
    {
        var MoveVector = new Torch.Vector(Game.Mouse.x - that.Rectangle.x, Game.Mouse.y - that.Rectangle.y);
        MoveVector.Normalize();
        that.Body.x.velocity = MoveVector.x;
        that.Body.y.velocity = MoveVector.y;
        that.mouseWasDown = false;
        Torch.Message("vec");
    }
    if (Game.Mouse.down)
    {
        that.mouseWasDown = true;
    }
    if (!Game.Mouse.down)
    {
        that.mouseWasDown = false;
    }

    if (that.Rectangle.x >= that.Bounds.right)
    {
        that.Rectangle.x -= 2 * (that.Rectangle.x - that.Bounds.right);
        that.Body.x.velocity *= -1;
    }
    if (that.Rectangle.x <= that.Bounds.left)
    {
        that.Rectangle.x += 2 * Math.abs(that.Rectangle.x);
        that.Body.x.velocity *= -1;
    }
    if (that.Rectangle.y >= that.Bounds.bottom)
    {
        that.Rectangle.y -= 2 * (that.Rectangle.y - that.Bounds.bottom);
        that.Body.y.velocity *= -1;
    }
    if (that.Rectangle.y <= that.Bounds.top)
    {
        that.Rectangle.y += 2 * Math.abs(that.Rectangle.y);
        that.Body.y.velocity *= -1;
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
