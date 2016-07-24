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

var SlopeBlock = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("slope-block");
    this.Slope = Math.tan(Math.PI / 4);
}
SlopeBlock.is(Torch.Sprite).is(Torch.Platformer.Block);
SlopeBlock.prototype.map = "Images/SlopeBlock.png";
SlopeBlock.prototype.baseWidth = 16;
SlopeBlock.prototype.baseHeight = 16;
SlopeBlock.prototype.name = "Slope Block";

var DEFS = [
    BasicBlock,
    SlopeBlock
]
