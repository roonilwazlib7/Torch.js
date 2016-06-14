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
