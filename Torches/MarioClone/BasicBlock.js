var BasicBlock = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("BasicBlock");
    this.BLOCK = true;
}
BasicBlock.is(SpawnItem);

var BasicBrick = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("BasicBrick");
    this.BLOCK = true;
}
BasicBrick.is(SpawnItem);

var MysteryBlock = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("QuestionBlock");
    this.BLOCK = true;
}
MysteryBlock.is(SpawnItem);

var Pipe = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("Pipe");
    this.BLOCK = true;
}
Pipe.is(SpawnItem);
