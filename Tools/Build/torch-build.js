var fs = require("fs");
var compressor = require('node-minify');
var shell = require('shelljs');

buildConfig = JSON.parse( fs.readFileSync(".build-config.json").toString() );
buildConfig.Build += 1;

if (buildConfig.Build >= 100)
{
    buildConfig.Build = 0;
    buildConfig.BuildMinor += 1;
}

// save modified config
fs.writeFileSync(".build-config.json", JSON.stringify(buildConfig, null, 4));

// save version info
fs.writeFileSync("Core/version.js", "Torch.version = '" + buildConfig.BuildMajor + "." + buildConfig.BuildMinor + "." + buildConfig.Build + "'");

source = buildConfig.SourceMap;
source.push("version.js");

for (var i = 0; i < source.length; i++)
{
    source[i] = "Core/" + source[i];
}

console.log("Compiling Torch Coffee...");
// compile the source coffeescript
shell.exec("coffee --compile --output Core/ Src/")

console.log("Writing uncompressed...");
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
compressor.minify({
    compressor: 'yui-js',
    input: 'Builds/torch-latest.js',
    output: 'Builds/torch-latest.min.js',
    sync: true,
    callback: function (err, min) {}
});

// run the test game, if its there
if (buildConfig.TestGame.run)
{
    console.log("Running Test Game...");
    if (buildConfig.TestGame.Source == "Coffee")
    {
        console.log("Compiling Game Coffee...");
        shell.exec("coffee --compile --output Games/" + buildConfig.TestGame.Path + "/Core/ Games/" + buildConfig.TestGame.Path + "/Src/")
    }
    if (buildConfig.TestGame.Electron)
    {
        console.log("Starting Electron...");
        //this won't work for some reason...
        //shell.exec("electron " + "Games/" + buildConfig.TestGame.Path + "/main.js");
        shell.exec("_tmp.bat");
    }
    else
    {
        var child = shell.exec("chrome " + buildConfig.TestGame.Path + "/index.html");
    }
}
