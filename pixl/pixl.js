
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
        exportImageObject,
        exportType, //type of image (image/png, image/jpeg, image/gif, etc.)
        exportObject, //the returned object
        exportTime; //time to export

    var PIXEL_WIDTH = pixl.pixelSize == "default" ? 4 : pixl.pixelSize; //the dimensions of each drawn pixel
                                                                        //default is 4
    var EXPLODING = false;
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
        if (pixel == "." || pixel == "" || pixel == "*") return; //period means that nothing is there
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
            if (row[i] != "*")
            {
                drawPoint.x += PIXEL_WIDTH;
            }
            else
            {
                drawPoint.x += 1;
                EXPLODING = true;
            }
        }
    }
    render = function()
    {
        var y = 0;
        var start = new Date().getTime(); //keep track of how long it takes

        for (var i = 0; i < data.length; i++)
        {
            renderRow(data[i], y);
            if (!EXPLODING) y += PIXEL_WIDTH;
            else y += 1;
        }

        exportImage = canvas.toDataURL(exportType); //export it

        var end = new Date().getTime();
        exportTime = end - start;
        console.log("pixl generation took: " + (exportTime / 1000).toString() + " seconds");
    }

    //get to it...
    canvas = document.createElement("CANVAS"); //create the canvas
    canvas.width = findWidth() * PIXEL_WIDTH; //set the dimensions
    canvas.height = data.length * PIXEL_WIDTH;
    renderingCanvas = canvas.getContext("2d"); //get that rendering context
    render();


    //export it
    exportObject = {
        src : exportImage,
        image: new Image(),
        time: exportTime,
    };

    exportObject.image.src = exportObject.src;
    exportObject.image.onload = function()
    {
        pixl.Stack.push(exportObject);
    }

    return exportObject;
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
pixl.Stack = [];



    //TODO
    //Add some operations that modify data (i.e explode, cut, fill, etc)

pixl.util = {};
pixl.util.DecomposeImage = function(image)
{
    var canvas = document.createElement("CANVAS");
    canvas.crossOrigin = "anonymous";
    var cnv;
    canvas.width = image.width;
    canvas.height = image.height;
    cnv = canvas.getContext("2d");
    cnv.drawImage(image, 0, 0);
    return canvas.toDataURL();
}
pixl.util.FillPixels = function(data, lineStart, lineEnd, pixel)
{
        var newData = [];
        var thisData = pixl.higherBits ? data.split("~") : data;
        var width = data[0].length;
        for (var i = 0; i < thisData.length; i++)
        {
            newData.push(data[i]);
            if (i == lineStart)
            {
                for (var j = 0; j < lineEnd; j++)
                {
                    var row = "";
                    for (var z = 0; z < width; z++)
                    {
                        if (pixl.higherBits)
                        {
                            row += pixl + "~";
                        }
                        else
                        {
                            row += pixel;
                        }
                    }
                    newData.push(row);
                }
            }

        }
        return newData;
}
pixl.util.ReplacePixels = function(data, pixelToReplace, newPixel)
{
    var newData = [];
    var thisData = pixl.higherBits ? data.split("~") : data;
    var addOn = pixl.higherBits ? "~" : "";
    for (var i = 0; i < thisData.length; i++)
    {
        var row = "";
        for (var j = 0; j < thisData[i].length; j++)
        {
            if (thisData[i][j] == pixelToReplace)
            {
                row += newPixel + addOn;
            }
            else
            {
                row += thisData[i][j] + addOn;
            }
        }
        newData.push(row);
    }
    return newData;
}
pixl.util.SpacePixels = function(data, pixelSpacer)
{
    var newData = [];
    var thisData = pixl.higherBits ? data.split("~") : data;
    var width = thisData[0].length * 2;
    var spaceRow = "";
    for (var z = 0; z < width; z++)
    {
        if (pixl.higherBits)
        {
            spaceRow += pixelSpacer + "~";
        }
        else
        {
            spaceRow += pixelSpacer;
        }
    }
    for (var i = 0; i < thisData.length; i++)
    {
        var row = "";
        for (var j = 0; j < thisData[i].length; j++)
        {
            if (j + 1 == thisData[i].length) break;
            if (pixl.higherBits)
            {
                row += thisData[i][j] + "~" + pixelSpacer + "~";
            }
            else
            {
                row += thisData[i][j] + pixelSpacer;
            }
        }
        newData.push(row);
        if (i + 1 != thisData.length)
        {
            newData.push(spaceRow);
        }
    }
    return newData;
}
pixl.util.ExplodePixels = function(data, depth)
{
    var newData = data;
    for (var i = 0; i < depth; i++)
    {
        newData = pixl.util.SpacePixels(newData, "*");
    }
    return newData;
}
pixl.util.VerticalMerge = function(data1, data2)
{
    var newData = data1.concat(data2);
    return newData;
}
pixl.util.HorizontalMerge = function(data1, data2)
{
    var newData = [];
    var thisData, otherData;
    if (data1.length > data2.length)
    {
        thisData = data1;
        otherData = data2;
    }
    else {
        thisData = data2;
        otherData = data1;
    }
    for (var i = 0; i < thisData.length; i++)
    {
        var addString = thisData[i];
        if (otherData[i]) addString += otherData[i];
        newData.push(addString);
    }
    return newData;
}
pixl.util.Blend = function(bottom, top, keepBottom) //does not support higher bits! bottom must be larger or equal to top
{
    var newData = [];
    for (var i = 0; i < bottom.length; i++)
    {
        var addString = "";
        for (var j = 0; j < bottom[i].length; j++)
        {
            var bPix = bottom[i][j];
            if (!top[i] || !top[i][j])
            {
                addString += bPix;
            }
            else if (top[i][j] && top[i][j] != "." && !keepBottom)
            {
                addString += top[i][j];
            }
            else
            {
                if (bPix == "." && top[i] && top[i][j] && top[i][j] != ".")
                {
                    addString += top[i][j];
                }
                else
                {
                    addString += bPix;
                }
            }

        }
        newData.push(addString);
    }
    return newData;
}
pixl.util.Mix = function(pal1, pal2)
{

}

//TODO
//Add some default pallettes
pixl.pal = {};
