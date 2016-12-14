var CSON = require("cson"),
    compressor = require('node-minify'),
    fs = require("fs");

function GameBundler(gameRootDirectory)
{
    var gameBlob = "";

    var gameHtmlFile = fs.readFileSync( gameRootDirectory + "/_index.html" ).toString();

    var bundle = CSON.parse( fs.readFileSync( gameRootDirectory +  "/bundle.cson" ).toString() );

    for (var i = 0; i < bundle.files.length; i++)
    {
        f = bundle.files[i];

        if (bundle.bundle)
        {
            gameBlob += fs.readFileSync( gameRootDirectory + "/" + f ).toString();
        }
        else
        {
            gameBlob += "<script src= '" + f + "'></script>\n";
        }

    }

    if (bundle.bundle)
    {
        fs.writeFileSync( gameRootDirectory +  "/game-complete.js", gameBlob );

        if (bundle.compress)
        {
            compressor.minify({
                compressor: 'uglifyjs',
                input: gameRootDirectory +  "/game-complete.js",
                output: gameRootDirectory +  "/game-complete.js",
                sync: true,
                callback: function (err, min) {}
            });
        }

        gameBlob = "<script src = 'game-complete.js'></script>"
    }

    gameHtmlFile = gameHtmlFile.replace("{bundle}", gameBlob);

    fs.writeFileSync( gameRootDirectory + "/index.html", gameHtmlFile);
}

module.exports = GameBundler;
