Torch.StrictErrors()
Torch.DisableConsoleWarnings()

Game = new Torch.Game("container", "fill", "fill", "TheGame", Torch.CANVAS)


Load = (game) ->
    game.Bounds()
    game.Load.Texture("Art/player.png", "player")
    game.Load.Texture("Art/map/bush.png", "bush")
    game.Load.Texture("Art/hud_background.png", "hud_background")
    game.Load.Texture("Art/hud_minimap_background.png", "hud_minimap_background")
    game.Load.Texture("Art/health_bar.png", "hud_life_bar")
    game.Load.Texture("Art/stress_bar.png", "hud_stress_bar")
    game.Load.Texture("Art/hud_slot_1_background.png", "hud_slot_1_background")
    game.Load.Texture("Art/hud_slot_2_background.png", "hud_slot_2_background")

    game.Load.File("Maps/test-map.map", "map");
Init = (game) ->
    game.Clear("#fcd8a8")
    game.PixelScale()
    Torch.Scale = 4
    window._game = game
    game.player = new Player(game)
    hud = new HUD(game)

    test = new MapPieces.Bush(game, ["ff", "1f4"])
Draw = (game)->

Update = (game) ->

Game.Start(Load, Update, Draw, Init)
