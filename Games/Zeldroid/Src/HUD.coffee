exports = this
class HUD
    constructor: (@game) ->
        barWidth = 300
        barHeight = 50
        barLeftMargin = -50
        barTopMargin = 35

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

        @terminal = new Torch.Sprite(@game, 0, 0)
        @terminal.Bind.Texture("terminal")
        @terminal.Size.Scale(2, 1.5)
        @terminal.Grid.Center()
        @terminal.Grid.CenterVertical()

        @healthBar = new Torch.Shapes.Box(@game, 0, 0, barWidth, barHeight, "green", "green")
        @healthBar.Grid.Align("top", "right")
        @healthBar.Grid.Margin(barLeftMargin, barTopMargin)

        @psycheBar = new Torch.Shapes.Box(@game, 0, 0, barWidth, barHeight, "purple", "purple")
        @psycheBar.Grid.Align("bottom", "right")
        @psycheBar.Grid.Margin(barLeftMargin, -barTopMargin)

        healthText = new Torch.Text @game, 0, 0,
            text: "HEALTH"
            font: "Impact"
            fontSize: 32
            color: "white"

        psycheText = new Torch.Text @game, 0, 0,
            text: "PSYCHE"
            font: "Impact"
            fontSize: 32
            color: "white"

        @healthBar.Grid.Append(healthText)
        @psycheBar.Grid.Append(psycheText)

        @hud_background.Grid.Append(@build_info)
                            .Append(@terminal)
                            .Append(@healthBar)
                            .Append(@psycheBar)

        @game.Camera.position.y += @hud_background.Size.height

    @Load: (game) ->
        game.Load.Texture("Assets/Art/hud_background.png", "hud_background")
        game.Load.Texture("Assets/Art/terminal.png", "terminal")

    BindEvents: ->

    Width: (scale = 1) ->
        return window.innerWidth / scale

    Height: (scale = 1) ->
        return window.innerHeight / scale


exports.HUD = HUD
