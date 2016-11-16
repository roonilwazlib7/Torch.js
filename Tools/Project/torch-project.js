var fs = require("fs");
    stdin = process.openStdin(),
    currentStage = 0,
    stages = [];

var _PATH, _BASE_PATH, _NAME, _GL_OR_CANVAS, _ELECTRON_OR_WEB, _COFFEE_OR_JS;

var BANNER =        fs.readFileSync("banner.txt").toString(),
    GAME_JS =       fs.readFileSync("Game.template.js").toString(),
    GAME_COFFEE =   fs.readFileSync("Game.template.coffee").toString(),
    MAIN_JS =       fs.readFileSync("main.template.js").toString(),
    INDEX_HTML =    fs.readFileSync("index.template.html").toString();

function processInput(input)
{
    if (currentStage >= stages.length)
    {
        return;
    }
    try
    {
        stages[currentStage](input);
        currentStage++;
    }
    catch (er)
    {
        console.log("[X] ERROR: " + er);
        console.log("[ ] Try Again:");
    }
}

function buildFolders()
{
    _BASE_PATH = _PATH + "/" + _NAME;
    fs.mkdirSync(_BASE_PATH);
    fs.mkdirSync(_BASE_PATH + "/Art");
    fs.mkdirSync(_BASE_PATH + "/Core");
    fs.mkdirSync(_BASE_PATH + "/Build");

    if (_COFFEE_OR_JS != "JS")
    {
        fs.mkdirSync(_BASE_PATH + "/Src");
    }

}
function buildGameFile()
{
    GAME_JS = GAME_JS.replace("~NAME~",'"' + _NAME + '"')
                     .replace("~GRAPHICS~", _GL_OR_CANVAS == "WEBGL" ? "Torch.WEBGL" : "Torch.CANVAS");

    GAME_COFFEE = GAME_COFFEE.replace("~NAME~", '"' + _NAME + '"')
                             .replace("~GRAPHICS~", _GL_OR_CANVAS == "WEBGL" ? "Torch.WEBGL" : "Torch.CANVAS");
    if (_COFFEE_OR_JS == "JS")
    {
        fs.writeFileSync(_BASE_PATH + "/Core/Game.js", GAME_JS);
    }
    else
    {
        fs.writeFileSync(_BASE_PATH + "/Src/Game.coffee", GAME_COFFEE);
    }
}
function buildPackageJSON()
{
    // https://www.npmjs.com/package/electron-builder
    // https://threejs.org/examples/webgl_materials_blending.html
    // https://threejs.org/docs/api/materials/Material.html

    var packageJson = {
        "build": {
            "appId": "your.id",
            "mac": {
                "category": "game",
            },
            "win": {
                "iconUrl": "(windows-only) https link to icon"
            }
        },
        "scripts": {
            "pack": "build --dir",
            "dist": "build"
        }
    }
    packageJson.appId = _NAME;
    packageJson.iconUrl = "https://torchjs.com/icon.png";

    var PACKAGE_JSON = JSON.stringify(packageJson, null, 4);

    fs.writeFileSync(_BASE_PATH + "/package.json", PACKAGE_JSON);
}
function buildMainJs()
{
    if (_ELECTRON_OR_WEB == "ELECTRON")
    {
        fs.writeFileSync(_BASE_PATH + "/main.js", MAIN_JS);
    }
}
function buildIndexHtml()
{
    fs.writeFileSync(_BASE_PATH + "/index.html", INDEX_HTML);
}
function build()
{
    buildFolders();
    buildGameFile();
    buildPackageJSON();
    buildMainJs();
    buildIndexHtml();
    console.log("[+] Finished Build");
}

console.log(BANNER);
console.log("\n\n\t\t Create a new Project\n\n");
console.log("[ ] Path: ")

stages.push(function(input){
    _PATH = input;

    console.log("[ ] Name: ");
});

stages.push(function(input){
    _NAME = input;

    console.log("[ ] WEBGL or CANVAS graphics: ");
});

stages.push(function(input){
    _GL_OR_CANVAS = input;

    console.log("[ ] ELECTRON or WEB environement: ");
});

stages.push(function(input){
    _ELECTRON_OR_WEB = input;

    console.log("[ ] COFFEE or JS code base: ");
});

stages.push(function(input){
    _COFFEE_OR_JS = input;

    console.log("[!] Building new project...");
    build();
});

stdin.addListener("data", function(d){
    processInput(d.toString().trim());
 });
