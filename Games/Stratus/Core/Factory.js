var Factory = {};

Factory.Block = function(baseWidth, baseHeight, asset, dir, mapImage, slope, allSheets)
{
    var blockClass = function(game, x, y)
    {
        this.InitSprite(game, x, y);
        this.Bind.Texture(asset);
    }
    blockClass.is(Torch.Sprite).is(Torch.Platformer.Block);

    blockClass.prototype.map = mapImage;
    blockClass.prototype.baseWidth = baseWidth;
    blockClass.prototype.baseHeight = baseHeight;
    blockClass.prototype.name = asset;
    if (slope)
    {
        blockClass.prototype.Slope = slope;
    }
    Factory.Block.objects.push(blockClass);

    Factory.Block.loads.push(function(){
        if (allSheets)
        {
            Game.Load.TextureSheet(dir + "/" + asset + "-right-idle.png", asset + "-right-idle", 32, 16, 16, 16);
        }
        else
        {
            Game.Load.Texture(dir + "/" + asset + ".png", asset);
        }
    });

    return blockClass;
}
Factory.Block.objects = [];
Factory.Block.loads = [];
Factory.Block.Load = function()
{
    var loads = Factory.Block.loads;
    for (var i = 0; i < loads.length; i++)
    {
        loads[i]();
    }
}


Factory.Enemy = function(baseWidth, baseHeight, asset, dir, mapImage, allSheets)
{
    var EnemyClass = function(game, x, y)
    {
        this.InitSprite(game, x, y);
        if (this.InitEnemy) this.InitEnemy();
        this.asset = asset;
        this.GetAssets();
        this.MovementStateMachine = new Torch.StateMachine(this);
        this.facing = "right";
        this.walking = "none";
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
        if (allSheets)
        {
            Game.Load.TextureSheet(dir + "/" + asset + "-right-idle.png", asset + "-right-idle", 32, 16, 16, 16);
            Game.Load.TextureSheet(dir + "/" + asset + "-left-idle.png", asset + "-left-idle", 32, 16, 16, 16);
        }
        else
        {
            Game.Load.Texture(dir + "/" + asset + "-right-idle.png", asset + "-right-idle");
            Game.Load.Texture(dir + "/" + asset + "-left-idle.png", asset + "-left-idle");
        }
        Game.Load.TextureSheet(dir + "/" + asset + "-right-walk.png", asset + "-right-walk", 32, 16, 16, 16);
        Game.Load.TextureSheet(dir + "/" + asset + "-left-walk.png", asset + "-left-walk", 32, 16, 16, 16);
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
