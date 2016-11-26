exports = this
class HUD
    Width: (scale = 1) ->
        return window.innerWidth / scale

    Height: (scale = 1) ->
        return window.innerHeight / scale

    constructor: (@game) ->
        @hud_background = new Torch.Sprite(@game, 0, 0)
        @hud_background.Scale(1)
        @hud_background.Bind.Texture("hud_background")
        @hud_background.DrawIndex(100)
        @hud_background.Width(window.innerWidth)
        # @hud_background.Center()
        # @hud_background.On "Click", -> alert("click")

        @hud_minimap_background = new Torch.Sprite(@game, window.innerWidth / 20, window.innerHeight / 20)
        @hud_minimap_background.Bind.Texture("hud_minimap_background")
        @hud_minimap_background.DrawIndex(101)

        @hud_life_text = new Torch.Text @game, @Width(1.2), @Height(50),
            text: "LIFE"
            color: "green"
            fontSize: 36
            font: "Impact"

        @hud_life_text.DrawIndex(101)

        @hud_stress_text = new Torch.Text @game, @Width(1.2), @Height(7),
            text: "STRESS"
            color: "purple"
            fontSize: 36
            font: "Impact"
        @hud_stress_text.DrawIndex(101)

        @hud_life_bar = new Torch.Sprite(@game, @Width(1.2), @Height(15) )
        @hud_life_bar.Bind.Texture("hud_life_bar")
        @hud_life_bar.DrawIndex(101)

        @hud_stress_bar = new Torch.Sprite(@game, @Width(1.2), @Height(5.5) )
        @hud_stress_bar.Bind.Texture("hud_stress_bar")
        @hud_stress_bar.DrawIndex(101)

        @hud_slot_1_background = new Torch.Sprite(@game, @Width(2), @Height(25) )
        @hud_slot_1_background.Bind.Texture("hud_slot_1_background")
        @hud_slot_1_background.DrawIndex(101)

        @hud_slot_2_background = new Torch.Sprite(@game, @Width(2.5), @Height(25) )
        @hud_slot_2_background.Bind.Texture("hud_slot_2_background")
        @hud_slot_2_background.DrawIndex(101)

exports.HUD = HUD
