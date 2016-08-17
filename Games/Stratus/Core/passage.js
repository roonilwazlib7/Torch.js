var Passage = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.mapId = null;
}
Passage.is(Torch.GhostSprite);

Passage.prototype.Update = function()
{
    var that = this;
    that.UpdateSprite();
}
Passage.prototype.UpdatePassage = function()
{
    var that = this,
        offset;
    offset = player.Rectangle.Intersects(player.Rectangle);
    if (offset)
    {
        that.game.mapManager.LoadMap(that.mapId);
    }
}
