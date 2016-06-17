Torch.SpriteGroup = function(sprites)
{
    this.sprites = sprites;
};
Torch.SpriteGroup.prototype.Shift = (transition)
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        if (transition.x) sprite.x += transition.x;
        if (transition.y) sprite.y += transition.y;
    }
}
