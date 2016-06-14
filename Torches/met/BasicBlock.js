var BasicBlock = function(position, scaffoldObject)
{
    this.InitSprite(position.x, position.y);
    this.position = position;
    this.scaffoldObject = scaffoldObject;
    Game.Add(this);
    this.Bind.Texture("DirtBlock");
    this.BLOCK = true;
}
BasicBlock.is(SpawnItem);
