(function()
{
    var Load = new Class(function(game)
    {
        ;"Load";
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

            },
        };
        this.textures = this.game.Assets.Textures = [];
        this.texturePacks = this.game.Assets.TexturePacks = [];
        this.textureSheets = this.game.Assets.TextureSheets = [];
        this.sound = this.game.Assets.Sounds = [];
        this.Stack = [];
    });

    Load.Prop("finish_stack", 0);
    Load.Prop("loaded", false);
    Load.Prop("loadLog", "");
    Load.Prop("Stack", []);

    Load.Prop("Texture", function(path, id)
    {
        var that = this;

        if (that.textures[id])
        {
            new TorchError("Asset ID '" + id + "' already exists");
        }

        that.Stack.push({
            _torch_asset: "texture",
            id: id,
            path: path
        });
        that.finish_stack++;
    });
    Load.Prop("TexturePack", function(path, id, range, fileType)
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
    });

    Load.Prop("TextureSheet", function(path, id, totalWidth, totalHeight, clipWidth, clipHeight)
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
    });

    Load.Prop("Sound", function(path, id){});
    Load.Prop("SoundPack", function(path, id, range){});

    Load.Prop("Load", function(finishFunction)
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

    });

    Torch.Load = Load;

})();
