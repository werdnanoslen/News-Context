var articleDiv;
var articleText;
var keywords;



function addLinks()
{
    var links = articleDiv.getElementsByTagName("a");
    for (var i=0; i<links.length; ++i)
    {
        link[i].title = "";
    }
    for (var keyword in keywords)
    {
        var prevChar = articleDiv.innerHTML.indexOf(keyword) - 1;
        if (">" == articleDiv.innerHTML.charAt(prevChar))
        {
            console.log("Keyword \"" + keyword + "\" already linked.");
            continue;
        }
        else
        {
            var search = "https://www.google.dk/search?q=" + keyword;
            var href = "<a href=\"" + search + "\">" + keyword + "</a>";
            var linkified = articleDiv.innerHTML.replace(keyword, href);
            articleDiv.innerHTML = linkified;
        }
    }
}


function findMatches()
{
    var splitText = articleText.split(" ");
    keywords = {};
    var keywordBuffer = false;
    var keywordCount = 0;
    for (var i=0; i<splitText.length; ++i)
    {
        if (splitText[i].length < 2) continue;

        var firstChar = splitText[i][0];
        var lastChar = splitText[i][splitText[i].length - 1];
        if (firstChar.match(/[A-Z]/))
        {
            if (keywordBuffer)
            {
                keywordBuffer += " " + splitText[i];
            }
            else
            {
                keywordBuffer = splitText[i];
            }

            if (!lastChar.match(/[a-zA-Z0-9]/))
            {
                var lastCharAt = keywordBuffer.length - 1;
                keywordBuffer = keywordBuffer.substr(0, lastCharAt);
                keywords[keywordBuffer] = {};
                ++keywordCount;
                keywordBuffer = false;
            }
        }
        else
        {
            if (keywordBuffer)
            {
                keywords[keywordBuffer] = {};
                ++keywordCount;
            }
            keywordBuffer = false;
        }
    }
}


function getArticleText()
{
    articleDiv = document.getElementById("article-body-blocks");
    articleText = articleDiv.textContent || articleDiv.innerText;
    articleText = articleText.trim();
}


/*
  This should ideally figure out which dicts to download.
  For now, we're going to hardcode them for sake of demo.
  TODO: async?
*/
function getDicts()
{
    /* Waiting on my journalist friends to tell me what to put here */
}



window.document.onload = function(e)
{
    getArticleText();
    getDicts();
    findMatches();
    addLinks();
};
