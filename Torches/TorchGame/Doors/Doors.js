function DoorAssets(game)
{
    game.Load.Texture("Art/door.png", "DayDoor");
    game.Load.Texture("Art/door_night.png", "NightDoor");
    game.Load.Texture("Art/sign.png", "Sign");
}
var Door = function()
{
}
Door.is(Torch.Sprite).is(SpawnItem);
Door.prototype.DOOR = true;

var Sign = function(x,y)
{
    this.InitSprite(x, y);
    Game.Add(this);
    this.Bind.Texture("Sign");
    this.Scale();
    this.BLOCK = false;
    this.drawIndex = 10;
}
Sign.is(Torch.Sprite).is(SpawnItem);

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

    this.Sign = new Sign(this.Rectangle.x,this.Rectangle.y - this.Rectangle.height);
    this.SignText = new Torch.Text([{
        font: "14px Impact",
        fillStyle: "white",
        text: "Press G"
    }],this.Rectangle.x,this.Rectangle.y - this.Rectangle.height + 3,18);
    Game.Add(this.SignText);

    this.SignGroup = new Torch.SpriteGroup([this.Sign, this.SignText]);
    this.SignGroup.Hide();
}
DayDoor.is(Door);
