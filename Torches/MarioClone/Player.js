var Player = function()
{
    this.InitSprite(50,50);
    Game.Add(this);
    this.Bind.Texture("player");
}
Player.is(Torch.Sprite);
