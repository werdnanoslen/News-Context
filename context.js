/*
TODO:
1. Add link between matches and something interesting
*/

var articleText;
var keywords;



window.document.onload = function(e)
{
    getArticleText();
    getDicts();
    findMatches();
};


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
                if (!keywords[keywordBuffer])
                {
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
    var articleDiv = document.getElementById("article-body-blocks");
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
