# Catch all errors
window.onerror = (args...) ->
    return if not window.Torch.STRICT_ERRORS

    errorObj = args[4]

    if errorObj isnt undefined
        window.Torch.FatalError(errorObj)
    else
        window.Torch.FatalError("An error has occured")
