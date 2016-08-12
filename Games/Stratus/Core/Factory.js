var Factory = {};

Factory.Block = function(baseWidth, baseHeight, asset, dir, mapImage, slope, allSheets)
{
    var blockClass = function(game, x, y)
    {
        this.InitSprite(game, x, y);
        this.Bind.Texture(asset);
        this.drawIndex = 3;
    }
    blockClass.is(Torch.Sprite).is(Torch.Platformer.Block);

    blockClass.prototype.map = mapImage;
    blockClass.prototype.baseWidth = baseWidth;
    blockClass.prototype.baseHeight = baseHeight;
    blockClass.prototype.name = asset;
    blockClass.prototype.mapAsset = mapImage;
    blockClass.prototype.asset = asset;
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
        var that = this;
        this.InitSprite(game, x, y);
        this.StateMachines = [];
        this.StateMachineIndex = {};
        this.asset = asset;
        this.GetAssets();
        this.facing = Facing.Right;
        this.walking = Walking.None;
        this.wasJustHit = true;
        this.drawIndex = 3;
        if (this.InitEnemy) this.InitEnemy();
        this.OnTrash = function()
        {
            that.Hand.Trash();
        }
    }
    EnemyClass.is(Torch.Sprite).is(Torch.Platformer.Actor).is(Enemy);
    EnemyClass.prototype.map = mapImage;
    EnemyClass.prototype.baseWidth = baseWidth;
    EnemyClass.prototype.baseHeight = baseHeight;
    EnemyClass.prototype.mapAsset = mapImage;
    EnemyClass.prototype.asset = asset;

    EnemyClass.prototype.Hit = function(amount)
    {
        var that = this;
        that.Health -= amount;
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

Factory.Background = function(baseWidth, baseHeight, asset, dir, mapImage, allSheets)
{
    var BackgroundClass = function(game, x, y, args)
    {
        var that = this;
        this.InitSprite(game, x, y);
        this.asset = asset;
        that.Bind.Texture(asset);
        that.drawIndex = 2;
        this.args = args;
        this.parseArguments();
    }
    BackgroundClass.is(Torch.Sprite);
    BackgroundClass.prototype.map = mapImage;
    BackgroundClass.prototype.baseWidth = baseWidth;
    BackgroundClass.prototype.baseHeight = baseHeight;
    BackgroundClass.prototype.mapAsset = mapImage;
    BackgroundClass.prototype.asset = asset;

    BackgroundClass.prototype.parseArguments = function()
    {
        var that = this;
        var args = that.args;
        var args = args.split(";");
        for (var i = 0; i < args.length; i++)
        {
            var type = args[i].split(":")[0];
            var arg = args[i].split(":")[1];

            switch(type)
            {
                case "shiftY":
                    that.Rectangle.y += parseInt(arg);
                    break;
            }
        }
    }

    Factory.Background.objects.push(BackgroundClass);
    Factory.Background.loads.push(function(){
        if (allSheets)
        {
            Game.Load.TextureSheet(dir + "/" + asset + ".png", asset, 32, 16, 16, 16);
        }
        else
        {
            Game.Load.Texture(dir + "/" + asset + ".png", asset);
        }
    });

    return BackgroundClass;
}
Factory.Background.objects = [];
Factory.Background.loads = [];
Factory.Background.Load = function()
{
    var loads = Factory.Background.loads;
    for (var i = 0; i < loads.length; i++)
    {
        loads[i]();
    }
}
