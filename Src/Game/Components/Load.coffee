class Load
    @MixIn EventDispatcher

    constructor: (@game) ->
        @InitEventDispatch()
        @game.Assets =
            game: @game
            GetTexture: (id) -> return @game.Assets.Textures[id]

            GetTexturePack: (id) ->return @game.Assets.TexturePacks[id]

            GetTextureSheet: (id) ->return @game.Assets.TextureSheets[id]

            GetSound: (id) ->return @game.Assets.Sounds[id].audio

            GetVideo: (id) -> return @game.Assets.Video[id]

        @game.Files = {}
        @textures = @game.Assets.Textures = {}
        @texturePacks = @game.Assets.TexturePacks = {}
        @textureSheets = @game.Assets.TextureSheets = {}
        @sound = @game.Assets.Sounds = {}
        @audio = @game.Assets.Audio = {}
        @video = @game.Assets.Video = {}
        @Stack = []
        @finish_stack = 0
        @progress = 0
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

    Audio: (path, id) ->

        if @audio[id]
            Torch.Error("Asset ID '" + id + "' already exists")

        @Stack.push
            _torch_asset: "audio"
            id: id
            path: path

        @finish_stack++

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

    Video: (path, id) ->
        @Stack.push
            _torch_asset: "video"
            id: id
            path: path
        @finish_stack++

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

    File: (path, id) ->
        @finish_stack++
        @Stack.push
            _torch_asset: "file"
            id: id
            path: path

    LoadItemFinished: ->
        @finish_stack--

        @progress = (@totalLoad - @finish_stack) / @totalLoad

        # could potentially listen in to update some sort of loading
        # bar
        @game.Emit "LoadProgressed", new Torch.Event @game,
            progress: @progress

        if @finish_stack <= 0
            # load has finished
            document.getElementsByClassName("font-loader")[0].remove()

            @loadFinished()

            timeToLoad = (new Date().getTime() - @startTime) / 1000

            # successful load
            console.log("%c#{@game.name} loaded in #{timeToLoad}s", "background-color:green; color:white; padding:2px;padding-right:5px;padding-left:5px")

    Load: (finishFunction) ->
        @loadFinished = finishFunction
        @totalLoad = @finish_stack
        @startTime = new Date().getTime()

        try
            for stackItem in @Stack

                switch stackItem._torch_asset

                    when "texture"
                        im = new Image()
                        im.src = stackItem.path
                        # TODO:
                        # write a wrapper around the image called Texture
                        stackItem.image = im

                        @textures[stackItem.id] = stackItem

                        im.refId = stackItem.id
                        im.stackItem = stackItem
                        im.loader = this

                        im.onload = ->
                            this.loader.textures[this.stackItem.id].width = this.width
                            this.loader.textures[this.stackItem.id].height = this.height

                            this.loader.LoadItemFinished()

                    when "video"
                        video = document.createElement("video")
                        video.src = stackItem.path

                        # TODO:
                        # Write a wrapper around the video
                        @video[stackItem.id] = video

                        video.oncanplay = =>
                            @LoadItemFinished()

                    when "sound"
                        aud = new Audio()
                        aud.src = stackItem.path
                        stackItem.audio = aud
                        @sound[stackItem.id] = stackItem
                        @LoadItemFinished()
                        aud.toggle = ->
                            @currentTime = 0
                            @play()

                    when "audio"
                        loader = new Torch.AjaxLoader(stackItem.path, Torch.AjaxData.ArrayBuffer)
                        loader.stackItem = stackItem
                        loader.Finish (data, loader) =>
                            @audio[loader.stackItem.id] = {}
                            @audio[loader.stackItem.id].encodedAudioData = data
                            @game.Audio.DecodeAudioData data, (buffer) =>
                                @audio[loader.stackItem.id].audioData = buffer
                                @LoadItemFinished()
                        loader.Load()

                    when "file"
                        if not Torch.ELECTRON
                            # @game.FatalError(new Error("Torch.Load.File file '{0}' cannot be loaded, you must import Torch.Electron".format(path)))
                            # load with ajax instead
                            loader = new Torch.AjaxLoader(stackItem.path, Torch.AjaxData.Text)
                            loader.stackItem = stackItem
                            loader.Finish (data, loader) =>
                                @LoadItemFinished()
                                @game.Files[loader.stackItem.id] = data
                            loader.Load()
                        else
                            Torch.fs.readFile stackItem.path, 'utf8', (er, data) =>
                                @LoadItemFinished()
                                if (er)
                                    @game.FatalError(new Error("Torch.Load.File file '{0}' could not be loaded".format(stackItem.path)))
                                else
                                    @game.Files[stackItem.id] = data

        catch e
            console.log("%c#{@game.name} could not load!", "background-color:#{Color.Ruby}; color:white; padding:2px;padding-right:5px;padding-left:5px")
            Torch.FatalError(e)
