class GridManager
    parent: null
    children: null

    centered: false
    centerVertical: false

    alignLeft: false
    alignRight: false
    alignTop: false
    alignBottom: false

    margin: null

    constructor: (@sprite) ->
        @position = new Point(0,0)
        @children = []
        @margin =
            left: 0
            top: 0

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
        return @

    Center: (turnOn = true)->
        @centered = turnOn
        return @

    CenterVertical: (turnOn = true)->
        @centerVertical = turnOn
        return @

    Margin: (left = 0, top = 0) ->
        @margin.left = left
        @margin.top = top
        return @

    Append: (sprite) ->
        sprite.Grid.parent = @sprite
        sprite.drawIndex = @sprite.drawIndex + 1
        sprite.fixed = @sprite.fixed

        return @

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
            point.x = (point.x + @parent.rectangle.width / 2) - (@sprite.rectangle.width / 2)

        if @centerVertical
            point.y = (point.y + @parent.rectangle.height / 2) - (@sprite.rectangle.height / 2)

        return point

    ApplyAlignment: (point) ->
        if @alignLeft
            point.x = 0
        if @alignRight
            point.x = point.x + (@parent.rectangle.width - @sprite.rectangle.width)
        if @alignTop
            point.y = 0
        if @alignBottom
            point.y = point.y + (@parent.rectangle.height - @sprite.rectangle.height)

        return point

    ResolveAbosolutePosition: ->
        if @parent is null
            return @sprite.position

        basePoint = @parent.position.Clone()

        basePoint = @ApplyCentering(basePoint)
        basePoint = @ApplyAlignment(basePoint)
        basePoint.Apply(@position)

        basePoint.x += @margin.left
        basePoint.y += @margin.top

        return basePoint;

    Update: ->
        @sprite.position = @ResolveAbosolutePosition()
        if @parent isnt null
            @sprite.drawIndex = @parent.drawIndex + 1
            @sprite.fixed = @parent.fixed
