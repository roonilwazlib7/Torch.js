//examples:
function examples()
{
    var box = [
        '88888888',
        '8......8',
        '8......8',
        '8......8',
        '88888888'
    ];
    var letterL = [
        '1......',
        '1......',
        '1......',
        '1......',
        '1......',
        '1111...'
    ]
    var random = [
        '32142342134',
        '32414213423',
        '43534234234',
        '42342423423',
        '43253453345'
    ];
    var bowGen = [
        '................111.............................111.............................111.............................111............',
        '.................211133..........................211133..........................211133..........................211133........',
        '.................2211333.........................2211333.........................2211333.........................2211333.......',
        '.................322333311.......................322333311.......................322333311.......................322333311.....',
        '.................3333333113..2...................3333333113..2...................3333333113..2...................3333333113..2.',
        '................3333333311332.2.................3333333311332.2.................3333333311332.2.................3333333311332.2',
        '................333332333111222.................333332333111222.................333332333111222.................333332333111222',
        '................333322233312222.................333322233312222.................333322233312222.................333322233312222',
        '..........133311333323122332211...........133311333323122332211...........133311333323122332221...........133311333323122332221',
        '........32113311333322332222.1..........32113311333322332222.1..........32113311333323332222.1..........32113311333323332222.1.',
        '....11132211131133333223.3.1.1......11132211131133333223.3.1.1......111322111311333321331311.1......111322111311333321331311.1.',
        '....21133221331113333222222222......21133221331113333222222222......2113322133111333223...1.........2113322133111333223...1....',
        '..132233333333311133332222222.....132233333333311133332222222.....132233333333311133221...........132233333333311133221........',
        '..1333333333333311133333333.......1333333333333311133333333.......133333333333331113322...........133333333333331113322........',
        '..3333311133333311133333..........3333311133333311133333..........33333111333333111332221.........33333111333333111332221......',
        '.1113332113311111133.............1113332113311111133.............1113332113311111133..22.........1113332113311111133..22.......',
        '.21133322331122233...............21133322331122233...............21133322331122233...............21133322331122233.............',
        '.22333333311222.1..222...........22333333311222.1..222...........22333333311222.1..222...........22333333311222.1..222.........',
        '133333333313221.222.122.........133333333313221.222.122.........133333333313221.222.122.........133333333313221.222.122........',
        '2333111333133..2222..22........12333111333133..2222..22........12333111333133..2222..22........12333111333133..2222..22........',
        '.3332113311331222222.12..........3332113311331222222.12..........3332113311331222222.12..........3332113311331222222.12........',
        '11332233311333322222..2.........11332233311333322222..2.........11332233311333322222..2.........11332233311333322222..2........',
        '11333333311333322222.1.........111333333311333322222.1.........111333333311333322222.1.........111333333311333322222.1.........',
        '223113333133333.2221............223113333133333.2221............223113333133333.2221............223113333133333.2221...........',
        '323323331133333.................323323331133333.................323323331133333.................323323331133333................',
        '33333311133333..................33333331133333..................33333311133333..................33333331133333.................',
        '3333111133333...................3333111133333...................3333111133333...................3333111133333..................',
        '1111113333332..................1111111333333...................11111113333332..................1111111333333...................',
        '11112222332211.................1111122223322...................111112222332211.................1111122223322...................',
        '112222222222111.................1121122112222...................112222222222111.................1121122112222..................',
        '.2222112211....................222211121112211...................2222112211....................222211121112211.................',
        '222221112111.........................2222222111.................222221112111.........................2222222111................'
    ];
    //mario pattern from Super Mario Bros
    //this is one I made by hand
    var mario = [
        '.....11111......',
        '....111111111...',
        '....2223323.....',
        '...2323332333...',
        '...23223332333..',
        '...2233332222...',
        '.....3333333....',
        '....221222......',
        '...2221221222...',
        '..222211112222..',
        '..332131131233..',
        '..333111111333..',
        '..331111111133..',
        '....111..111....',
        '...222....222...',
        '..2222....2222..'
    ];
    //a modified mario
    var filledMario = pixl.util.FillPixels(mario, 0,5, "1");
    //another modified mario
    var spacedMario = pixl.util.SpacePixels(mario, ".");
    //an exploded mario
    var explodeMario = pixl.util.ExplodePixels(mario, 4);
    //bigger form of mario
    //generated with pixl-plus
    var gen = [
        '.....11111........',
        '.....2111111......',
        '.....22111111.....',
        '..11111111111.....',
        '....222322333.....',
        '..222233223223....',
        '.2222222233223....',
        '.22223222332233...',
        '..3333332222233...',
        '..3333322222333...',
        '...2222222233.....',
        '.....3222223......',
        '....31333313......',
        '...3313333133.....',
        '..333133331333....',
        '.33331333313333...',
        '.33311333311333...',
        '3333113333113333..',
        '3333111111113333..',
        '3333121111213333..',
        '2222111111112222..',
        '2222111111112222..',
        '.22211111111222...',
        '.22111111111122...',
        '..111111111111....',
        '.111111..111111...',
        '.11111....11111...',
        '.11111....11111...',
        '..3333....3333....',
        '..3333....3333....',
        '333333....333333..',
        '333333....333333..'
    ];
    //cloud guy with higher-bit syntax
    var higherCloud = [
        '.~.~.~.~.~.~1~1~1~1~1~.~.~.~.~.~',
        '.~.~.~.~.~1~1~1~1~1~1~1~.~.~.~.~',
        '.~.~.~.~1~1~2~2~2~1~2~2~2~.~.~.~',
        '.~.~.~.~1~2~3~3~3~2~3~3~3~2~.~.~',
        '.~.~.~2~1~2~3~3~3~3~3~3~3~2~.~.~',
        '.~.~2~2~1~2~3~3~2~3~2~3~3~2~.~.~',
        '.~.~2~2~1~2~3~3~2~3~2~3~3~2~.~.~',
        '.~.~2~2~2~2~2~2~2~1~2~2~2~.~.~.~',
        '.~2~2~1~1~1~2~2~2~2~1~1~1~.~.~.~',
        '.~2~1~1~1~1~1~2~2~1~1~1~1~1~.~.~',
        '.~2~1~1~1~1~1~3~3~1~1~1~1~1~2~.~',
        '.~2~3~1~1~1~3~3~3~3~1~1~1~3~2~.~',
        '.~2~3~3~3~3~3~3~3~3~3~3~3~3~2~.~',
        '2~3~3~3~3~3~3~3~3~3~3~3~3~3~3~2~',
        '2~3~3~3~3~3~2~3~3~2~3~3~3~3~3~2~',
        '2~3~3~3~3~3~2~3~3~2~3~3~3~3~3~2~',
        '2~3~3~3~3~3~2~3~3~2~3~3~3~3~3~2~',
        '2~3~3~3~3~3~3~3~3~3~3~3~3~3~3~2~',
        '2~3~2~3~3~3~3~3~3~3~3~3~3~2~3~2~',
        '.~2~3~3~3~2~3~3~3~3~2~3~3~3~2~.~',
        '.~2~3~3~3~3~2~2~2~2~3~3~3~3~2~.~',
        '.~2~3~3~3~3~3~3~3~3~3~3~3~3~2~.~',
        '.~.~2~3~3~3~3~2~2~3~3~3~3~2~.~.~',
        '.~.~.~2~2~2~2~.~.~2~2~2~2~.~.~.~',
    ];
    //cloud guy with lower-bit syntax
    var lowerCloud = [
        '......11111.....',
        '.....1111111....',
        '....112221222...',
        '....1233323332..',
        '...21233333332..',
        '..221233232332..',
        '..221233232332..',
        '..22222221222...',
        '.221112222111...',
        '.2111112211111..',
        '.21111133111112.',
        '.23111333311132.',
        '.23333333333332.',
        '2333333333333332',
        '2333332332333332',
        '2333332332333332',
        '2333332332333332',
        '2333333333333332',
        '2323333333333232',
        '.23332333323332.',
        '.23333222233332.',
        '.23333333333332.',
        '..233332233332..',
        '...2222..2222...',
    ];
    //cloud guy with pixels replaced
    var replacedCloud = pixl.util.ReplacePixels(lowerCloud, "1", ".");
    //merge (vertical)
    var marioBox = pixl.util.VerticalMerge(mario, mario)
    //merge (horizontal)
    var marioMario = pixl.util.HorizontalMerge(mario, mario);
    //Blend
    var marioCloudBlend = pixl.util.Blend(lowerCloud, mario);
    //classic pallete from super mario bros
    var marioPallette = {
        "1": "red",
        "2": "brown",
        "3": "gold",
        "4": "black"
    }
    //a more Irish/African mario
    var altMarioPallette = {
        "1": "green",
        "2": "gold",
        "3": "brown"
    }
    //I think this is bowser?
    //actual colors generated from pixl-plus
    var bowPallette = {
        '1' : 'rgba(255,255,255,255)',
        '2' : 'rgba(231,156,33,255)',
        '3' : 'rgba(16,148,0,255)',
    };
    //random pallete
    getRandomColor = function()
    {
        var r = Math.floor(Math.random() * 254) + 1;
        var g = Math.floor(Math.random() * 254) + 1;
        var b = Math.floor(Math.random() * 254) + 1;
        return "rgb(" + r + "," + g + "," + b + ")";
    }
    var randPallette = {
        "1": getRandomColor(),
        "2": getRandomColor(),
        "3": getRandomColor()
    }

    var _letterL = pixl(letterL);
    var _box = pixl(box);
    var _mario = pixl(mario, marioPallette);
    var _mario_jpeg = pixl(mario, marioPallette, "image/jpeg");
    var _random = pixl(random);
    var _altMario = pixl(mario, altMarioPallette);
    var _gen = pixl(gen, marioPallette);
    var _bow = pixl(bowGen, bowPallette);
    pixl.pixelSize = 10;
    var _bigMario = pixl(mario);
    pixl.pixelSize = 4;
    pixl.HigherBits();
    var _higherCloud = pixl(higherCloud);
    pixl.LowerBits();
    var _lowerCloud = pixl(lowerCloud);
    var _randMario = pixl(mario, randPallette);
    var _filledMario = pixl(filledMario, marioPallette);
    var _replacedCloud = pixl(replacedCloud);
    var _spacedMario = pixl(spacedMario, marioPallette);
    var _explodeMario = pixl(explodeMario, marioPallette);
    var _marioBox = pixl(marioBox);
    var _marioMario = pixl(marioMario, marioPallette);
    var _marioCloudBlend = pixl(marioCloudBlend);

    var makeSample = function(im, desc)
    {
        var div = $("<div class = 'col-sm-3' style=' padding: 1%; margin: 1%'></div>");
        div.append("<img src='" + im.src + "' /><br>");
        div.append("<p>" + desc + "</p>");
        $(".out").append(div);
    }
    makeSample(_letterL, "A really simple letter")
    makeSample(_box, "Just a basic box");
    makeSample(_mario, "Mario");
    makeSample(_random, "Random pixels");
    makeSample(_altMario, "Mario with an Irish/African twist");
    makeSample(_gen, "Generated big mario");
    makeSample(_bow, "Generated Boswer");
    makeSample(_bigMario, "Large mario with default pixl pallette");
    makeSample(_mario_jpeg, "Mario exported as a jpeg. Notice the jpeg format does not support alpha levels");
    makeSample(_higherCloud, "Made in Higher Bit mode");
    makeSample(_lowerCloud, "Made in Lower Bit mode");
    makeSample(_randMario, "Mario with random colors");
    makeSample(_filledMario, "Mario with 'pixl.util.FillPixels'");
    makeSample(_replacedCloud, "Cloud guy with 'pixl.util.ReplacePixels'");
    makeSample(_spacedMario, "Mario with 'pixl.util.SpacePixels'");
    makeSample(_marioBox, "Mario/Mario with 'pixl.util.VerticalMerge'");
    makeSample(_marioMario, "Mario/Mario with 'pixl.util.HorizontalMerge'");
    makeSample(_marioCloudBlend, "Mario/Cloud Guy with 'pixl.util.Blend'");
    //makeSample(_explodeMario, "Mario with 'pixl.util.ExplodePixels'");
}
examples();