var Scaler = {
    enabled: false,
    Update: function(game)
    {
        var that = this;
        if (that.enabled)
        {
            Torch.Scale = Math.round(game.Viewport.width / 468);
        }
    }
}
