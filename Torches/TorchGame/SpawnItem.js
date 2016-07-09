var SpawnItem = function(){};
SpawnItem.prototype.InitSpawning = function()
{
    var that = this;
}
SpawnItem.prototype.Scale = function()
{
    var that = this;
    that.Rectangle.width *= that.game.SCALE;
    that.Rectangle.height *= that.game.SCALE;
}
SpawnItem.prototype.ManualSpawn = function()
{
    var that = this;
    var bluePrint = {
        Sprite: that,
        Manual: true,
        spawned: true
    };
    Spawner.SpawnScaffold.push(bluePrint);
}
SpawnItem.is(Torch.Sprite);
