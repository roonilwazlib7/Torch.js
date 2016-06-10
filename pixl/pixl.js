
var pixl = function(data, optionalColorPallette, optionalExportType)
{
    if (!data) throw "pixl error! 'data' argument is required";
    var colorPallette, //object that contains colors which correspond to data
        canvas, //html canvas element
        renderingCanvas, //canvas rendering context
        renderPixel, //function to draw each pixel
        renderRow, //function to draw a row of pixels
        render, //function that draws all the pixels
        findWidth, //function to find the max width of the data
        exportImage, //image data that is exported
        exportType; //type of image (image/png, image/jpeg, image/gif, etc.)

    var PIXEL_WIDTH = pixl.pixelSize == "default" ? 4 : pixl.pixelSize; //the dimensions of each drawn pixel
                                                                        //default is 4
    if (!optionalColorPallette || optionalColorPallette == "default")
    {
        colorPallette = { //default color pallette
            "1": "red",
            "2": "blue",
            "3": "yellow",
            "4": "green",
            "5": "violet",
            "6": "orange",
            "7": "pink",
            "8": "purple",
            "9": "black"
        }
    }
    else
    {
        colorPallette = optionalColorPallette
    }
    if (!optionalExportType || optionalExportType == "default")
    {
        exportType = "image/png"; //default image type
    }
    else
    {
        exportType = optionalExportType;
    }

    findWidth = function()
    {
        var max = 0;
        for (var i = 0; i < data.length; i++)
        {
            if (data[i].length > max) max = data[i].length;
        }
        return max;
    }
    renderPixel = function(pixel, drawPoint)
    {
        if (pixel == "." || pixel == "") return; //period means that nothing is there
        if (!colorPallette[pixel]) throw "pixl error! invalid pixel color: " + pixel;
        renderingCanvas.fillStyle = colorPallette[pixel]; //change the color
        renderingCanvas.fillRect(drawPoint.x, drawPoint.y, PIXEL_WIDTH, PIXEL_WIDTH); //draw the pixel
    }
    renderRow = function(pixelRow, y)
    {
        var drawPoint = {x: 0, y: y};
        var row;
        if (pixl.higherBits)
        {
            row = pixelRow.split("~");
        }
        else
        {
            row = pixelRow
        }
        for (var i = 0; i < row.length; i++)
        {
            renderPixel(row[i], drawPoint);
            drawPoint.x += PIXEL_WIDTH;
        }
    }
    render = function()
    {
        var y = 0;
        var start = new Date().getTime(); //keep track of how long it takes

        for (var i = 0; i < data.length; i++)
        {
            renderRow(data[i], y);
            y += PIXEL_WIDTH;
        }

        exportImage = canvas.toDataURL(exportType); //export it

        var end = new Date().getTime();
        var time = end - start;
        console.log("pixl generation took: " + (time / 1000).toString() + " seconds");
    }

    //get to it...
    canvas = document.createElement("CANVAS"); //create the canvas
    canvas.width = findWidth() * PIXEL_WIDTH; //set the dimensions
    canvas.height = data.length * PIXEL_WIDTH;
    renderingCanvas = canvas.getContext("2d"); //get that rendering context
    render();


    //export it
    return exportImage;
}
pixl.mode = "default"; //default, squares
pixl.pixelSize = "default"; //default(4), [integer]

pixl.HigherBits = function() //allow for more than 9-color pallette
{
    pixl.higherBits = true;
}
pixl.LowerBits = function()
{
    pixl.higherBits = false;
}
