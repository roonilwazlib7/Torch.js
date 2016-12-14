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
    GameRunner(buildConfig.TestGame);
}
