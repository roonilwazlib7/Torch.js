Particles = {};
Particles.Blood = function(x,y)
{
    this.InitSprite(x,y);
    this.Bind.Texture("blood");
};
Particles.Blood.is(Torch.Sprite);
