Torch.StateMachine = function(obj)
{
    this.currentState = null;
    this.obj = obj;
    this.states = {};
}
Torch.StateMachine.prototype.State = function(stateName, stateObj)
{
    var that = this;
    if (stateObj == undefined)
    {
        if (that.states[stateName] == undefined)
        {
            Torch.FatalError("Unable to get state. State '{0}' has not been added to the state machine".format(stateName));
        }
        return that.states[stateName];
    }
    else
    {
        that.states[stateName] = stateObj;
    }
}
Torch.StateMachine.prototype.Switch = function(newState)
{
    var that = this;
    if (that.currentState && that.currentState.End) that.currentState.End(that.obj);
    if (that.State(newState).Start) that.State(newState).Start(that.obj);
    that.currentState = that.State(newState);
}
Torch.StateMachine.prototype.Update = function()
{
    var that = this;
    if (that.currentState)
    {
        that.currentState.Execute(that.obj);
    }
}

Torch.StateMachine.State = function(execute, start, end)
{
    this.Execute = execute;
    this.Start = start;
    this.End = end;
}
