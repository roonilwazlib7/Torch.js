exports = this
class HUD
    constructor: (@game) ->
        @build = JSON.parse(@game.File("package"))
        @hud_background = new Torch.Sprite(@game, 0, 0)
        @hud_background.Bind.Texture("hud_background")
        @hud_background.Size.Scale(1,1)
        @hud_background.drawIndex = 100
        @hud_background.Size.height = @Height(5)
        @hud_background.Size.width = window.innerWidth
        @hud_background.fixed = true

        @build_info = new Torch.Text @game, 0, 0,
            text: "Zeldroid-dev-build:#{@build.GameConfig.Build}"
            color: "red"


        @hud_background.Grid.Append(@build_info)

        @game.Camera.position.y += @hud_background.Size.height

    @Load: (game) ->
        game.Load.Texture("Assets/Art/hud-design.png", "hud_background")
        game.Load.Texture("Assets/Art/hud_minimap_background.png", "hud_minimap_background")
        game.Load.Texture("Assets/Art/health_bar.png", "hud_life_bar")
        game.Load.Texture("Assets/Art/stress_bar.png", "hud_stress_bar")
        game.Load.Texture("Assets/Art/hud_slot_1_background.png", "hud_slot_1_background")
        game.Load.Texture("Assets/Art/hud_slot_2_background.png", "hud_slot_2_background")

    BindEvents: ->

    Width: (scale = 1) ->
        return window.innerWidth / scale

    Height: (scale = 1) ->
        return window.innerHeight / scale


exports.HUD = HUD
