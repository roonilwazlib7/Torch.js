var StoneBlock = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("StoneBlock");
    this.Scale();
    this.BLOCK = true;
}
StoneBlock.is(SpawnItem);

var GrassBlock = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("GrassBlock");
    this.Scale();
    this.BLOCK = true;
}
GrassBlock.is(SpawnItem);

var Mountain = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("Mountain");
    this.Scale();
    this.BLOCK = false;
}
Mountain.is(SpawnItem);

var Tree = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("Tree");
    this.Scale();
    this.BLOCK = false;
}
Tree.is(SpawnItem);
