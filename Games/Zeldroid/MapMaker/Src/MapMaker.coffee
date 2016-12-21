# some node modules...
fs = require("fs")

class MapMaker
    SELECTED_PIECE: null
    SCALE: 4
    BASE: 16
    MOUSE_DOWN: false
    SHIFT_DOWN: false
    constructor: ->
        @GenerateCells()
        @BindEvents()
        @BindEvents()
        @LoadMapOptions()

        $("#menu").draggable()

    GenerateCells: ->
        LENGTH = 28
        HEIGHT = 16
        i = 0
        while i < LENGTH
            j = 0
            while j < HEIGHT
                @GenerateCell(i,j)
                j++
            i++

    GetMapPieceImageUrl: (mapPiece) ->
        url = "../Assets/Art/map/#{mapPiece::textureId}.png"
        return url

    BindEvents: ->
        $("#map-export").click =>
            @ExportMap()

        $("#map-import").click =>
            @ImportMap()

        $(document).keydown (e) =>
            if e.keyCode is 16
                @SHIFT_DOWN = true

        $(document).keyup (e) =>
            if e.keyCode is 16
                @SHIFT_DOWN = false

        $(document).mousedown =>
            @MOUSE_DOWN = true

        $(document).mouseup =>
            @MOUSE_DOWN = false

    GenerateCell: (x, y) ->
        that = this
        cell = $("<div class = 'cell'></div>")


        cell.attr("id", "cell-" + x + y)

        cell.data("x", x)
        cell.data("y", y)

        cell.css {
            position: "absolute"
            left: x * @BASE * @SCALE
            top: y * @BASE * @SCALE
        }

        $("#grid").append(cell)

        cell.click ->
            if $("[name='action-select']:checked").val() is "place"
                that.HandleCellClick($(this))
            else
                $(this).empty()

        cell.mouseenter ->
            cell = $(this)
            if that.MOUSE_DOWN and that.SHIFT_DOWN
                if $("[name='action-select']:checked").val() is "place"
                    that.HandleCellClick(cell)
                else
                    $(this).empty()

            return false

    HandleCellClick: (cell) ->
        if @SELECTED_PIECE is null then return

        if cell.children().length >= 2 then return
        if cell.children(".piece-#{MapPieces[@SELECTED_PIECE]::identifier}").length >= 1 then return

        im = $("<img src='#{@GetMapPieceImageUrl( MapPieces[@SELECTED_PIECE] )}' class = 'placed-peice piece-#{MapPieces[@SELECTED_PIECE]::identifier}'/>")

        if cell.children("img").length > 0
            im.css("margin-top", "-100%")

        im.data("x", cell.data("x"))
        im.data("y", cell.data("y"))
        im.data("identifier", MapPieces[@SELECTED_PIECE]::identifier)
        cell.append(im)

    ExportMap: ->
        map = new MAP()

        mapString = "name:{name};author:{author};generated:{generated}\n{data}"

        mapString = mapString.replace("{name}", map.name)
        mapString = mapString.replace("{author}", map.author)
        mapString = mapString.replace("{generated}", map.generated)
        mapString = mapString.replace("{data}", map.data)

        fs.writeFileSync("Maps/" + map.name + ".map", mapString)

    ImportMap: ->
        m = new MAP()
        mm = new MapManager()
        mapString = fs.readFileSync("Maps/" + m.name + ".map").toString()
        pieces = []
        i = 0

        sp = mapString.split("\n")

        metaData = sp[0]
        mapString = sp[1]

        segments = mapString.split(";")

        $(".cell").empty()

        for segment in segments
            if segment is "" then break

            identifier = segment.split(",")[0]
            segs = []

            segs = segment.split(",")

            cell = $("#cell-" + parseInt(segs[1], 16) + parseInt(segs[2], 16))
            @SELECTED_PIECE = mm.Parts[identifier].name # class name

            @HandleCellClick(cell)

    LoadMapOptions: ->
        that = this
        for key,piece of MapPieces
            img = $("<img src='#{@GetMapPieceImageUrl(piece)}' />")
            option = $("<div class='option'></div>")
            title = $("<p>" + piece::textureId + "</p>")

            option.append(img)
            option.append(title)
            option.data("piece-key", key)

            $("#map-options").append(option)

            option.click ->
                $(".option").css("background-color", "")

                $(this).animate
                    "background-color": "green"

                that.SELECTED_PIECE = $(this).data("piece-key")


class MAP
    constructor: ->
        that = this
        @name = $("#map-name").val()
        @author = $("#map-author").val()
        @generated = new Date().toString()

        @data = ""

        $(".placed-peice").each ->
            p = $(this)
            that.data += parseInt(p.data("identifier").toString(16)) + ","
            that.data += parseInt(p.data("x")).toString(16) + ","
            that.data += parseInt(p.data("y")).toString(16)
            that.data += ";"

        if @name is "" then @name = "New Map"
        if @author is "" then @author = "Team"




$(document).ready ->
    window.MapMaker = new MapMaker()
