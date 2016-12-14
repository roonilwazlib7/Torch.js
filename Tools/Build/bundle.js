var CSON = require("cson");
var fs = require("fs");

function TorchBundle(gameRootDirectory)
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
        if (bundle.compress)
        {
            // minify the game blob
        }
        gameBlob = "<script>" + gameBlob + "</script>"
    }

    gameHtmlFile = gameHtmlFile.replace("{bundle}", gameBlob);

    fs.writeFileSync( gameRootDirectory + "/index.html", gameHtmlFile);
}

module.exports = TorchBundle;
