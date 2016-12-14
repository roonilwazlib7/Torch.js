var fs = require("fs");
var compressor = require('node-minify');
var shell = require('shelljs');
var CSON = require('cson');
var TorchBundle = require('./bundle.js');

console.log("[] Building Torch...")

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
fs.writeFileSync("Core/version.js", "\nTorch.version = '" + buildConfig.BuildMajor + "." + buildConfig.BuildMinor + "." + buildConfig.Build + "';\n");

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
compressor.minify({
    compressor: 'no-compress',
    input: source,
    output: 'Builds/torch-latest.js',
    sync: true,
    callback: function (err, min) {}
});

console.log("[] Writing compressed...");
compressor.minify({
    compressor: 'uglifyjs',
    input: 'Builds/torch-latest.js',
    output: 'Builds/torch-latest.min.js',
    sync: true,
    callback: function (err, min) {}
});

// run the test game, if its there
if (buildConfig.TestGame.run)
{
    console.log("[] Copying torch to " + buildConfig.TestGame.Path + "...");
    compressor.minify({
        compressor: 'no-compress',
        input: source,
        output: 'Games/' + buildConfig.TestGame.Path + '/torch.js',
        sync: true,
        callback: function (err, min) {}
    });

    console.log("[] Running " + buildConfig.TestGame.Path + "...");
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

    if (buildConfig.TestGame.Source == "Coffee")
    {
        console.log("[] Compiling Game Coffee...");
        shell.exec("coffee --compile --output Games/" + buildConfig.TestGame.Path + "/Core/ Games/" + buildConfig.TestGame.Path + "/Src/")
        for (var i = 0; i < buildConfig.TestGame.CoffeeSources.length; i++)
        {
            var cf = buildConfig.TestGame.CoffeeSources[i];
            console.log("[] Compiling " + cf + " Coffee");
            var extraPath = buildConfig.TestGame.Path + "/" + cf;
            shell.exec("coffee --compile --output Games/" + extraPath + "/Core/ Games/" + extraPath + "/Src/");
        }
    }

    console.log("[] Bundling Game Files...");
    TorchBundle("Games/" + buildConfig.TestGame.Path);

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
