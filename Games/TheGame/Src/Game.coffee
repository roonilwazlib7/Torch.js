Torch.StrictErrors()
Torch.DisableConsoleWarnings()

Game = new Torch.Game("container", "fill", "fill", "Void", Torch.WEBGL)

blueLightMover = 0

Load = (game) ->

Init = (game) ->


Draw = (game)->

Update = (game) ->

Game.Start(Load, Update, Draw, Init)
