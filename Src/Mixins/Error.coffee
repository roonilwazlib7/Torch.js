# Catch all errors
window.onerror = (args...) ->
    return if not window.Torch.STRICT_ERRORS

    document.body.style.backgroundColor = "black"

    errorObj = args[4]

    if errorObj isnt undefined
        Torch.FatalError(errorObj)
    else
        Torch.FatalError("An error has occured")
