var SampleBlock = function(game, x, y){}
SampleBlock.prototype.map = "Images/SampleBlock.png";
SampleBlock.prototype.baseWidth = 16;
SampleBlock.prototype.baseHeight = 16;
SampleBlock.prototype.name = "Sample Block";

var GrassBlock = function(game, x, y){}
GrassBlock.prototype.map = "Images/GrassBlock.png";
GrassBlock.prototype.baseWidth = 16;
GrassBlock.prototype.baseHeight = 16;
GrassBlock.prototype.name = "Grass Block";

var StoneBlock = function(game, x, y){}
StoneBlock.prototype.map = "Images/StoneBlock.png";
StoneBlock.prototype.baseWidth = 16;
StoneBlock.prototype.baseHeight = 16;
StoneBlock.prototype.name = "Stone Block";

var DEFS = [
    SampleBlock,
    GrassBlock,
    StoneBlock
];
