var StoneBlock = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("StoneBlock");
    this.Scale();
    this.drawIndex = 10;
}
StoneBlock.is(SpawnItem).is(Torch.Platformer.Block);

var GrassBlock = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("GrassBlock");
    this.Scale();
    this.drawIndex = 10;
    this.friction = 0.2;
}
GrassBlock.is(SpawnItem).is(Torch.Platformer.Block);

var Mountain = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("Mountain");
    this.Scale();
    this.BLOCK = false;
    this.drawIndex = -1;
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

var WaterTop = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("WaterTop");
    this.Scale();
}
WaterTop.is(SpawnItem).is(Torch.Platformer.Fluid);

var WaterMain = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("WaterMain");
    this.Scale();
}
WaterMain.is(SpawnItem).is(Torch.Platformer.Fluid);
