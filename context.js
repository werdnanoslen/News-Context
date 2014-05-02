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
    var addToPrev = false;
    var keywordCount = 0;
    for (var i=0; i<splitText.length; ++i)
    {
        if (splitText[i].length < 2) continue;

        var firstChar = splitText[i][0];
        var lastChar = splitText[i][splitText[i].length - 1];
        if (firstChar.match(/[A-Z]/))
        {
            if (addToPrev)
            {
                keywords[keywordCount] += " " + splitText[i];
            }
            else
            {
                keywords[keywordCount] = splitText[i];
            }

            if (lastChar.match(/[a-zA-Z0-9]/))
            {
                addToPrev = true;
            }
            else
            {
                var thisKeyword = keywords[keywordCount];
                var lastCharAt = thisKeyword.length - 1;
                keywords[keywordCount] = thisKeyword.substr(0, lastCharAt);
                ++keywordCount;
                addToPrev = false;
            }
        }
        else
        {
            if (addToPrev)
            {
                ++keywordCount;
            }
            addToPrev = false;
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
