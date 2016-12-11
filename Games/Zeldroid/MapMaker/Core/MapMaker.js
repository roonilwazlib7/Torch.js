// Generated by CoffeeScript 1.10.0
(function() {
  var MAP, MapMaker;

  MapMaker = (function() {
    MapMaker.prototype.SELECTED_PIECE = null;

    MapMaker.prototype.SCALE = 4;

    MapMaker.prototype.BASE = 16;

    MapMaker.prototype.MOUSE_DOWN = false;

    MapMaker.prototype.SHIFT_DOWN = false;

    function MapMaker() {
      this.GenerateCells();
      this.BindEvents();
      this.BindEvents();
      this.LoadMapOptions();
    }

    MapMaker.prototype.GenerateCells = function() {
      var HEIGHT, LENGTH, i, j, results;
      LENGTH = 36;
      HEIGHT = 24;
      i = 0;
      results = [];
      while (i < LENGTH) {
        j = 0;
        while (j < HEIGHT) {
          console.log(i, j);
          this.GenerateCell(i, j);
          j++;
        }
        results.push(i++);
      }
      return results;
    };

    MapMaker.prototype.BindEvents = function() {
      $("#map-export").click((function(_this) {
        return function() {
          return _this.ExportMap();
        };
      })(this));
      $("#map-import").click((function(_this) {
        return function() {
          return _this.ImportMap();
        };
      })(this));
      $(document).keydown((function(_this) {
        return function(e) {
          if (e.keyCode === 16) {
            return _this.SHIFT_DOWN = true;
          }
        };
      })(this));
      $(document).keyup((function(_this) {
        return function(e) {
          if (e.keyCode === 16) {
            return _this.SHIFT_DOWN = false;
          }
        };
      })(this));
      $(document).mousedown((function(_this) {
        return function() {
          return _this.MOUSE_DOWN = true;
        };
      })(this));
      return $(document).mouseup((function(_this) {
        return function() {
          return _this.MOUSE_DOWN = false;
        };
      })(this));
    };

    MapMaker.prototype.GenerateCell = function(x, y) {
      var cell, that;
      that = this;
      cell = $("<div class = 'cell'></div>");
      cell.attr("id", "cell-" + x + y);
      cell.data("x", x);
      cell.data("y", y);
      cell.css({
        position: "absolute",
        left: x * this.BASE * this.SCALE,
        top: y * this.BASE * this.SCALE
      });
      $("#grid").append(cell);
      cell.click(function() {
        return that.HandleCellClick($(this));
      });
      return cell.mouseenter(function() {
        cell = $(this);
        if (that.MOUSE_DOWN && that.SHIFT_DOWN) {
          that.HandleCellClick(cell);
        }
        return false;
      });
    };

    MapMaker.prototype.HandleCellClick = function(cell) {
      var im;
      if (this.SELECTED_PIECE === null) {
        return;
      }
      if (this.SHIFT_DOWN) {
        cell.empty();
      }
      im = $("<img src='../Assets/Art/map/" + MapPieces[this.SELECTED_PIECE].prototype.textureId + ".png' class = 'placed-peice'/>");
      if (cell.children("img").length > 0) {
        im.css("margin-top", "-100%");
      }
      im.data("x", cell.data("x"));
      im.data("y", cell.data("y"));
      im.data("identifier", MapPieces[this.SELECTED_PIECE].prototype.identifier);
      return cell.append(im);
    };

    MapMaker.prototype.ExportMap = function() {
      var map, mapString;
      map = new MAP();
      mapString = "name:{name};author:{author};generated:{generated}\n{data}";
      mapString = mapString.replace("{name}", map.name);
      mapString = mapString.replace("{author}", map.author);
      mapString = mapString.replace("{generated}", map.generated);
      mapString = mapString.replace("{data}", map.data);
      return fs.writeFileSync("Maps/" + map.name + ".map", mapString);
    };

    MapMaker.prototype.ImportMap = function() {
      var cell, i, identifier, im, m, mapString, metaData, mm, pieces, results, segment, segments, segs, sp;
      m = new MAP();
      mm = new MapManager();
      mapString = fs.readFileSync("Maps/" + m.name + ".map").toString();
      pieces = [];
      i = 0;
      sp = mapString.split("\n");
      metaData = sp[0];
      mapString = sp[1];
      segments = mapString.split(";");
      $(".cell").empty();
      results = [];
      while (i < segments.length) {
        segment = segments[i];
        if (segment === "") {
          break;
        }
        identifier = segment.split(",")[0];
        segs = [];
        segs = segment.split(",");
        im = $("<img src='../Assets/Art/map/" + mm.Parts[identifier].prototype.textureId + ".png' class = 'placed-peice'/>");
        cell = $("#cell-" + parseInt(segs[1], 16) + parseInt(segs[2], 16));
        cell.empty();
        im.data("x", cell.data("x"));
        im.data("y", cell.data("y"));
        im.data("identifier", mm.Parts[identifier].prototype.identifier);
        cell.append(im);
        results.push(i++);
      }
      return results;
    };

    MapMaker.prototype.LoadMapOptions = function() {
      var img, key, option, p, piece, results, that, title;
      that = this;
      results = [];
      for (key in MapPieces) {
        piece = MapPieces[key];
        p = piece.prototype;
        img = $("<img src='../Assets/Art/map/" + p.textureId + ".png' />");
        option = $("<div class='option'></div>");
        title = $("<p>" + p.textureId + "</p>");
        option.append(img);
        option.append(title);
        option.data("piece-key", key);
        $("#map-options").append(option);
        results.push(option.click(function() {
          $(".option").css("background-color", "");
          $(this).animate({
            "background-color": "green"
          });
          return that.SELECTED_PIECE = $(this).data("piece-key");
        }));
      }
      return results;
    };

    return MapMaker;

  })();

  MAP = (function() {
    function MAP() {
      var that;
      that = this;
      this.name = $("#map-name").val();
      this.author = $("#map-author").val();
      this.generated = new Date().toString();
      this.data = "";
      $(".placed-peice").each(function() {
        var p;
        p = $(this);
        that.data += parseInt(p.data("identifier").toString(16)) + ",";
        that.data += parseInt(p.data("x")).toString(16) + ",";
        that.data += parseInt(p.data("y")).toString(16);
        return that.data += ";";
      });
      if (this.name === "") {
        this.name = "New Map";
      }
      if (this.author === "") {
        this.author = "Team";
      }
    }

    return MAP;

  })();

  $(document).ready(function() {
    return window.MapMaker = new MapMaker();
  });

}).call(this);
