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
    this.game.Files = [];
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

    if (typeof(path) == "string")
    {
        that.Stack.push({
            _torch_asset: "texture",
            id: id,
            path: path
        });
        that.finish_stack++;
    }
    else
    {
        for (var i = 0; i < path.length; i++)
        {
            that.Texture(path[i][0], path[i][1]);
        }
    }


};
Torch.Load.prototype.PixlTexture = function(pattern, pallette, id)
{
    var that = this;
    var imSrc = pixl(pattern, pallette).src;
    that.Stack.push({
        _torch_asset: "texture",
        id: id,
        path: imSrc
    });
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
    totalWidth += clipWidth;
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
Torch.Load.prototype.File = function(path, id)
{
    var that = this;
    if (!Torch.fs) that.game.FatalError(new Error("Torch.Load.File file '{0}' cannot be loaded, you must import Torch.Electron".format(path)));
    that.finish_stack++;
    Torch.fs.readFile(path, 'utf8', function(er, data)
    {
        that.finish_stack--;
        if (er)
        {
            that.game.FatalError(new Error("Torch.Load.File file '{0}' could not be loaded".format(path)));
        }
        else
        {
            that.game.Files[id] = data;
        }
    });
};
Torch.Load.prototype.AssetFile = function(path)
{
    var that = this;
    //should probably check for electron here
    that.finish_stack++;
    Torch.fs.readFile(path, 'utf8', function(er, data)
    {
        if (er)
        {
            that.game.FatalError("Torch.Load.AssetFile file '{0}' could not be loaded due to: ".format(path) + er);
        }
        else
        {
            var lines = data.split("\n");
            for (var i = 0; i < lines.length; i++)
            {
                var line = lines[i];
                var info = line.split(" ");
                var assetType = info[0];
                var assetPath = info[1]
                var assetId = info[2];
                var totalWidth = info[3];
                var totalHeight = info[4];
                var clipWidth = info[5];
                var clipHeight = info[6];
                switch (assetType)
                {
                    case "texture":
                    that.Texture(assetPath, assetId);
                    break;
                    case "texture_sheet":
                    that.Texture(assetPath, assetId, parseInt(totalWidth), parseInt(totalHeight), parseInt(clipWidth), parseInt(clipHeight));
                    break;
                }
            }
            that.finish_stack--;
        }
    });

}
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
                }
            break;
            case "sound":
                var aud = new Audio();
                aud.src = that.Stack[i].path;
                that.Stack[i].audio = aud;
                that.sound[that.Stack[i].id] = that.Stack[i];
                that.finish_stack--;
                aud.toggle = function(){
                    var that = this;
                    that.currentTime = 0;
                    that.play();
                }
            break;
        }

    }
    var TIME_TO_LOAD = 0;
    _l = setInterval(function()
    {
        TIME_TO_LOAD++
        if (that.finish_stack <= 0)
        {
            $(".font-loader").remove();
            finishFunction();
            clearInterval(_l);

        }
    }, 1000/60);
}
