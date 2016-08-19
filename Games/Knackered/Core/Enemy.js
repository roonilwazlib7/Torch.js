var Enemy = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("enemy");
    this.StateMachine("movement");
}
Enemy.is(Torch.Sprite);
