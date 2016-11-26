exports = this
class HUD
    constructor: (@game) ->
        @hud_background = new Torch.Sprite(@game, 0, 0)
        @hud_background.Bind.Texture("hud_background")
        @hud_background.Width(800)
        @hud_background.Height(300)
        @hud_background.DrawIndex(100)
        @hud_background.Center()
        @hud_background.On "Click", -> alert("click")

exports.HUD = HUD
