var torchStats = {};
torchStats.Mouse = new Torch.Text("", 15, 680, {font : "16px Consolas" , fillStyle : "black"});
torchStats.Viewport = new Torch.Text("", 15, 700, {font : "16px Consolas" , fillStyle : "black"});
torchStats.DT = new Torch.Text("", 500, 680, {font : "16px Consolas" , fillStyle : "black"});
torchStats.FPS = new Torch.Text("", 500, 700, {font : "16px Consolas" , fillStyle : "black"});
torchStats.Zoom = new Torch.Text("", 945, 700, {font : "16px Consolas" , fillStyle : "black"});

torchStats.Mouse.Fix();
torchStats.Viewport.Fix();
torchStats.DT.Fix();
torchStats.FPS.Fix();
torchStats.Zoom.Fix();

/*
*   Create a new Torch game on the canvas with the id 'canvas'
*   set the width of the canvas to 1280
*   set the height of the canvas to 720
*   name the game 'samplegame'
*/
var game = new Torch.Game("canvas", 1280, 720, "samplegame");

/*
*   Load all the assets for the game here
*   all assets are loaded before the game runs
*   and can be accessed by their ids like so:
*
*   game.Assets.GetTexture(id)
*   game.Assets.GetTexturePack(id)
*   game.Assets.GetTextureSheet(id)
*
*   game.Assets.GetSound(id)
*/
function Load()
{
    //Load a basic texture with the id test
    game.Load.Texture("images/test.png", "test");
    game.Load.Texture("images/torch_logo.png", "torch");
    //Load a series of textures in the images/sample/sample folder with images sample_1.png, sample_2.png, sample_3.png
    game.Load.TexturePack("images/sample/sample", "sample", 3, "png");
    game.Load.TexturePack("images/blood_pack_1/blood_a/blood_a", "blood", 6, "png");
    game.Load.TexturePack("images/fire/flame_1/flame_a", "fire", 6, "png");
    //Loads a texture sheet with clips 64x64
    game.Load.TextureSheet("images/caveman.png", "caveman", 128, 128, 32, 32);
    game.Load.TextureSheet("images/rat.png", "rat", 256, 64, 64, 64);
}
/*
*   Handle all game logic
*   Torch.Sprite objects have core functionalties that are updated automatically
*/
function Update()
{
    //update some info about Torch
    torchStats.Mouse.text = "MOUSE: (" + game.Mouse.x + "," + game.Mouse.y + ")";
    torchStats.Viewport.text = "VIEWPORT: (" + game.Viewport.x.toString().split(".")[0] + "," + game.Viewport.y.toString().split(".")[0] + ") WIDTH: " + game.Viewport.width + " HEIGHT: " + game.Viewport.height;
    torchStats.DT.text = "DT: " + game.deltaTime.toString().split(".")[0];
    torchStats.FPS.text = "FPS: " + game.fps.toString().split(".")[0];
    torchStats.Zoom.text = "ZOOM: " + game.zoom;
}
/*
*   Handle all graphical logic
*   all Torch.Sprite objects are automatically drawn
*/
function Draw()
{

}
/*
*   Initialize all objects
*   this function is called once after Load but before the game runs
*/
function Init()
{
    //Torch.Text pretty simple text object
    var bloodText = new Torch.Text("(Sprite)(TexturePack)", 100, 350, {font : "16px Consolas" , fillStyle : "black"});
    var fireText = new Torch.Text("(Sprite)(TexturePack)", 100, 650, {font : "16px Consolas" , fillStyle : "black"});
    var cavemanText = new Torch.Text("(Sprite)(TextureSheet)", 1050, 150, {font : "16px Consolas" , fillStyle : "black"});
    var ratText = new Torch.Text("(Sprite)(TextureSheet)", 1050, 440, {font : "16px Consolas" , fillStyle : "black"});
    var logoText = new Torch.Text("(Sprite)(Texture)(DragDrop)", 550, 500, {font : "16px Consolas" , fillStyle : "black"});

    //Torch.Sprite
    //the core of Torch, sprites pretty much encompase all visible game objects
    //sprites can be bound to a single texture, a texture pack, or texture sheet
    //texture packs and texture sheets are animated automatically, and can be stopped / started
    //sprites can switch what they are bound to throughout the course of the game
    //
    //first, make a Torch.Sprite object and give it a starting point, then add it to the game
    //all texture binding should take place after the sprite is added to the game

    //Initialize some sprites
    var logo = new Torch.Sprite(0, 0);
    var blood = new Torch.Sprite(-150, -150);
    var fire = new Torch.Sprite(-150, 250);
    var caveman = new Torch.Sprite(1050, 100);
    var rat = new Torch.Sprite(1050, 350);

    //add the sprites to the game
    game.Add(logo);
    game.Add(blood);
    game.Add(fire);
    game.Add(caveman);
    game.Add(rat);

    //add text to the game
    game.Add(bloodText);
    game.Add(fireText);
    game.Add(cavemanText);
    game.Add(ratText);
    game.Add(logoText);

    //add the torch info to the game
    game.Add(torchStats.Mouse);
    game.Add(torchStats.Viewport);
    game.Add(torchStats.DT);
    game.Add(torchStats.FPS);
    game.Add(torchStats.Zoom);

    //bind to a single texture
    logo.Bind.Texture("torch");
    game.World.Center(logo);
    //add some controls to the sprite, in this case, a drag and drop control
    Torch.Controls.Bind(logo, "DragDrop", {bringToTop: true, stayOnTop: true});
    //bind to a texture pack
    blood.Bind.TexturePack("blood");
    //bind to a texture pack and change the animation speed with 'step'
    fire.Bind.TexturePack("fire", {step: 100});
    //bind to a texture sheet
    caveman.Bind.TextureSheet("caveman");
    //bind to a texture sheet and change the animation speed with step
    rat.Bind.TextureSheet("rat", {step:500});
    //add some basic movement controls to the sprite
    Torch.Controls.Bind(rat, "WASD");
    //make the vieport follow the sprite as it moves
    game.Viewport.Follow(rat);
}




game.Start(Load, Update, Draw, Init);
