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

var Goomba = function(position)
{
    this.InitSprite(position.x, position.y);
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
Goomba.prototype.EnemyCollision = function(item, offset)
{
    var that = this;
    if (offset)
    {
        if (offset.vx < offset.halfWidths && offset.vy < offset.halfHeights)
        {
            if (offset.x < offset.y && Math.abs(offset.x) >= 0.2)
            {
                that.Body.y.velocity = 0;
                if (offset.vx > 0)
                {
                    //colDir = "l";
                    that.Rectangle.x += offset.x - 1;
                    that.Body.x.velocity = 0;
                    that.onLeft = true;
                }
                else
                {
                    //colDir = "r";
                    that.Rectangle.x -= offset.x + 1;
                    that.Body.x.velocity = 0;
                    that.onRight = true;
                }

            }
        }
        that.direction *= -1;
        that.Body.x.velocity = that.direction * that.speed;

        item.Sprite.direction *= -1;
        item.Sprite.Body.velocity = item.Sprite.direction * item.Sprite.speed;
    }

}
