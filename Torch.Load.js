Torch.Load = function(game)
{
    this.game = game;
    this.game.Assets = {
        game: game,
        GetTexture: function(id)
        {
            return this.game.Assets.Textures[id];
        },
        GetTexturePack: function(id)
        {
            return this.game.Assets.TexturePacks[id];
        },
        GetTextureSheet: function(id)
        {
            return this.game.Assets.TextureSheets[id];
        },
        GetSound: function(id)
        {
            return this.game.Assets.Sounds[id].audio;
        }
    };
    this.textures = this.game.Assets.Textures = [];
    this.texturePacks = this.game.Assets.TexturePacks = [];
    this.textureSheets = this.game.Assets.TextureSheets = [];
    this.sound = this.game.Assets.Sounds = [];
    this.Stack = [];
    this.finish_stack = 0;
    this.loaded = false;
    this.loadLog = "";

};
Torch.Load.prototype.Sound = function(path, id)
{
    var that = this;
    if (that.sound[id])
    {
        Torch.Error("Asset ID '" + id + "' already exists");
    }
    that.Stack.push({
        _torch_asset: "sound",
        id: id,
        path: path
    });
    that.finish_stack++;
}
Torch.Load.prototype.Texture = function(path, id)
{
    var that = this;

    if (that.textures[id])
    {
        Torch.Error("Asset ID '" + id + "' already exists");
    }

    that.Stack.push({
        _torch_asset: "texture",
        id: id,
        path: path
    });
    that.finish_stack++;
};
Torch.Load.prototype.TexturePack = function(path, id, range, fileType)
{
    var that = this;
    var pack = [];
    for (var i = 1; i <= range; i++)
    {
        var packPath = path + "_" + i.toString() + "." + fileType;
        var packId = id + "_" + i.toString();

        that.Stack.push({
            _torch_asset: "texture",
            id: packId,
            path: packPath
        });

        pack.push(packId);

        that.finish_stack++;
    }
    that.texturePacks[id] = pack;
};
Torch.Load.prototype.TextureSheet = function(path, id, totalWidth, totalHeight, clipWidth, clipHeight)
{
    var that = this;
    var rows = totalHeight / clipHeight;
    var columns = totalWidth / clipWidth;
    var sheet = [];

    that.Stack.push({
        _torch_asset: "texture",
        id: id,
        path: path
    });

    for (var i = 0; i < columns; i++)
    {
        for (var j = 0; j < rows; j++)
        {
            var sheetClip = {
                clipX: i * clipWidth,
                clipY: j * clipHeight,
                clipWidth: clipWidth,
                clipHeight: clipHeight
            };
            sheet.push(sheetClip);
        }
    }
    that.textureSheets[id] = sheet;
};
//sound, sound pack ?
Torch.Load.prototype.Load = function(finishFunction)
{
    var that = this;
    for (var i = 0; i < that.Stack.length; i++)
    {
        switch(that.Stack[i]._torch_asset)
        {
            case "texture":
                var im = new Image();
                im.src = that.Stack[i].path;

                that.Stack[i].image = im;

                that.textures[that.Stack[i].id] = that.Stack[i];

                im.refId = that.Stack[i].id;

                im.onload = function()
                {
                    that.textures[this.refId].width = this.width;
                    that.textures[this.refId].height = this.height;
                    that.finish_stack--;
                    console.log(this);
                }
            break;
            case "sound":
                var aud = new Audio();
                aud.src = that.Stack[i].path;
                that.Stack[i].audio = aud;
                that.sound[that.Stack[i].id] = that.Stack[i];
                console.log(that.sound[that.Stack[i].id]);
                that.finish_stack--;
                aud.toggle = function(){
                    var that = this;
                    that.currentTime = 0;
                    that.play();
                }
            break;
        }

    }
    _l = setInterval(function()
    {
        if (that.finish_stack <= 0)
        {
            finishFunction();
            clearInterval(_l);
        }
    }, 1000/60);
}
