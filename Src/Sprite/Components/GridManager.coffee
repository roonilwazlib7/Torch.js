class GridManager
    parent: null
    children: null

    centered: false
    centerVertical: false

    alignLeft: false
    alignRight: false
    alignTop: false
    alignBottom: false

    constructor: (@sprite) ->
        @position = new Torch.Point(0,0)
        @children = []

    Position: () ->
        # same as sprite

    Align: (positionTags...) ->
        for tag in positionTags
            switch tag
                when "left"
                    @alignLeft = true
                when "right"
                    @alignRight = true
                when "top"
                    @alignTop = true
                when "bottom"
                    @alignBottom = true

    Center: (turnOn = true)->
        @centered = turnOn

    CenterVertical: (turnOn = true)->
        @centerVertical = turnOn

    Append: (sprite) ->
        sprite.Grid.parent = @sprite

    Parent: ->
        return @parent

    Children: (matcher) ->
        return @children if not matcher

        children = []

        for child in @children
            matching = true
            for key,value of matcher
                if not child[key] is value
                    matching = false

            children.append(child) if matching

        return children

    Ancestors: (matcher) ->
        return null if not @parent
        ancestors = []

        ancestor = @parent

        while ancestor.Parent() isnt null
            if not matcher
                ancestors.push(ancestor)
            else
                matched = true
                for key,value of matcher
                    if ancestor[key] isnt value
                        matched = false
                ancestors.push(ancestor) if matched

            ancestor = ancestor.Parent()

    ApplyCentering: (point) ->
        if @centered
            point.x = (point.x + @parent.Width() / 2) - (@sprite.Width() / 2)

        if @centerVertical
            point.y = (point.y + @parent.Height() / 2) - (@sprite.Height() / 2)

        return point

    ApplyAlignment: (point) ->
        if @alignLeft
            point.x = 0
        if @alignRight
            point.x = (point.x + @parent.Width()) - @sprite.Width()
        if @alignTop
            point.y = 0
        if @alignBottom
            point.y = (point.y + @parent.Height()) - @sprite.Height()

        return point

    ResolveAbosolutePosition: ->
        if @parent is null
            return @sprite.Position()

        basePoint = @parent.Position()

        basePoint = @ApplyCentering(basePoint)
        basePoint = @ApplyAlignment(basePoint)
        basePoint.Apply(@position)

        return basePoint;

    Update: ->
        @sprite.Position(@ResolveAbosolutePosition())
