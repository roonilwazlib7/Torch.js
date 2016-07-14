function DayTimeOrbsAssets(game)
{
    game.Load.Texture("Art/sun.png", "Sun");
    game.Load.Texture("Art/moon.png", "Moon");
    game.Load.Texture("Art/cloud.png", "Cloud");
    game.Load.Texture("Art/star.png", "Star");
}
DayTimeOrbStateMachine = function(orb)
{
    this.orb = orb;
    this.currentState = null;
};
DayTimeOrbStateMachine.prototype.Update = function()
{
    var that = this;
    if (that.currentState) {
        that.currentState.Execute(that.orb);
    }
}
DayTimeOrbStateMachine.prototype.Switch = function(newState)
{
    var that = this
    if (that.currentState && that.currentState.End) that.currentState.End(that.orb);
    if (newState.Start) newState.Start(that.orb);
    that.currentState = newState;
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
    that.stateMachine = new DayTimeOrbStateMachine(that);
    that.idleState = {
        Execute: function(orb)
        {
            console.log("executing...");
        }
    };
    this.transitionOutState = {
        Execute: function(orb)
        {
            orb.Rectangle.y -= Game.deltaTime;
        }
    };
    this.transitionInState = {
        Execute: function(orb)
        {
            orb.Rectangle.y += Game.deltaTime;
            if (orb.Rectangle.y >= 20)
            {
                orb.stateMachine.Switch(orb.idleState);
            }
        }
    }
    this.stateMachine.Switch(this.idleState);
}
DayTimeOrb.is(Torch.Sprite).is(SpawnItem);
DayTimeOrb.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.stateMachine.Update();
}
DayTimeOrb.prototype.TransitionOut = function()
{
    var that = this;
    that.Rectangle.y -= Game.deltaTime;
}

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
    that.drawIndex = 5;
}
Cloud.is(Torch.Sprite).is(SpawnItem);
//star
var Star = function(x, y)
{
    var that = this;
    that.InitSprite(x,y);
    Game.Add(that);
    that.Bind.Texture("Star");
    that.Scale();
    that.drawIndex = 4;
}
Star.is(Torch.Sprite).is(SpawnItem);
