var fs = require("fs"),
    compressor = require('node-minify'),
    shell = require('shelljs'),
    CSON = require('cson'),
    GameRunner = require('./game-runner.js');

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
fs.writeFileSync("Src/version.coffee", "\nTorch.version = '" + buildConfig.BuildMajor + "." + buildConfig.BuildMinor + "." + buildConfig.Build + "'\n");


var coffeeSource = [];
var source = buildConfig.SourceMap;

for (var i = 0; i < source.length; i++)
{
    coffeeSource[i] = "Src/" + source[i] + ".coffee"
}


console.log("[] Compiling Torch Coffee...");
// compile the source coffeescript
shell.exec("coffee --compile --output Core/ Src/")

console.log("[] Writing uncompressed CoffeeScript...");
compressor.minify({
    compressor: 'no-compress',
    input: coffeeSource,
    output: 'Builds/torch-latest.coffee',
    sync: true,
    callback: function (err, min) {}
});

console.log("[] Writing uncompressed JS...");
shell.exec("coffee --compile Builds/torch-latest.coffee")

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
    GameRunner(buildConfig.TestGame);
}
