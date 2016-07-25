var Factory = {};

Factory.Block = function(baseWidth, baseHeight, texture, mapImage, name, slope)
{
    var blockClass = function(game, x, y)
    {
        this.InitSprite(game, x, y);
        this.Bind.Texture(texture);
    }
    blockClass.is(Torch.Sprite).is(Torch.Platformer.Block);

    blockClass.prototype.map = mapImage;
    blockClass.prototype.baseWidth = baseWidth;
    blockClass.prototype.baseHeight = baseHeight;
    blockClass.prototype.name = name;
    if (slope)
    {
        blockClass.prototype.Slope = slope;
    }
    Factory.Block.objects.push(blockClass);

    return blockClass;
}
Factory.Block.objects = [];
