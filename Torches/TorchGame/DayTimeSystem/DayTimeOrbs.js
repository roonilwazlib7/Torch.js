function DayTimeOrbsAssets(game)
{
    game.Load.Texture("Art/sun.png", "Sun");
    game.Load.Texture("Art/moon.png", "Moon");
    game.Load.Texture("Art/cloud.png", "Cloud");
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

//cloud
var Cloud = function(x, y)
{
    var that = this;
    that.InitSprite(x,y);
    Game.Add(that);
    that.Bind.Texture("Cloud");
    that.Scale();
}
Cloud.is(Torch.Sprite).is(SpawnItem);

//here for now
var DayTimeSystem = function()
{
    this.OrbParalaxOffsetConstantOrb = 5;
    this.OrbParalaxOffsetConstantSkyItems = 4;
    this.time = 0;
    this.timeToSwitch = 10000;
    this.DayTime = "DAY";
    this.GetClouds();
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
        var offSet = ( ( 0 - Game.Player.Rectangle.x ) / that.OrbParalaxOffsetConstantOrb );
        that.Orb.Rectangle.x = that.Orb.anchor + offSet;
    }
    if (that.BackgroundSkyItems)
    {
        var offSet = ( ( 0 - Game.Player.Rectangle.x ) / that.OrbParalaxOffsetConstantSkyItems );
        //that.Orb.Rectangle.x = that.Orb.anchor + offSet;
        that.BackgroundSkyItems.Shift({x: offSet});
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
};
DayTimeSystem.prototype.GetClouds = function()
{
    var that = this;
    var cloud1 = new Cloud(100, 50);
    var cloud2 = new Cloud(650, 75);
    var cloud3 = new Cloud(1025, 50);
    that.BackgroundSkyItems = new Torch.SpriteGroup([cloud1, cloud2, cloud3]);
}
