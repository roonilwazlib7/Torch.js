Torch.Animation = function(game)
{
	this.game = game;
};
Torch.Animation.prototype.Run = function()
{
	var that = this;
	if (that.animating)
	{
		that.Update();
	}
	if (that.Kill && that.hasRun)
	{
		that.Stop();
	}
};
Torch.Animation.prototype.Start = function()
{
	var that = this;
	that.animating = true;
}
Torch.Animation.prototype.Stop = function()
{
	var that = this;
	that.animating = false;
};
Torch.Animation.prototype.Single = function()
{
	var that = this;
	this.KillOnFirstRun = true;
	this.animating = true;
};
Torch.Animation.prototype.Reset = function()
{
	var that = this;
	that.elapsedTime = 0;
	that.textureListIndex = 0;
	this.hasRun = false;
};
/*
		Torch.Animation.TexturePack
*/
Torch.Animation.TexturePack = function(texturePack, game)
{
	this.step = 50;
	this.maxIndex = texturePack.length - 1;
	this.textureIndex = 0;
	this.texturePack = texturePack;
	this.game = game;
	this.elapsedTime = 0;
	game.animations.push(this);
}
Torch.Animation.TexturePack.is(Torch.Animation);
Torch.Animation.TexturePack.prototype.Update = function()
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
		if (!that.Kill) that.textureIndex = 0;
		if (that.Kill) that.textureIndex = -1;
		that.hasRun = true;
	}
}
Torch.Animation.TexturePack.prototype.GetCurrentFrame = function()
{
	var that = this;
	return game.Assets.Textures[that.texturePack[that.textureIndex]];
};
/*
	Torch.Animation.TextureSheet
*/
Torch.Animation.TextureSheet = function(TextureSheet, game)
{
	this.step = 50;
	this.maxIndex = TextureSheet.length - 1;
	this.textureIndex = 0;
	this.TextureSheet = TextureSheet;
	this.game = game;
	this.elapsedTime = 0;
	this.delay = 0;
	this.delayCount = 0;
	game.animations.push(this);
};
Torch.Animation.TextureSheet.is(Torch.Animation);
Torch.Animation.TextureSheet.prototype.Update = function()
{
	var that = this;
	that.elapsedTime += that.game.deltaTime;

	if (that.elapsedTime >= that.step && ! (that.hasRun && that.Kill) )
	{
		that.elapsedTime = 0;
		that.textureIndex++;
	}
	if (that.textureIndex >= that.maxIndex && that.delayCount <= 0)
	{
		if (!that.Kill) that.textureIndex = 0;
		//if (that.Kill) that.textureIndex = that.TextureSheet.length - 1;
		//that.TextureSheet = null;
		that.hasRun = true;
		if (that.finishCallBack) that.finishCallBack();
		that.delayCount = that.delay;
	}
	else if (that.textureIndex >= that.maxIndex)
	{
		that.delayCount -= Game.deltaTime;
		that.textureIndex--;
	}
};
Torch.Animation.TextureSheet.prototype.GetCurrentFrame = function()
{
	var that = this;
	if (that.TextureSheet)
	{
		return that.TextureSheet[that.textureIndex];
	}
};


Torch.Animation.StepAnimation = function(game, totalTime, steps, start, end)
{
	this.InitSprite(game, 0, 0);
	this.steps = steps;
	this.totalTime = totalTime;
	this.interval = totalTime / steps.length;
	this.time = 0;
	this.index = 0;
	this.steps[0]();
	this.start = start;
	this.end = end;
	if (start) this.start();
}
Torch.Animation.StepAnimation.is(Torch.GhostSprite);

Torch.Animation.StepAnimation.prototype.Update = function()
{
	var that = this;
	that.time += that.game.deltaTime;
	if (that.time >= that.interval)
	{
		that.time = 0;
		that.index++;
		that.steps[that.index]();
		if (that.index == that.steps.length - 1)
		{
			if (that.end) that.end();
			that.Trash();
		}
	}
}
