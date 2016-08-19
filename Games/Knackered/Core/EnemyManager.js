var EnemyManager = function(game, x, y)
{
    this.group = new Torch.SpriteGroup([], game).Factory(Enemy);
    this.group.Add(null, 500, 100);
}
