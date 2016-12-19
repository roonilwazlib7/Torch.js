// Generated by CoffeeScript 1.12.1
(function() {
  var Draw, Init, Load, SetUpConsoleCommands, Update, zeldroid;

  Torch.StrictErrors();

  Torch.DumpErrors();

  zeldroid = new Torch.Game("container", "fill", "fill", "Zeldroid", Torch.CANVAS);

  zeldroid.GetScale = function() {
    return zeldroid.Camera.Viewport.width / 480;
  };

  Load = function(game) {
    Player.Load(game);
    HUD.Load(game);
    MapPieces.MapPiece.Load(game);
    Enemy.Load(game);
    game.Load.Texture("Assets/Art/particle.png", "particle");
    game.Load.Texture("Assets/Art/line.png", "line");
    game.Load.File("Maps/test-map-2.map", "map-1");
    game.Load.File("package.json", "package");
    game.Load.Audio("Assets/Audio/shoot.wav", "shoot");
    game.Load.Audio("Assets/Audio/shoot-explode.wav", "shoot-explode");
    return game.On("LoadProgressed", function(event) {});
  };

  Init = function(game) {
    var color, stopText;
    game.Clear("#00AF11");
    game.PixelScale();
    Torch.Scale = 4;
    game.backgroundAudioPlayer = game.Audio.CreateAudioPlayer();
    game.player = new Player(game);
    game.mapManager = new MapManager(game);
    color = Torch.Color.Random().GetHtmlString();
    game.circ = new Torch.Shapes.Circle(game, 0, 0, 100, color, color);
    game.circ.drawIndex = 1000;
    game.box = new Torch.Shapes.Box(game, 500, 0, 150, 100, color, color);
    game.box.drawIndex = 1000;
    game.box.Body.omega = 0.001;
    game.poly = new Torch.Shapes.Polygon.Regular(game, 500, 500, 8, 200, "red", "white");
    stopText = new Torch.Text(game, 0, 0, {
      text: "STOP",
      fontSize: 48,
      color: "white"
    });
    game.poly.Grid.Append(stopText);
    stopText.Grid.Center();
    game.lin = new Torch.Shapes.Line(game, 0, 0, 500, 500, "black", {
      lineWidth: 5
    });
    game.lin.fixed = true;
    game.lin.Bind.Texture("line");
    return SetUpConsoleCommands(game);
  };

  Draw = function(game) {};

  Update = function(game) {
    if (game.deltaTime > 1000 / 50) {
      alert("FPS Dipped! " + game.deltaTime);
    }
    if (zeldroid.player != null) {
      return zeldroid.lin.endPosition = zeldroid.player.position.Clone();
    }
  };

  zeldroid.Start({
    Load: Load,
    Update: Update,
    Draw: Draw,
    Init: Init
  });

  window.zeldroid = zeldroid;

  SetUpConsoleCommands = function(game) {
    game.debugCondole = new Torch.DebugConsole(game);
    game.debugCondole.AddCommand("SPAWN", function(tConsole, piece, x, y) {
      var p;
      p = new MapPieces[piece](game, ["0", "0"]);
      p.position.x = parseInt(x);
      p.position.y = parseInt(y);
      tConsole.game.Tweens.Tween(p, 500, Torch.Easing.Smooth).From({
        opacity: 0
      }).To({
        opacity: 1
      });
      return console.log(p);
    });
    return game.debugCondole.AddCommand("UCAM", function(tConsole) {
      var camVelocity, task;
      camVelocity = 1;
      task = {
        _torch_add: "Task",
        Execute: function(game) {
          if (game.Keys.RightArrow.down) {
            game.Camera.position.x -= camVelocity * game.Loop.updateDelta;
          }
          if (game.Keys.LeftArrow.down) {
            game.Camera.position.x += camVelocity * game.Loop.updateDelta;
          }
          if (game.Keys.UpArrow.down) {
            game.Camera.position.y += camVelocity * game.Loop.updateDelta;
          }
          if (game.Keys.DownArrow.down) {
            return game.Camera.position.y -= camVelocity * game.Loop.updateDelta;
          }
        }
      };
      return game.Task(task);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZS5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uIiwic291cmNlcyI6WyJHYW1lc1xcWmVsZHJvaWRcXFNyY1xcR2FtZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUEsTUFBQTs7RUFBQSxLQUFLLENBQUMsWUFBTixDQUFBOztFQUNBLEtBQUssQ0FBQyxVQUFOLENBQUE7O0VBRUEsUUFBQSxHQUFlLElBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxXQUFYLEVBQXdCLE1BQXhCLEVBQWdDLE1BQWhDLEVBQXdDLFVBQXhDLEVBQW9ELEtBQUssQ0FBQyxNQUExRDs7RUFDZixRQUFRLENBQUMsUUFBVCxHQUFvQixTQUFBO0FBQ2hCLFdBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBekIsR0FBaUM7RUFEeEI7O0VBSXBCLElBQUEsR0FBTyxTQUFDLElBQUQ7SUFDSCxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVo7SUFDQSxHQUFHLENBQUMsSUFBSixDQUFTLElBQVQ7SUFDQSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQW5CLENBQXdCLElBQXhCO0lBQ0EsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYO0lBRUEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFWLENBQWtCLHlCQUFsQixFQUE2QyxVQUE3QztJQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBVixDQUFrQixxQkFBbEIsRUFBeUMsTUFBekM7SUFFQSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQVYsQ0FBZSxxQkFBZixFQUFzQyxPQUF0QztJQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBVixDQUFlLGNBQWYsRUFBK0IsU0FBL0I7SUFDQSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQVYsQ0FBZ0Isd0JBQWhCLEVBQTBDLE9BQTFDO0lBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFWLENBQWdCLGdDQUFoQixFQUFrRCxlQUFsRDtXQUVBLElBQUksQ0FBQyxFQUFMLENBQVEs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RHREOztVQUVBLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBdkI7WUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFyQixJQUEwQixXQUFBLEdBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUR0RDs7VUFFQSxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQXJCO1lBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBckIsSUFBMEIsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsWUFEdEQ7O1VBRUEsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUF2QjttQkFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFyQixJQUEwQixXQUFBLEdBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUR0RDs7UUFQSyxDQURUOzthQVVKLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVjtJQWJpQyxDQUFyQztFQVhtQjtBQS9FdkIiLCJzb3VyY2VzQ29udGVudCI6WyJUb3JjaC5TdHJpY3RFcnJvcnMoKVxyXG5Ub3JjaC5EdW1wRXJyb3JzKClcclxuXHJcbnplbGRyb2lkID0gbmV3IFRvcmNoLkdhbWUoXCJjb250YWluZXJcIiwgXCJmaWxsXCIsIFwiZmlsbFwiLCBcIlplbGRyb2lkXCIsIFRvcmNoLkNBTlZBUylcclxuemVsZHJvaWQuR2V0U2NhbGUgPSAtPlxyXG4gICAgcmV0dXJuIHplbGRyb2lkLkNhbWVyYS5WaWV3cG9ydC53aWR0aCAvIDQ4MFxyXG5cclxuXHJcbkxvYWQgPSAoZ2FtZSkgLT5cclxuICAgIFBsYXllci5Mb2FkKGdhbWUpXHJcbiAgICBIVUQuTG9hZChnYW1lKVxyXG4gICAgTWFwUGllY2VzLk1hcFBpZWNlLkxvYWQoZ2FtZSlcclxuICAgIEVuZW15LkxvYWQoZ2FtZSlcclxuXHJcbiAgICBnYW1lLkxvYWQuVGV4dHVyZShcIkFzc2V0cy9BcnQvcGFydGljbGUucG5nXCIsIFwicGFydGljbGVcIilcclxuICAgIGdhbWUuTG9hZC5UZXh0dXJlKFwiQXNzZXRzL0FydC9saW5lLnBuZ1wiLCBcImxpbmVcIilcclxuXHJcbiAgICBnYW1lLkxvYWQuRmlsZShcIk1hcHMvdGVzdC1tYXAtMi5tYXBcIiwgXCJtYXAtMVwiKVxyXG4gICAgZ2FtZS5Mb2FkLkZpbGUoXCJwYWNrYWdlLmpzb25cIiwgXCJwYWNrYWdlXCIpXHJcbiAgICBnYW1lLkxvYWQuQXVkaW8oXCJBc3NldHMvQXVkaW8vc2hvb3Qud2F2XCIsIFwic2hvb3RcIilcclxuICAgIGdhbWUuTG9hZC5BdWRpbyhcIkFzc2V0cy9BdWRpby9zaG9vdC1leHBsb2RlLndhdlwiLCBcInNob290LWV4cGxvZGVcIilcclxuXHJcbiAgICBnYW1lLk9uIFwiTG9hZFByb2dyZXNzZWRcIiwgKGV2ZW50KSAtPlxyXG4gICAgICAgICNjb25zb2xlLmxvZyhldmVudC5wcm9ncmVzcylcclxuXHJcbkluaXQgPSAoZ2FtZSkgLT5cclxuICAgIGdhbWUuQ2xlYXIoXCIjMDBBRjExXCIpXHJcbiAgICBnYW1lLlBpeGVsU2NhbGUoKVxyXG4gICAgVG9yY2guU2NhbGUgPSA0XHJcblxyXG4gICAgZ2FtZS5iYWNrZ3JvdW5kQXVkaW9QbGF5ZXIgPSBnYW1lLkF1ZGlvLkNyZWF0ZUF1ZGlvUGxheWVyKClcclxuXHJcbiAgICBnYW1lLnBsYXllciA9IG5ldyBQbGF5ZXIoZ2FtZSlcclxuICAgIGdhbWUubWFwTWFuYWdlciA9IG5ldyBNYXBNYW5hZ2VyKGdhbWUpXHJcbiAgICAjZ2FtZS5odWQgPSBuZXcgSFVEKGdhbWUpXHJcblxyXG4gICAgY29sb3IgPSBUb3JjaC5Db2xvci5SYW5kb20oKS5HZXRIdG1sU3RyaW5nKClcclxuICAgIGdhbWUuY2lyYyA9IG5ldyBUb3JjaC5TaGFwZXMuQ2lyY2xlKGdhbWUsIDAsIDAsIDEwMCwgY29sb3IsIGNvbG9yKVxyXG4gICAgZ2FtZS5jaXJjLmRyYXdJbmRleCA9IDEwMDBcclxuXHJcbiAgICBnYW1lLmJveCA9IG5ldyBUb3JjaC5TaGFwZXMuQm94KGdhbWUsNTAwLCAwLCAxNTAsIDEwMCwgY29sb3IsIGNvbG9yKVxyXG4gICAgZ2FtZS5ib3guZHJhd0luZGV4ID0gMTAwMFxyXG4gICAgZ2FtZS5ib3guQm9keS5vbWVnYSA9IDAuMDAxXHJcblxyXG4gICAgZ2FtZS5wb2x5ID0gbmV3IFRvcmNoLlNoYXBlcy5Qb2x5Z29uLlJlZ3VsYXIoZ2FtZSwgNTAwLCA1MDAsIDgsIDIwMCwgXCJyZWRcIiwgXCJ3aGl0ZVwiKVxyXG5cclxuICAgIHN0b3BUZXh0ID0gbmV3IFRvcmNoLlRleHQgZ2FtZSwgMCwgMCxcclxuICAgICAgICB0ZXh0OiBcIlNUT1BcIlxyXG4gICAgICAgIGZvbnRTaXplOiA0OFxyXG4gICAgICAgIGNvbG9yOiBcIndoaXRlXCJcclxuXHJcbiAgICBnYW1lLnBvbHkuR3JpZC5BcHBlbmQoc3RvcFRleHQpXHJcbiAgICBzdG9wVGV4dC5HcmlkLkNlbnRlcigpXHJcblxyXG4gICAgZ2FtZS5saW4gPSBuZXcgVG9yY2guU2hhcGVzLkxpbmUoZ2FtZSwgMCwgMCwgNTAwLCA1MDAsIFwiYmxhY2tcIiwge2xpbmVXaWR0aDogNX0pXHJcbiAgICBnYW1lLmxpbi5maXhlZCA9IHRydWVcclxuICAgIGdhbWUubGluLkJpbmQuVGV4dHVyZShcImxpbmVcIilcclxuXHJcbiAgICAjZ2FtZS5tYXBNYW5hZ2VyLkxvYWRNYXAoXCJtYXAtMVwiKVxyXG4gICAgU2V0VXBDb25zb2xlQ29tbWFuZHMoZ2FtZSlcclxuXHJcbkRyYXcgPSAoZ2FtZSktPlxyXG5cclxuVXBkYXRlID0gKGdhbWUpIC0+XHJcbiAgICBpZiBnYW1lLmRlbHRhVGltZSA+IDEwMDAvNTAgdGhlbiBhbGVydChcIkZQUyBEaXBwZWQhICN7Z2FtZS5kZWx0YVRpbWV9XCIpXHJcblxyXG4gICAgaWYgemVsZHJvaWQucGxheWVyP1xyXG4gICAgICAgIHplbGRyb2lkLmxpbi5lbmRQb3NpdGlvbiA9IHplbGRyb2lkLnBsYXllci5wb3NpdGlvbi5DbG9uZSgpXHJcblxyXG56ZWxkcm9pZC5TdGFydFxyXG4gICAgTG9hZDogTG9hZFxyXG4gICAgVXBkYXRlOiBVcGRhdGVcclxuICAgIERyYXc6IERyYXdcclxuICAgIEluaXQ6IEluaXRcclxuXHJcbndpbmRvdy56ZWxkcm9pZCA9IHplbGRyb2lkXHJcblxyXG5cclxuIyBpbml0aWFsaXphdGlvbi4uLlxyXG5TZXRVcENvbnNvbGVDb21tYW5kcyA9IChnYW1lKSAtPlxyXG4gICAgZ2FtZS5kZWJ1Z0NvbmRvbGUgPSBuZXcgVG9yY2guRGVidWdDb25zb2xlKGdhbWUpXHJcbiAgICBnYW1lLmRlYnVnQ29uZG9sZS5BZGRDb21tYW5kIFwiU1BBV05cIiwgKHRDb25zb2xlLCBwaWVjZSwgeCwgeSkgLT5cclxuICAgICAgICBwID0gbmV3IE1hcFBpZWNlc1twaWVjZV0oZ2FtZSwgW1wiMFwiLCBcIjBcIl0pXHJcbiAgICAgICAgcC5wb3NpdGlvbi54ID0gcGFyc2VJbnQoeClcclxuICAgICAgICBwLnBvc2l0aW9uLnkgPSBwYXJzZUludCh5KVxyXG5cclxuICAgICAgICB0Q29uc29sZS5nYW1lLlR3ZWVucy5Ud2VlbihwLCA1MDAsIFRvcmNoLkVhc2luZy5TbW9vdGgpLkZyb20oe29wYWNpdHk6IDB9KS5Ubyh7b3BhY2l0eTogMX0pXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHApXHJcblxyXG4gICAgZ2FtZS5kZWJ1Z0NvbmRvbGUuQWRkQ29tbWFuZCBcIlVDQU1cIiwgKHRDb25zb2xlKSAtPlxyXG4gICAgICAgIGNhbVZlbG9jaXR5ID0gMVxyXG4gICAgICAgIHRhc2sgPVxyXG4gICAgICAgICAgICBfdG9yY2hfYWRkOiBcIlRhc2tcIlxyXG4gICAgICAgICAgICBFeGVjdXRlOiAoZ2FtZSkgLT5cclxuICAgICAgICAgICAgICAgIGlmIGdhbWUuS2V5cy5SaWdodEFycm93LmRvd25cclxuICAgICAgICAgICAgICAgICAgICBnYW1lLkNhbWVyYS5wb3NpdGlvbi54IC09IGNhbVZlbG9jaXR5ICogZ2FtZS5Mb29wLnVwZGF0ZURlbHRhXHJcbiAgICAgICAgICAgICAgICBpZiBnYW1lLktleXMuTGVmdEFycm93LmRvd25cclxuICAgICAgICAgICAgICAgICAgICBnYW1lLkNhbWVyYS5wb3NpdGlvbi54ICs9IGNhbVZlbG9jaXR5ICogZ2FtZS5Mb29wLnVwZGF0ZURlbHRhXHJcbiAgICAgICAgICAgICAgICBpZiBnYW1lLktleXMuVXBBcnJvdy5kb3duXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5DYW1lcmEucG9zaXRpb24ueSArPSBjYW1WZWxvY2l0eSAqIGdhbWUuTG9vcC51cGRhdGVEZWx0YVxyXG4gICAgICAgICAgICAgICAgaWYgZ2FtZS5LZXlzLkRvd25BcnJvdy5kb3duXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5DYW1lcmEucG9zaXRpb24ueSAtPSBjYW1WZWxvY2l0eSAqIGdhbWUuTG9vcC51cGRhdGVEZWx0YVxyXG4gICAgICAgIGdhbWUuVGFzayh0YXNrKVxyXG4iXX0=
//# sourceURL=C:\dev\js\Torch.js\Games\Zeldroid\Src\Game.coffee