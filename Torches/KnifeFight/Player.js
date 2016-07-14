var Player = function(x,y)
{
    this.InitSprite(x,y);
    this.Bind.Texture("player");
}
Player.is(Torch.Sprite).is(Torch.Platformer.Actor);

Player.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    //that.UpdateActor();
}


//create the pixl
var IdleData = [
	'................',
	'...11111111122..',
	'...22222222222..',
	'...13314144122..',
	'...133141441....',
	'...133444441....',
	'...133444441....',
	'...133444441....',
	'...133414141....',
	'...133313131....',
	'...133311131....',
	'...111111111....',
	'....1.....1.....',
	'....1.....1.....',
	'....1.....1.....',
	'..111...111.....',
];
var PlayerPallette =  {
	'1' : 'rgba(0,0,0,255)',
	'2' : 'rgba(255,0,0,255)',
	'3' : 'rgba(128,128,128,255)',
	'4' : 'rgba(255,255,255,255)',
};
Player.IdleUrl = pixl(IdleData, PlayerPallette).src;
