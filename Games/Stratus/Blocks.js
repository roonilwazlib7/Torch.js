var BasicBlock = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("basic-block");
}
BasicBlock.is(Torch.Sprite).is(Torch.Platformer.Block);
BasicBlock.prototype.map = "Images/BasicBlock.png";
BasicBlock.prototype.baseWidth = 16;
BasicBlock.prototype.baseHeight = 16;
BasicBlock.prototype.name = "Basic Block";

var DEFS = [
    BasicBlock
]
