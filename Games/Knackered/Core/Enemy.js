var Enemy = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.StateMachineIndex = {};
    this.StateMachines = [];
    this.Bind.Texture("enemy");
    this.Bullets = new Torch.SpriteGroup([], game).Factory(Bullet);
    this.StateMachine("movement");
    this.StateMachine("movement").State("chase", this.CreateChaseState());
    this.StateMachine("movement").State("shoot", this.CreateShootState());
    this.StateMachine("movement").Switch("chase");
    this.shootTimer = 0;
}
Enemy.is(Torch.Sprite);
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
Enemy.prototype.Update = function()
{
    //base enemy update logic
    var that = this;
    that.UpdateStateMachines();
    that.UpdateSprite();
    that.Rotation(that.GetAngle(player));
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
Enemy.prototype.CreateChaseState = function()
{
    var that = this,
        state = new Torch.StateMachine.State(
            (enemy) => {
                var directionToPlayer = enemy.GetDirectionVector(player);
                var distanceToPlayer = enemy.GetDistance(player);
                var vel = 0.2;
                if (distanceToPlayer <= 500)
                {
                    enemy.StateMachine("movement").Switch("shoot");
                }
                enemy.Velocity("x", directionToPlayer.x * vel)
                     .Velocity("y", directionToPlayer.y * vel);
            },
            () => {},
            () => {

            }
        );
    return state;
}
Enemy.prototype.CreateShootState = function()
{
    var that = this;
        state = new Torch.StateMachine.State(
            (enemy) => {
                enemy.Velocity("x", 0).Velocity("y", 0);
                var directionToPlayer = enemy.GetDirectionVector(player);
                if (enemy.shootTimer >= 500)
                {
                    var bullet = enemy.Bullets.Add(null, enemy.Position("x") + (enemy.Width() / 2),
                                 enemy.Position("y") + (enemy.Height() / 2) )
                                      .Target("player"); //set it to target enemies
                    bullet.Move("x", (-bullet.Width() / 2));
                    bullet.Move("y", (-bullet.Height() / 2));
                    bullet.Velocity("x", directionToPlayer.x)
                          .Velocity("y", directionToPlayer.y);
                    bullet.Rotation(bullet.GetAngle(player));
                    enemy.shootTimer = 0;
                }
                enemy.shootTimer += enemy.game.deltaTime;
            },
            () => {
            },
            () => {}
        );
    return state;
}
