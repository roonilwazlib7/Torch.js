function FormatCode()
{
    $(".code").each(function(){
        var codeBox = $(this);
        var codeHtml = codeBox.html();
        codeHtml = FormatCodeString(codeHtml);
        codeBox.html(codeHtml);
    });
}
function FormatCodeString(codeHtml, cursor)
{
    codeHtml = codeHtml.replace(/var /g, "<span class='var'>var </span>");
    codeHtml = codeHtml.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, function(str){
        if (str != '"tab"' && str != "'var'" && str != "'string'" && str != "'number'" && str != "'comment'")
        {
            return "<span class='string'>" + str + "</span>"
        }
        else
        {
            return str;
        }
    });
    codeHtml = codeHtml.replace(/~/g, "~\n");
    codeHtml = codeHtml.replace(/<br>/g, function(str){
        return "\n" + str + "\n";
    });
    codeHtml = codeHtml.replace(/<\/span>/g, function(str){
        return "\n" + str + "\n";
    });
    codeHtml = codeHtml.replace(/\/\/+.*/g, function(str){
        return "<span class='comment'>" + str + "</span>";
    });
    codeHtml = codeHtml.replace(/if /g, function(str){
        return "<span class='operator'>" + str + "</span>";
    });
    codeHtml = codeHtml.replace(/Torch\./g, function(str){
        return "<span class='torch'>" + str.split(".")[0] + "</span>.";
    });
    codeHtml = codeHtml.replace(/new\s/g, function(str){
        return "<span class='new'>" + str + "</span>";
    });
    codeHtml = codeHtml.replace(/function\(/g, function(str){
        return "<span class='function'>" + str.split("(")[0] + "</span>(";
    });
    codeHtml = codeHtml.replace(/function\s/g, function(str){
        return "<span class='function'>" + str + "</span>";
    });
    codeHtml = codeHtml.replace(/[0-9]/g, function(str){
        return "<span class='number'>" + str + "</span>";
    });
    codeHtml = codeHtml.replace(/~/g, "<br>");
    codeHtml = codeHtml.replace(/\^/g, "<span>&nbsp;</span>");
    codeHtml = codeHtml.replace(/\t/g, "<span>&nbsp;&nbsp;</span>");

    if (cursor)
    {
        codeHtml += "<span class = 'cursor'>|</span>";
    }

    return codeHtml;
}
