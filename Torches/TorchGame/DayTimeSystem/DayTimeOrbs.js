function DayTimeOrbsAssets(game)
{
    game.Load.Texture("Art/sun.png", "Sun");
    game.Load.Texture("Art/moon.png", "Moon");
}
var DayTimeOrb = function() //sun and mooon
{}
DayTimeOrb.prototype.DayTimeOrb = function()
{
    var that = this;
    that.ToggleFixed();
    that.Rectangle.x = 1000;
    that.Rectangle.y = 20;
    that.Scale();
    that.drawIndex = -2;
    that.anchor = 1000;
}
DayTimeOrb.is(Torch.Sprite).is(SpawnItem);

//sun
var Sun = function()
{
    var that = this;
    that.InitSprite(0,0);
    Game.Add(this);
    that.Bind.Texture("Sun");
    that.DayTimeOrb();
}
Sun.is(DayTimeOrb);
//moon
var Moon = function()
{
    var that = this;
    that.InitSprite(0,0);
    Game.Add(this);
    that.Bind.Texture("Moon");
    that.DayTimeOrb();
}
Moon.is(DayTimeOrb);

//here for now
var DayTimeSystem = function()
{
    this.OrbParalaxOffsetConstant = 5;
    this.time = 0;
    this.timeToSwitch = 10000;
    this.DayTime = "DAY";
}
DayTimeSystem.prototype.Switch = function(switchTo)
{
    var that = this;
    that.time = 0;
    that.Orb.Trash();
    if (switchTo == "NIGHT")
    {
        Game.Clear("black");
        that.DayTime = "NIGHT";
        that.Orb = new Moon();
    }
    else
    {
        Game.Clear("blue");
        that.DayTime = "DAY";
        that.Orb = new Sun();
    }
}
DayTimeSystem.prototype.Update = function()
{
    var that = this;
    if (that.Orb)
    {
        var offSet = ( ( 0 - Game.Player.Rectangle.x ) / that.OrbParalaxOffsetConstant );
        that.Orb.Rectangle.x = that.Orb.anchor + offSet;
    }
    that.time += Game.deltaTime;
    if (that.time >= that.timeToSwitch)
    {
        if (that.DayTime == "DAY")
        {
            that.Switch("NIGHT");
        }
        else
        {
            that.Switch("DAY");
        }
    }
}
