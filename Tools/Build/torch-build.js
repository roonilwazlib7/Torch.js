var fs = require("fs"),
    path = require('path'),
    compressor = require('node-minify'),
    shell = require('shelljs'),
    CSON = require('cson'),
    GameRunner = require('./game-runner.js');

function getDirectories(srcpath)
{
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

console.log("[] Building Torch...");

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
fs.writeFileSync("Src/version.coffee", "\nTorch::version = '" + buildConfig.BuildMajor + "." + buildConfig.BuildMinor + "." + buildConfig.Build + "'\n");


var coffeeSource = [];
var source = buildConfig.SourceMap;

source.push("version");

for (var i = 0; i < source.length; i++)
{
    coffeeSource[i] = "Src/" + source[i] + ".coffee"
}

console.log("[] Writing uncompressed CoffeeScript...");
compressor.minify({
    compressor: 'no-compress',
    input: coffeeSource,
    output: 'Builds/torch-latest.coffee',
    sync: true,
    callback: function (err, min) {}
});

console.log("[] Compiling and Writing uncompressed JS...");
shell.exec("coffee --inline-map --compile Builds/torch-latest.coffee");

console.log("[] Writing compressed...");
compressor.minify({
    compressor: 'uglifyjs',
    input: 'Builds/torch-latest.js',
    output: 'Builds/torch-latest.min.js',
    sync: true,
    callback: function (err, min) {}
});

var gameDirs = getDirectories("Games");

for (var i = 0; i < gameDirs.length; i++)
{
    var dir = gameDirs[i];
    if (dir != "Builds")
    {
        GameRunner(dir);
    }
}
