class Load
    constructor: (@game) ->
        @game.Assets =
            game: @game
            GetTexture: (id) -> return @game.Assets.Textures[id]

            GetTexturePack: (id) ->return @game.Assets.TexturePacks[id]

            GetTextureSheet: (id) ->return @game.Assets.TextureSheets[id]

            GetSound: (id) ->return @game.Assets.Sounds[id].audio

        @game.Files = []
        @textures = @game.Assets.Textures = []
        @texturePacks = @game.Assets.TexturePacks = []
        @textureSheets = @game.Assets.TextureSheets = []
        @sound = @game.Assets.Sounds = []
        @Stack = []
        @finish_stack = 0
        @loaded = false
        @loadLog = ""

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
