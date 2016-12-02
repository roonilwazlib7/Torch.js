var fs = require("fs"),
    CSON = require("cson"),
    program = require("commander");

function GetBase64(filePath)
{
    var raw = fs.readFileSync(filePath);
    return new Buffer(raw).toString('base64');
}


program
    .version('1.0.0')
    .option('-f, --file [source]', "Asset CSON file to package")
    .parse(process.argv);

console.log( "Packaging: " + program.file );

var exportPackage = {assets:[]};
var assetPackage = CSON.parse( fs.readFileSync(program.file).toString() );

for (var i = 0; i < assetPackage.assets.length; i++)
{
    var tex = assetPackage.assets[i];
    var type = tex.split(" ")[0];
    var path = tex.split(" ")[1];
    var id = tex.split(" ")[2];
    var fileType = path.split(".")[ path.split(".").length - 1 ];

    base64 = GetBase64(path);
    exportPackage.assets.push({data: base64, type: type, fileType: fileType})
}

var exportString = JSON.stringify(exportPackage, null, 4);
var baseString = new Buffer(exportString).toString("base64");

fs.writeFileSync("export.tpk", baseString);

console.log("done");
