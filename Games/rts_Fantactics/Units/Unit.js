var Unit = function()
{
}

Unit.is(Torch.Sprite);

Unit.prototype.BaseInit = function()
{
    var that = this;
    that.InitSprite(0,0);
    that.destination = null;
    that.MovementStateMachine = new Torch.StateMachine(that);
}

Unit.prototype.DefaultMovementStates = function()
{
    var that = this;
    var idle = new Torch.State(function(unit){
        if (unit.selected && unit.game.Mouse.down)
        {
            unit.selected = false;
            unit.destination = {x: unit.game.Mouse.x, y: unit.game.Mouse.y};
            unit.MovementStateMachine.Switch(that.MovementStates.Moving);
        }
    },
    function(unit){

    },
    function(unit){

    });
    that.movementStates = {
        Idle:idle,
        Moving:moving
    }
}
