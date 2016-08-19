var ScoreManager = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.score = 0;
}
ScoreManager.is(Torch.Text);
ScoreManager.prototype.Score = function(amount)
{
    var that = this;
    that.score += amount;
    return that;
}
