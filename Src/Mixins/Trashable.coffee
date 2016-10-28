class Trashable
    trash: false
    Trash: ->
        @trash = true
        return @
        
exports.Trashable = Trashable
