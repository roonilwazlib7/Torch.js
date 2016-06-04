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

var QuestionBlock = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("QuestionBlock");
    this.BLOCK = true;
}
QuestionBlock.is(SpawnItem);

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
