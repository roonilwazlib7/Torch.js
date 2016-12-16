# Modify some core js prototypes
Function::MixIn = Function::is = (otherFunction) ->
    proto = this.prototype
    items = Object.create(otherFunction.prototype)

    for key,value of items
        proto[key] = value

    return this #allow chaining
