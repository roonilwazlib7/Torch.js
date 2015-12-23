(function(){

	var Animation = new Class(function(game)
	{
		;"Animation";
		this.game = game;
	});

	Animation.Prop("Run", function()
	{
		var that = this;
		if (that.animating)
		{
			that.Update();
			//that.boundObject.DrawTexture = that.GetCurrentFrame();
		}
		if (that.hasRun && that.KillOnFirstRun)
		{
			that.Stop();
			var cleanedAnims = [];
			for (var i = 0; i < Torch.animations.length; i++)
			{
				if (i == that.animationPosition)
				{

				}
				else
				{
					cleanedAnims.push(Torch.Animation.animations[i]);
				}
			}
			Torch.animations = cleanedAnims;
		}
	});

	Animation.Prop("Start", function()
	{
		var that = this;
		that.animating = true;
	});

	Animation.Prop("Stop", function()
	{
		var that = this;
		that.animating = false;
	});

	Animation.Prop("Single", function()
	{
		var that = this;
		this.KillOnFirstRun = true;
		this.animating = true;
	});

	Animation.Prop("Reset", function()
	{
		var that = this;
		that.elapsedTime = 0;
		that.textureListIndex = 0;
		this.hasRun = false;
	});

	Torch.Animation = Animation;

})();

(function()
{

    var TexturePack = new Class(function(texturePack, game)
    {
        ;"TextureList";
        this.step = 50;
        this.maxIndex = texturePack.length - 1;
        this.textureIndex = 0;
        this.texturePack = texturePack;
		this.game = game;
		this.elapsedTime = 0;
        game.animations.push(this);
    });

    TexturePack.Inherits(Torch.Animation);

    TexturePack.Prop("Update", function()
    {
        var that = this;
        that.elapsedTime += game.deltaTime;

        if (that.elapsedTime >= that.step)
        {
            that.elapsedTime = 0;
            that.textureIndex++;
        }
        if (that.textureIndex > that.maxIndex)
        {
            that.textureIndex = 0;
        }
    });

    TexturePack.Prop("GetCurrentFrame", function()
    {
        var that = this;
        return game.Assets.Textures[that.texturePack[that.textureIndex]];
    });

    Torch.Animation.TexturePack = TexturePack;

})();

(function()
{

    var TextureSheet = new Class(function(TextureSheet, game)
    {
        ;"TextureList";
        this.step = 50;
        this.maxIndex = TextureSheet.length - 1;
        this.textureIndex = 0;
        this.TextureSheet = TextureSheet;
		this.game = game;
		this.elapsedTime = 0;
        game.animations.push(this);
    });

    TextureSheet.Inherits(Torch.Animation);

    TextureSheet.Prop("Update", function()
    {
        var that = this;
        that.elapsedTime += game.deltaTime;

        if (that.elapsedTime >= that.step)
        {
            that.elapsedTime = 0;
            that.textureIndex++;
        }
        if (that.textureIndex > that.maxIndex)
        {
            that.textureIndex = 0;
        }
    });

    TextureSheet.Prop("GetCurrentFrame", function()
    {
        var that = this;
		return that.TextureSheet[that.textureIndex];
    });

    Torch.Animation.TextureSheet = TextureSheet;

})();
