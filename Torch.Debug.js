Torch.Debug = function(game)
{
    var FrameRateThreshHold = 50;
    game.debug = function(){
        var performancePercent = game.NoLags / (game.NoLags + game.Lags);
        var performance = ""
        if (game.NoLags == 0 || (game.Lags == 0 && game.NoLags == 0))
        {
            performance = "100";
        }
        else
        {
            var performanceRaw = (performancePercent).toString().split(".")[1];
            performance = performanceRaw;
        }



        var infoString = "Debug Info For:" + game.name + "<br>";
            infoString += "fps:" + game.fps + "<br>";
            infoString += "SpriteLoad:" + game.spriteList.length + "<br>";
            infoString += "Lags:" + game.Lags + "<br>";
            infoString += "NoLags:" + game.NoLags + "<br>";
            infoString += "Time:" + (game.time/1000).toString().split(".")[0] + "<br>";
            infoString += "Performance(Lags vs No Lags):" + performance;
        $("#info").html(infoString);

        if (game.fps < FrameRateThreshHold && game.fps != 0)
        {
            game.Lags++;
            game.LagTime += game.deltaTime;
        }
        else{
            game.NoLags++;
        }
        if ((game.Lags + game.NoLags) > 500)
        {
            game.Lags = 1;
            game.NoLags = 1;
        }

    };
}
