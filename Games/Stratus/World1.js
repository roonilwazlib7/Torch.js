var World1 = [];

var BasicBlock = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("basic-block");
}
BasicBlock.is(Torch.Sprite).is(Torch.Platformer.Block);

function SpawnWorld()
{
    var x = 0;
    var y = 350;

    for (var i = 0; i < 20; i++)
    {
        var spawnItem = new Torch.Platformer.SpawnItem(BasicBlock, true, new BasicBlock(Game, i * 64, y));
        World1.push(spawnItem);
    }
    Torch.Platformer.SetWorld(World1);
}
