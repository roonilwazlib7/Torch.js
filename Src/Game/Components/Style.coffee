Torch.Style = ->

    # a few style fixes to get around having a css file

    body = document.body

    body.style.backgroundColor = "black"
    body.style.overflow = "hidden"
    body.style.margin = 0

    canvas = document.getElementsByTagName("CANVAS")[0]
    canvas.style.border = "1px solid orange"

    canvas.style.cursor = "pointer"
