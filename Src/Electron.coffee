class Electron
    @Import: ->
        Torch.ELECTRON = true
        Torch.fs = require("fs")
