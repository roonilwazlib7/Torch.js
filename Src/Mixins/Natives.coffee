# Modify some core js prototypes
Function::is = Function::MixIn = (otherFunction) ->
    proto = this.prototype
    items = Object.create(otherFunction.prototype)

    for key in items
        proto[key] = items[key]

    return this #allow chaining

String::format = (args...) ->
    replacer = (match, number) ->
        return args[number] if typeof args[number] isnt undefined
        return match        if typeof args[number] is undefined

    return @replace(/{(\d+)}/g, replacer)

String::capitalize = ->
    return this.charAt(0).toUpperCase() + this.slice(1)

String::unCapitalize = ->
    return this.charAt(0).toLowerCase() + this.slice(1)
