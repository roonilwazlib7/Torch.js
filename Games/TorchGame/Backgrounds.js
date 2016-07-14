var Cloud = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("Cloud");
    this.BLOCK = false;
}
Cloud.is(SpawnItem);

var Bush = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("Bush");
    this.BLOCK = false;
}
Bush.is(SpawnItem);

var Hill = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("Hill");
    this.BLOCK = false;
}
Hill.is(SpawnItem);

//this is probably an easier way to do it
var Background = function(position, scaffoldObject, addData)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture(addData.Texture);
    this.BLOCK = false;
}
Hill.is(SpawnItem);
