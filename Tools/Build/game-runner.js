var fs = require("fs"),
    compressor = require('node-minify'),
    shell = require('shelljs'),
    CSON = require('cson'),
    GameBundler = require('./game-bundler.js');

function GameRunner(gamePath)
{
    var TestGame = CSON.parse( fs.readFileSync( "Games/" + gamePath + "/torch.cson" ).toString() );
    if (!TestGame.run)
    {
        return;
    }
    console.log("[] Copying torch to " + gamePath + "...");

    var torch = fs.readFileSync("Builds/torch-latest.js");
    fs.writeFileSync("Games/" + gamePath + "/torch.js", torch);

    console.log("[] Running " + gamePath + "...");
    var windows_script = "cd Games\\" + gamePath;
        windows_script += "\nnpm start";
    var linux_script = "cd Games/" + gamePath;
        linux_script += "\nnpm start";

    if (process.platform == "win32")
    {
        fs.writeFileSync("_tmp.bat", windows_script);
    }
    else
    {
        fs.writeFileSync("_tmp.sh", linux_script);
    }

    console.log("[] Compiling Game Coffee...");
    shell.exec("coffee --inline-map --compile --output Games/" + gamePath + "/Core/ Games/" + gamePath + "/Src/");
    for (var i = 0; i < TestGame.coffeeSources.length; i++)
    {
        var cf = TestGame.coffeeSources[i];
        console.log("[] Compiling " + cf + " Coffee");
        var extraPath = gamePath + "/" + cf;
        shell.exec("coffee --compile --output Games/" + extraPath + "/Core/ Games/" + extraPath + "/Src/");
    }


    console.log("[] Bundling Game Files...");
    GameBundler("Games/" + gamePath);

    if (TestGame.Build)
    {
        // console.log("[] Building Game Packages...");
        // shell.exec("electron-packager Games/" + gamePath + " " + gamePath + " --platform=win32 --arch=all --version=1.3.1 --out=Games/" + gamePath);
        // return;
    }

    if (TestGame.electron)
    {
        console.log("[] Starting Electron...");
        //this won't work for some reason...
        //shell.exec("electron " + "Games/" + gamePath + "/main.js");
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
        var child = shell.exec("chrome " + gamePath + "/index.html");
    }
}
module.exports = GameRunner;
