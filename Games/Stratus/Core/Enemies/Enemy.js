//Base Enemy prototype
//no constructor as it should be implemented
//by itself
var Enemy = function(){};
Enemy.prototype.StateMachine = function(stateMachineName)
{
    //add the state machine to the list
    //of state machines
    //this is where the 'AI' happens
    var that = this;
    if (that.StateMachineIndex[stateMachineName] == undefined)
    {
        that.StateMachineIndex[stateMachineName] = that.StateMachines.length;
        that.StateMachines.push(new Torch.StateMachine(that));
    }
    else
    {
        return that.StateMachines[that.StateMachineIndex[stateMachineName]];
    }
}
Enemy.prototype.UpdateEnemy = function()
{
    //base enemy update logic
    var that = this;
    that.UpdateStateMachines();
    that.UpdateSprite();
    that.UpdateActor();
    that.UpdateHitsFromPlayer();
}
Enemy.prototype.UpdateStateMachines = function()
{
    //run through all the state machines
    var that = this;
    for (var i = 0; i < that.StateMachines.length; i++)
    {
        that.StateMachines[i].Update();
    }
}
Enemy.prototype.UpdateHitsFromPlayer = function ()
{
    var that = this;
    if (!that.wasJustHit && player.Hand.striking && player.Hand.Rectangle.Intersects(that.Rectangle))
    {
        that.Hit(1);
        that.wasJustHit = true;
        if (that.OnHit) that.OnHit(player.Hand);
    }
    if (!player.Hand.Rectangle.Intersects(that.Rectangle))
    {
        that.wasJustHit = false;
    }
    if (that.Health <= 0)
    {
        Explode(that);
        that.Trash();
    }
}
