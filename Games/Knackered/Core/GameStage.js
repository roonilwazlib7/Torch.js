var GameStage = function(game)
{
    var that = this;
    this.game = game;
    this.stages = {};
    this.stages["main"] = function()
    {
        //initialize the player
        player = new Player(that.game, 0, 0);
        //initialize enemies
        //enemyManager = new EnemyManager(that.game);
        //initialize backgrounds
        backgroundManager = new BackgroundManager(that.game);
        //initialize score
        //scoreManager = new ScoreManager(that.game);
    }
}
GameStage.prototype.Start = function(stage)
{
    var that = this;
    that.stages[stage](that.game);
    return that;
}
