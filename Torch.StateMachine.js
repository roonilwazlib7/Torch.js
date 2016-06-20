Torch.StateMachine = function(obj)
{
    this.currentState = null;
    this.obj = obj;
}
Torch.StateMachine.prototype.Switch = function(newState)
{
    var that = this;
    if (that.currentState && that.currentState.End) that.currentState.End(that.obj);
    if (newState.Start) newState.Start(that.obj);
    that.currentState = newState;
}
Torch.StateMachine.prototype.Update = function()
{
    var that = this;
    that.currentState.Execute(that.obj);
}

Torch.StateMachine.State = function(execute, start, end)
{
    this.Execute = execute;
    this.Start = start;
    this.End = end;
}
