function DoorAssets(game)
{
    game.Load.Texture("Art/door.png", "DayDoor");
    game.Load.Texture("Art/door_night.png", "NightDoor");
}
var Door = function()
{
}
Door.is(Torch.Sprite).is(SpawnItem);
Door.prototype.DOOR = true;

var NightDoor = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("NightDoor");
    this.Scale();
    this.BLOCK = false;
    this.drawIndex = 10;
}
NightDoor.is(Door);

var DayDoor = function(position, scaffoldObject, addData)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("DayDoor");
    this.Scale();
    this.BLOCK = false;
    this.drawIndex = 10;
    this.addData = addData;
}
DayDoor.is(Door);
