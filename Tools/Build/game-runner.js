var fs = require("fs"),
    compressor = require('node-minify'),
    shell = require('shelljs'),
    CSON = require('cson'),
    GameBundler = require('./game-bundler.js');

function GameRunner(TestGame)
{
    console.log("[] Copying torch to " + TestGame.Path + "...");

    var torch = fs.readFileSync("Builds/torch-latest.js");
    fs.writeFileSync("Games/" + TestGame.Path + "/torch.js", torch);

    console.log("[] Running " + TestGame.Path + "...");
    var windows_script = "cd Games\\" + TestGame.Path;
        windows_script += "\nnpm start";
    var linux_script = "cd Games/" + TestGame.Path;
        linux_script += "\nnpm start";

    if (process.platform == "win32")
    {
        fs.writeFileSync("_tmp.bat", windows_script);
    }
    else
    {
        fs.writeFileSync("_tmp.sh", linux_script);
    }

    if (TestGame.Source == "Coffee")
    {
        console.log("[] Compiling Game Coffee...");
        shell.exec("coffee --inline-map --compile --output Games/" + TestGame.Path + "/Core/ Games/" + TestGame.Path + "/Src/")
        for (var i = 0; i < TestGame.CoffeeSources.length; i++)
        {
            var cf = TestGame.CoffeeSources[i];
            console.log("[] Compiling " + cf + " Coffee");
            var extraPath = TestGame.Path + "/" + cf;
            shell.exec("coffee --compile --output Games/" + extraPath + "/Core/ Games/" + extraPath + "/Src/");
        }
    }

    console.log("[] Bundling Game Files...");
    GameBundler("Games/" + TestGame.Path);

    if (TestGame.Build)
    {
        // console.log("[] Building Game Packages...");
        // shell.exec("electron-packager Games/" + TestGame.Path + " " + TestGame.Path + " --platform=win32 --arch=all --version=1.3.1 --out=Games/" + TestGame.Path);
        // return;
    }

    if (TestGame.Electron)
    {
        console.log("[] Starting Electron...");
        //this won't work for some reason...
        //shell.exec("electron " + "Games/" + TestGame.Path + "/main.js");
        if (process.platform == "win32")
        {
            shell.exec("_tmp.bat");
            fs.unlinkSync("_tmp.bat");
        }
        else
        {
            shell.exec("bash _tmp.sh");
            fs.unlinkSync("_tmp.sh");
        }
    }
    else
    {
        var child = shell.exec("chrome " + TestGame.Path + "/index.html");
    }
}
module.exports = GameRunner;
