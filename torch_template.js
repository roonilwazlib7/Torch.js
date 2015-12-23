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


var game = new Torch.Game("canvas", 1280, 720, "samplegame");

function Load()
{
    game.Load.Texture("images/test.png", "test");
    game.Load.Texture("images/torch_logo.png", "torch");
    game.Load.TexturePack("images/sample/sample", "sample", 3, "png");
    game.Load.TexturePack("images/blood_pack_1/blood_a/blood_a", "blood", 6, "png");
    game.Load.TexturePack("images/fire/flame_1/flame_a", "fire", 6, "png");
    game.Load.TextureSheet("images/caveman.png", "caveman", 128, 128, 32, 32);
    game.Load.TextureSheet("images/rat.png", "rat", 256, 64, 64, 64);
}
function Update()
{
    torchStats.Mouse.text = "MOUSE: (" + game.Mouse.x + "," + game.Mouse.y + ")";
    torchStats.Viewport.text = "VIEWPORT: (" + game.Viewport.x.toString().split(".")[0] + "," + game.Viewport.y.toString().split(".")[0] + ") WIDTH: " + game.Viewport.width + " HEIGHT: " + game.Viewport.height;
    torchStats.DT.text = "DT: " + game.deltaTime.toString().split(".")[0];
    torchStats.FPS.text = "FPS: " + game.fps.toString().split(".")[0];
    torchStats.Zoom.text = "ZOOM: " + game.zoom;
}
function Draw()
{

}
function Init()
{
    var bloodText = new Torch.Text("(Sprite)(TexturePack)", 100, 350, {font : "16px Consolas" , fillStyle : "black"});
    var fireText = new Torch.Text("(Sprite)(TexturePack)", 100, 650, {font : "16px Consolas" , fillStyle : "black"});
    var cavemanText = new Torch.Text("(Sprite)(TextureSheet)", 1050, 150, {font : "16px Consolas" , fillStyle : "black"});
    var ratText = new Torch.Text("(Sprite)(TextureSheet)", 1050, 440, {font : "16px Consolas" , fillStyle : "black"});
    var logoText = new Torch.Text("(Sprite)(Texture)(DragDrop)", 550, 500, {font : "16px Consolas" , fillStyle : "black"});

    var logo = new Torch.Sprite(0, 0);
    var blood = new Torch.Sprite(-150, -150);
    var fire = new Torch.Sprite(-150, 250);
    var caveman = new Torch.Sprite(1050, 100);
    var rat = new Torch.Sprite(1050, 350);

    game.Add(logo);
    game.Add(blood);
    game.Add(fire);
    game.Add(caveman);
    game.Add(rat);

    game.Add(bloodText);
    game.Add(fireText);
    game.Add(cavemanText);
    game.Add(ratText);
    game.Add(logoText);

    game.Add(torchStats.Mouse);
    game.Add(torchStats.Viewport);
    game.Add(torchStats.DT);
    game.Add(torchStats.FPS);
    game.Add(torchStats.Zoom);

    logo.Bind.Texture("torch");
    game.World.Center(logo);
    Torch.Controls.Bind(logo, "DragDrop", {bringToTop: true, stayOnTop: true});

    blood.Bind.TexturePack("blood");
    fire.Bind.TexturePack("fire", {step: 100});

    caveman.Bind.TextureSheet("caveman");

    rat.Bind.TextureSheet("rat", {step:500});
    Torch.Controls.Bind(rat, "WASD");
}




game.Start(Load, Update, Draw, Init);
