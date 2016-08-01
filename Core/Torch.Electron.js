Torch.Electron = {};

Torch.Electron.Import = function()
{
    Torch.fs = require("fs");
    Torch.cluster = require('cluster');

    Torch.DrawWorker = require('electron').remote.getGlobal('DrawWorker');
}
