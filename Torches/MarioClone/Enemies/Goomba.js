//states for Goomba's AI
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
//Goomba class
var Goomba = function(position)
{
    this.InitSprite(position.x, position.y);
    Game.Add(this);
    this.Bind.TextureSheet("goomba", {step: 800});
    this.ENEMY = true;
    this.ENEMY_TYPE = "Goomba";
    this.direction = 1;
    this.speed = -0.03;
    this.SwitchState(WalkState);
}
Goomba.is(Torch.Sprite).is(PhysicsObject).is(StateMachine);
Goomba.prototype.OnTrash = function()
{
    this.spawnItem.Sprite = null;
    Torch.Message("Trashing: " + this._torch_uid);
};
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
        item.Sprite.Body.x.velocity = item.Sprite.direction * item.Sprite.speed;

        //Torch.Message(that.Body.x.velocity + "," + item.Sprite.Body.)
    }

}
