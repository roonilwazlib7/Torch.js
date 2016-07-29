Torch.SpriteGroup = function(sprites)
{
    var that = this;
    this.sprites = sprites;
    for (var i = 0; i < that.sprites.length; i++)
    {
        that.sprites[i].anchorX = that.sprites[i].Rectangle.x;
    }
};
Torch.SpriteGroup.prototype.Add = function(sprites)
{
    var that = this;
    that.sprites = that.sprites.concat(sprites);
}
Torch.SpriteGroup.prototype.Trash = function()
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        that.sprites[i].Trash();
    }
};
Torch.SpriteGroup.prototype.Shift = function(transition)
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        if (transition.x) sprite.Rectangle.x = sprite.anchorX + transition.x;
        //if (transition.y) sprite.Rectangle.y = sprite.Rectangle.y + transition.y;
    }
};
Torch.SpriteGroup.prototype.Hide = function()
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        sprite.draw = false;
    }
};
Torch.SpriteGroup.prototype.Show = function()
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        sprite.draw = true;
    }
}
Torch.SpriteGroup.prototype.Center = function()
{
    var that = this;
    that.All(function(sprite){
        sprite.Center();
    });
}
Torch.SpriteGroup.prototype.ToggleFixed = function()
{
    var that = this;
    that.All(function(sprite){
        sprite.ToggleFixed();
    });
}
Torch.SpriteGroup.prototype.All = function(handle)
{
    var that = this
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        handle(sprite);
    }
}
