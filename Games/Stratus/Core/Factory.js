var Factory = {};

Factory.Block = function(baseWidth, baseHeight, texture, mapImage, name, slope)
{
    var blockClass = function(game, x, y)
    {
        this.InitSprite(game, x, y);
        this.Bind.Texture(texture);
    }
    blockClass.is(Torch.Sprite).is(Torch.Platformer.Block);

    blockClass.prototype.map = mapImage;
    blockClass.prototype.baseWidth = baseWidth;
    blockClass.prototype.baseHeight = baseHeight;
    blockClass.prototype.name = name;
    if (slope)
    {
        blockClass.prototype.Slope = slope;
    }
    Factory.Block.objects.push(blockClass);

    return blockClass;
}
Factory.Block.objects = [];

Factory.Enemy = function(baseWidth, baseHeight, asset, dir, mapImage)
{
    var EnemyClass = function(game, x, y)
    {
        this.InitSprite(game, x, y);
        this.asset = asset;
        this.GetAssets();
        this.Bind.Texture(this.Assets.Right_Idle);
        this.MovementStateMachine = new Torch.StateMachine(this);
    }
    EnemyClass.is(Torch.Sprite).is(Torch.Platformer.Actor);
    EnemyClass.prototype.map = mapImage;
    EnemyClass.prototype.baseWidth = baseWidth;
    EnemyClass.prototype.baseHeight = baseHeight;

    EnemyClass.prototype.Update = function()
    {
        var that = this;
        that.BaseUpdate();
        that.UpdateActor();
    }

    EnemyClass.prototype.GetAssets = function()
    {
        var that = this;
        that.Assets = {
            Right_Idle: that.asset + "-right-idle",
            Left_Idle: that.asset + "-left-idle",
            Walk_Left: that.asset + "-left-walk",
            Walk_Right: that.asset + "-right-walk"
        }
    }

    Factory.Enemy.objects.push(EnemyClass);
    Factory.Enemy.loads.push(function(){
        Game.Load.Texture(dir + "/" + asset + "-right-idle.png", asset + "-right-idle");
        Game.Load.Texture(dir + "/" + asset + "-left-idle.png", asset + "-left-idle");
        Game.Load.TextureSheet(dir + "/" + asset + "-right-walk.png", asset + "-right-walk", 48, 16, 16, 16);
        Game.Load.TextureSheet(dir + "/" + asset + "-left-walk.png", asset + "-left-walk", 48, 16, 16, 16);
    });

    return EnemyClass;
}
Factory.Enemy.objects = [];
Factory.Enemy.loads = [];
Factory.Enemy.Load = function()
{
    var loads = Factory.Enemy.loads;
    for (var i = 0; i < loads.length; i++)
    {
        loads[i]();
    }
}
