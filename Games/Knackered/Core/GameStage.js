var GameStage = function(game)
{
    var that = this;
    this.game = game;
    this.stages = {};
    this.stages["main"] = function()
    {
        //initialize the player
        player = new Player(that, 0, 0);
        //initialize enemies
        enemyManager = new EnemyManager(game);
        //initialize backgrounds
        backgroundManager = new BackgroundManager(game);
        //initialize score
        scoreManager = new ScoreManager(game);
    }
}
GameStage.prototype.Start(stage)
{
    var that = this;
    that.stages[stage](game);
    return that;
}
