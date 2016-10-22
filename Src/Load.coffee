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

    Sound: (path, id) ->

        if @sound[id]
            Torch.Error("Asset ID '" + id + "' already exists")

        @Stack.push
            _torch_asset: "sound"
            id: id
            path: path

        @finish_stack++;

    Texture: (path, id) ->
        if typeof(path) is "string"

            @Stack.push
                _torch_asset: "texture"
                id: id
                path: path
            @finish_stack++

        else
            for p,i in path
                @Texture(path[i][0], path[i][1]);

    PixlTexture: (pattern, pallette, id) ->
        imSrc = pixl(pattern, pallette).src
        @Stack.push
            _torch_asset: "texture"
            id: id
            path: imSrc

    TexturePack: (path, id, range, fileType) ->
        pack = []
        i = 1 # this might be the bug
        while i <= range
            packPath = path + "_" + i.toString() + "." + fileType
            packId = id + "_" + i.toString()

            @Stack.push
                _torch_asset: "texture"
                id: packId
                path: packPath

            pack.push(packId)

            @finish_stack++;
            i++

        @texturePacks[id] = pack;

    TextureSheet: (path, id, totalWidth, totalHeight, clipWidth, clipHeight) ->
        totalWidth += clipWidth
        rows = totalHeight / clipHeight
        columns = totalWidth / clipWidth
        sheet = []

        @Stack.push
            _torch_asset: "texture"
            id: id
            path: path

        i = j = 0

        while i < columns

            while j < rows
                sheetClip =
                    clipX: i * clipWidth
                    clipY: j * clipHeight
                    clipWidth: clipWidth
                    clipHeight: clipHeight
                sheet.push(sheetClip)

                j++
            i++

        @textureSheets[id] = sheet;

    File: (path, id) -> # should change this to load syncronously
        if not Torch.fs
            @game.FatalError(new Error("Torch.Load.File file '{0}' cannot be loaded, you must import Torch.Electron".format(path)))

        @finish_stack++

        Torch.fs.readFile path, 'utf8', (er, data) =>
            @finish_stack--
            if (er)
                @game.FatalError(new Error("Torch.Load.File file '{0}' could not be loaded".format(path)))
            else
                @game.Files[id] = data

    # sound, sound pack ?
    Load: (finishFunction) ->
        TIME_TO_LOAD = 0
        for stackItem in @Stack

            switch stackItem._torch_asset

                when "texture"
                    im = new Image()
                    im.src = stackItem.path

                    stackItem.image = im

                    @textures[stackItem.id] = stackItem

                    im.refId = stackItem.id

                    im.onload = =>
                        @textures[stackItem.id].width = this.width
                        @textures[stackItem.id].height = this.height
                        @finish_stack--

                when "sound"
                    aud = new Audio()
                    aud.src = stackItem.path
                    stackItem.audio = aud
                    @sound[stackItem.id] = stackItem
                    @finish_stack--
                    aud.toggle = ->
                        @currentTime = 0
                        @play()


        _i = =>
            TIME_TO_LOAD++
            if @finish_stack <= 0
                $(".font-loader").remove()
                finishFunction()
                clearInterval(_l)

        _l = setInterval(_i, 1000/60)

Torch.Load = Load
