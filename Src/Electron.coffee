class Electron
    @Import: ->
        Torch.ELECTRON = true
        Torch.fs = require("fs")

Torch.Electron = new Electron()
