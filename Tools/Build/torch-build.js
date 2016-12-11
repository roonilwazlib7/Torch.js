var fs = require("fs");
var compressor = require('node-minify');
var shell = require('shelljs');
var CSON = require('cson');

console.log("[] Building Torch -- " + process.platform)

buildConfig = CSON.parse( fs.readFileSync(".build-config.cson").toString() );
buildConfig.Build += 1;

if (buildConfig.Build >= 500)
{
    buildConfig.Build = 0;
    buildConfig.BuildMinor += 1;
}

// save modified config
fs.writeFileSync(".build-config.cson", CSON.stringify(buildConfig, null, 4));

// save version info
fs.writeFileSync("Core/version.js", "Torch.version = '" + buildConfig.BuildMajor + "." + buildConfig.BuildMinor + "." + buildConfig.Build + "'");

source = buildConfig.SourceMap;
source.push("version.js");

for (var i = 0; i < source.length; i++)
{
    source[i] = "Core/" + source[i];
}

console.log("[] Compiling Torch Coffee...");
// compile the source coffeescript
shell.exec("coffee --compile --output Core/ Src/")

console.log("[] Writing uncompressed...");
// write the uncompressed js version
compressor.minify({
    compressor: 'no-compress',
    input: source,
    output: 'Builds/torch-latest.js',
    sync: true,
    callback: function (err, min) {}
});

console.log("Writing compressed...");
//write the compressed js version
// compressor.minify({
//     compressor: 'yui-js',
//     input: 'Builds/torch-latest.js',
//     output: 'Builds/torch-latest.min.js',
//     sync: true,
//     callback: function (err, min) {}
// });

// run the test game, if its there
if (buildConfig.TestGame.run)
{
    console.log("Running Test Game...");
    var windows_script = "cd Games\\" + buildConfig.TestGame.Path;
        windows_script += "\nnpm start";
    var linux_script = "cd Games/" + buildConfig.TestGame.Path;
        linux_script += "\nnpm start";

    if (process.platform == "win32")
    {
        fs.writeFileSync("_tmp.bat", windows_script);
    }
    else
    {
        fs.writeFileSync("_tmp.sh", linux_script);
    }

    // easy file includes...
    index = fs.readFileSync("Games/" + buildConfig.TestGame.Path + "/index.html").toString();

    index = index.replace(/\{([^}]+)\}/g, function(path){

        var clean = path.replace("{", "").replace("}", "");

        return "<script src = '" + clean + "' ></script>";

    });

    fs.writeFileSync("Games/" + buildConfig.TestGame.Path + "/_tmp_index.html", index);

    if (buildConfig.TestGame.Source == "Coffee")
    {
        console.log("[] Compiling Game Coffee...");
        shell.exec("coffee --compile --output Games/" + buildConfig.TestGame.Path + "/Core/ Games/" + buildConfig.TestGame.Path + "/Src/")
        for (var i = 0; i < buildConfig.TestGame.CoffeeSources.length; i++)
        {
            var cf = buildConfig.TestGame.CoffeeSources[i];
            console.log("[] Compiling " + cf + " Coffee");
            shell.exec("coffee --compile --output Games/" + buildConfig.TestGame.Path + "/" + cf + "/Core/ Games/" + buildConfig.TestGame.Path + "/" + cf + "/Src/")
        }
    }
    if (buildConfig.TestGame.Electron)
    {
        console.log("[] Starting Electron...");
        //this won't work for some reason...
        //shell.exec("electron " + "Games/" + buildConfig.TestGame.Path + "/main.js");
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
        var child = shell.exec("chrome " + buildConfig.TestGame.Path + "/index.html");
    }
}
