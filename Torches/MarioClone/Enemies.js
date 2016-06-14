var WalkState = {};
WalkState.Execute = function(goom)
{
    if (goom.onRight || goom.onLeft)
    {
        goom.direction *= -1;
        goom.Body.x.velocity = goom.direction * goom.speed;
    }
};
WalkState.Enter = function(goom){
    goom.Body.x.velocity = goom.speed * goom.direction;
};
WalkState.Exit = function(goom){};

var StateMachine = function(){}
StateMachine.prototype.StateMachine = function()
{
    var that = this;
    that.CurrentState.Execute(that);
    if (that.GlobalState) that.GlobalState.Execute(that);
}
StateMachine.prototype.SwitchState = function(newState)
{
    var that = this;
    if (that.CurrentState) that.CurrentState.Exit(that);
    that.CurrentState = newState;
    newState.Enter(that);
}

var Goomba = function(x,y)
{
    this.InitSprite(150, 350);
    Game.Add(this);
    this.Bind.TextureSheet("goomba");
    this.ENEMY = true;
    this.direction = 1;
    this.speed = 0.07;
    this.SwitchState(WalkState);
}
Goomba.is(Torch.Sprite).is(PhysicsObject).is(StateMachine);

Goomba.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.PhysicsObject();
    that.StateMachine();
}
