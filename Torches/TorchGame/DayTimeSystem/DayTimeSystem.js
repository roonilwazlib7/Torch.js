//here for now
var DayTimeSystem = function()
{
    var that = this;
    this.NightColor = {r: 0, g: 0, b: 0};
    this.DayColor = {r: 0, g: 10, b: 120};
    this.OrbParalaxOffsetConstantOrb = 6;
    this.OrbParalaxOffsetConstantClouds = 5;
    this.OrbParalaxOffsetConstantStars = 4;
    this.time = 0;
    this.timeToSwitch = 10000;
    //this.DayTime = "DAY";
    //this.Switch("NIGHT");
    that.DayTime = "NIGHT";
    that.Orb = new Moon();
    Game.Clear("black");
    this.GetClouds();
    this.GetStars();
}
DayTimeSystem.prototype.SwitchToDay = function()
{
    var that = this;
    that.Orb.Trash();
    that.Orb = new Sun();
    that.Orb.Rectangle.y = -500;
    that.Orb.stateMachine.Switch(that.Orb.transitionInState);
    that.Stars.Trash();
    that.Stars = null;
}
DayTimeSystem.prototype.SwitchToNight = function()
{
    var that = this;
    that.Orb.Trash();
    that.Orb = new Moon();
    that.Orb.Rectangle.y = -500;
    that.Orb.stateMachine.Switch(that.Orb.transitionInState);
    that.GetStars();
}
DayTimeSystem.prototype.FadeColorSwitch = function(start, end, duration, dayTime)
{
    var that = this;

    var lerp = function(a, b, u) {
        return (1 - u) * a + u * b;
    };

    var interval = 10;
    var steps = duration / interval;
    var step_u = 1.0 / steps;
    var u = 0.0;
    var theInterval = setInterval(function() {
        if (u >= 1.0) {
            clearInterval(theInterval);
            if (dayTime == "NIGHT")
            {
                that.SwitchToNight();
            }
            else
            {
                that.SwitchToDay();
            }
        }
        var r = Math.round(lerp(start.r, end.r, u));
        var g = Math.round(lerp(start.g, end.g, u));
        var b = Math.round(lerp(start.b, end.b, u));
        var colorname = 'rgb(' + r + ',' + g + ',' + b + ')';
        //el.style.setProperty(property, colorname);
        Game.Clear(colorname);
        u += step_u;
    }, interval);

};
DayTimeSystem.prototype.Switch = function(switchTo)
{
    var that = this;
    that.time = 0;
    if (that.Orb) {
        that.Orb.stateMachine.Switch(that.Orb.transitionOutState);
    }
    if (switchTo == "NIGHT")
    {
        that.FadeColorSwitch(that.DayColor, that.NightColor, 1000, "NIGHT");
        that.DayTime = "NIGHT";
    }
    else
    {
        that.FadeColorSwitch(that.NightColor, that.DayColor, 1000, "DAY");
        that.DayTime = "DAY";
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
    if (that.Clouds)
    {
        var offSet = ( ( 0 - Game.Player.Rectangle.x ) / that.OrbParalaxOffsetConstantSkyItems );
        //that.Orb.Rectangle.x = that.Orb.anchor + offSet;
        that.Clouds.Shift({x: offSet});
    }
    if (that.Stars)
    {
        var offSet = ( ( 0 - Game.Player.Rectangle.x ) / that.OrbParalaxOffsetConstantStars );
        //that.Orb.Rectangle.x = that.Orb.anchor + offSet;
        that.Stars.Shift({x: offSet});
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
    that.Clouds = new Torch.SpriteGroup([cloud1, cloud2, cloud3]);
};
DayTimeSystem.prototype.GetStars = function()
{
    var that = this;
    var stars = [];
    for (var i = 0; i < 7; i++)
    {
        var x = 2500 * Math.random();
        var y = 55 * Math.random();
        stars.push(new Star(x,y));
    }
    that.Stars = new Torch.SpriteGroup(stars);
}
