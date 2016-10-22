Torch.Camera = {};

Torch.Camera.Update = function()
{
    var that = this;
    that.update_Track();
}

Torch.Camera.Track = function(sprite)
{
    var that = this;
    that.track = true;
    that.trackSprite = sprite;
    that.lastTrackX = sprite.Rectangle.x;
    var game = that.trackSprite.game;
    var x = that.trackSprite.Rectangle.x + (game.Viewport.width / 2) + (that.trackSprite.Rectangle.width / 2);
    game.Viewport.x = x;
    if (!sprite._torch_add)
    {
    }
}
Torch.Camera.update_Track = function()
{
    var that = this;
    if (that.track)
    {
        if (that.trackSprite.Rectangle.x != that.lastTrackX)
        {
            //do something
            that.trackSprite.game.Viewport.x -= (that.trackSprite.Rectangle.x - that.lastTrackX);
            that.lastTrackX = that.trackSprite.Rectangle.x;
        }
    }
}
