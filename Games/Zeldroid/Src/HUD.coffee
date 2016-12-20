exports = this
class HUD
    constructor: (@game) ->
        barWidth = 300
        barHeight = 50
        barLeftMargin = -100
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

        @terminal = new Terminal(@game)

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
        healthText.Grid.CenterVertical()

        psycheText = new Torch.Text @game, 0, 0,
            text: "PSYCHE"
            font: "Impact"
            fontSize: 32
            color: "white"
        psycheText.Grid.CenterVertical()

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


class Terminal extends Torch.Sprite
    currentTextOutput: null

    constructor: (game) ->
        @InitSprite(game, 0, 0)
        @Bind.Texture("terminal")
        @Size.Scale(2.5, 1.5)

        @Grid.Center()
             .CenterVertical()

    DisplayText: (text) ->
        @currentTextOutput?.Trash()
        
        @currentTextOutput = textSprite = new Torch.Text @game, 0, 0,
            text: text
            font: "Impact"
            color: "white"
            fontSize: 24

        textSprite.Grid.Center()
                       .CenterVertical()
                       .Margin(0, 10)

        textSprite.opacity = 0

        @game.Tweens.Tween(textSprite.Grid.margin, 500, Torch.Easing.Smooth).To
            top: 0

        @game.Tweens.Tween(textSprite, 500, Torch.Easing.Smooth).To
            opacity: 1

        @Grid.Append(textSprite)


exports.HUD = HUD
