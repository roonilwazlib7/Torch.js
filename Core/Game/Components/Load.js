// Generated by CoffeeScript 1.11.1
(function() {
  var Load;

  Load = (function() {
    function Load(game) {
      this.game = game;
      this.game.Assets = {
        game: this.game,
        GetTexture: function(id) {
          return this.game.Assets.Textures[id];
        },
        GetTexturePack: function(id) {
          return this.game.Assets.TexturePacks[id];
        },
        GetTextureSheet: function(id) {
          return this.game.Assets.TextureSheets[id];
        },
        GetSound: function(id) {
          return this.game.Assets.Sounds[id].audio;
        }
      };
      this.game.Files = [];
      this.textures = this.game.Assets.Textures = [];
      this.texturePacks = this.game.Assets.TexturePacks = [];
      this.textureSheets = this.game.Assets.TextureSheets = [];
      this.sound = this.game.Assets.Sounds = [];
      this.audio = this.game.Assets.Audio = [];
      this.Stack = [];
      this.finish_stack = 0;
      this.progress = 0;
      this.loaded = false;
      this.loadLog = "";
    }

    Load.prototype.Sound = function(path, id) {
      if (this.sound[id]) {
        Torch.Error("Asset ID '" + id + "' already exists");
      }
      this.Stack.push({
        _torch_asset: "sound",
        id: id,
        path: path
      });
      return this.finish_stack++;
    };

    Load.prototype.Audio = function(path, id) {
      if (this.audio[id]) {
        Torch.Error("Asset ID '" + id + "' already exists");
      }
      this.Stack.push({
        _torch_asset: "audio",
        id: id,
        path: path
      });
      return this.finish_stack++;
    };

    Load.prototype.Texture = function(path, id) {
      var i, k, len, p, results;
      if (typeof path === "string") {
        this.Stack.push({
          _torch_asset: "texture",
          id: id,
          path: path
        });
        return this.finish_stack++;
      } else {
        results = [];
        for (i = k = 0, len = path.length; k < len; i = ++k) {
          p = path[i];
          results.push(this.Texture(path[i][0], path[i][1]));
        }
        return results;
      }
    };

    Load.prototype.PixlTexture = function(pattern, pallette, id) {
      var imSrc;
      imSrc = pixl(pattern, pallette).src;
      return this.Stack.push({
        _torch_asset: "texture",
        id: id,
        path: imSrc
      });
    };

    Load.prototype.TexturePack = function(path, id, range, fileType) {
      var i, pack, packId, packPath;
      pack = [];
      i = 1;
      while (i <= range) {
        packPath = path + "_" + i.toString() + "." + fileType;
        packId = id + "_" + i.toString();
        this.Stack.push({
          _torch_asset: "texture",
          id: packId,
          path: packPath
        });
        pack.push(packId);
        this.finish_stack++;
        i++;
      }
      return this.texturePacks[id] = pack;
    };

    Load.prototype.TextureSheet = function(path, id, totalWidth, totalHeight, clipWidth, clipHeight) {
      var columns, i, j, rows, sheet, sheetClip;
      totalWidth += clipWidth;
      rows = totalHeight / clipHeight;
      columns = totalWidth / clipWidth;
      sheet = [];
      this.Stack.push({
        _torch_asset: "texture",
        id: id,
        path: path
      });
      i = j = 0;
      while (i < columns) {
        while (j < rows) {
          sheetClip = {
            clipX: i * clipWidth,
            clipY: j * clipHeight,
            clipWidth: clipWidth,
            clipHeight: clipHeight
          };
          sheet.push(sheetClip);
          j++;
        }
        i++;
      }
      return this.textureSheets[id] = sheet;
    };

    Load.prototype.File = function(path, id) {
      this.finish_stack++;
      return this.Stack.push({
        _torch_asset: "file",
        id: id,
        path: path
      });
    };

    Load.prototype.LoadItemFinished = function() {
      var timeToLoad;
      this.finish_stack--;
      this.progress = (this.totalLoad - this.finish_stack) / this.totalLoad;
      this.game.Emit("LoadProgressed", new Torch.Event(this.game, {
        progress: this.progress
      }));
      if (this.finish_stack <= 0) {
        document.getElementsByClassName("font-loader")[0].remove();
        this.loadFinished();
        timeToLoad = (new Date().getTime() - this.startTime) / 1000;
        return console.log("%c" + this.game.name + " loaded in " + timeToLoad + "s", "background-color:green; color:white; padding:2px;padding-right:5px;padding-left:5px");
      }
    };

    Load.prototype.Load = function(finishFunction) {
      var aud, e, im, k, len, loader, ref, results, stackItem, textureLoader;
      textureLoader = new THREE.TextureLoader();
      this.loadFinished = finishFunction;
      this.totalLoad = this.finish_stack;
      this.startTime = new Date().getTime();
      try {
        ref = this.Stack;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          stackItem = ref[k];
          switch (stackItem._torch_asset) {
            case "texture":
              im = new Image();
              im.src = stackItem.path;
              stackItem.image = im;
              this.textures[stackItem.id] = stackItem;
              im.refId = stackItem.id;
              im.stackItem = stackItem;
              im.loader = this;
              results.push(im.onload = function() {
                var texture;
                this.loader.textures[this.stackItem.id].width = this.width;
                this.loader.textures[this.stackItem.id].height = this.height;
                texture = textureLoader.load(this.src);
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                this.loader.textures[this.stackItem.id].gl_texture = texture;
                return this.loader.LoadItemFinished();
              });
              break;
            case "sound":
              aud = new Audio();
              aud.src = stackItem.path;
              stackItem.audio = aud;
              this.sound[stackItem.id] = stackItem;
              this.LoadItemFinished();
              results.push(aud.toggle = function() {
                this.currentTime = 0;
                return this.play();
              });
              break;
            case "audio":
              loader = new Torch.AjaxLoader(this.audio[stackItem.id].url, Torch.AjaxData.ArrayBuffer);
              loader.Finish((function(_this) {
                return function(data) {
                  _this.audio[stackItem.id].encodedAudioData = data;
                  return _this.game.Audio.DecodeAudioData(data, function(buffer) {
                    _this.audio[stackItem.id].audioData = buffer;
                    return _this.LoadItemFinished();
                  });
                };
              })(this));
              results.push(loader.Load());
              break;
            case "file":
              if (!Torch.ELECTRON) {
                loader = new Torch.AjaxLoader(this.audio[stackItem.id].url, Torch.AjaxData.Text);
                loader.Finish((function(_this) {
                  return function() {
                    _this.LoadItemFinished();
                    return _this.game.Files[stackItem.id] = data;
                  };
                })(this));
                results.push(loader.Load());
              } else {
                results.push(Torch.fs.readFile(stackItem.path, 'utf8', (function(_this) {
                  return function(er, data) {
                    _this.LoadItemFinished();
                    if (er) {
                      return _this.game.FatalError(new Error("Torch.Load.File file '{0}' could not be loaded".format(stackItem.path)));
                    } else {
                      return _this.game.Files[stackItem.id] = data;
                    }
                  };
                })(this)));
              }
              break;
            default:
              results.push(void 0);
          }
        }
        return results;
      } catch (error) {
        e = error;
        console.log("%c" + this.game.name + " could not load!", "background-color:" + Torch.Color.Ruby + "; color:white; padding:2px;padding-right:5px;padding-left:5px");
        return Torch.FatalError(e);
      }
    };

    return Load;

  })();

  Torch.Load = Load;

}).call(this);
