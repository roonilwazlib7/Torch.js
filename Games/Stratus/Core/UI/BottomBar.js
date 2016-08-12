var StatusBar = function(game)
{
    this.InitSprite(game, 0, Game.Viewport.height);
    this.Bind.Texture("status-bar");
    this.Rectangle.y -= this.Rectangle.height;
    this.Center();
    this.ToggleFixed();
    this.drawIndex = 8;
}
StatusBar.is(Torch.Sprite);

var HealthBar = function(game, statusBar)
{
    this.InitSprite(game, 0, Game.Viewport.height);
    this.Bind.Texture("health-bar");
    this.Rectangle.y -= this.Rectangle.height;
    this.Rectangle.x = statusBar.Rectangle.x;
    this.ToggleFixed();
    this.inc = (this.Rectangle.width / 100);
    this.drawIndex = 10;
}
HealthBar.is(Torch.Sprite);

var HealthBarBackground = function(game, statusBar)
{
    this.InitSprite(game, 0, Game.Viewport.height);
    this.Bind.Texture("health-bar-background");
    this.Rectangle.y -= this.Rectangle.height;
    this.Rectangle.x = statusBar.Rectangle.x;
    this.ToggleFixed();
    this.drawIndex = 9;
}
HealthBarBackground.is(Torch.Sprite);
