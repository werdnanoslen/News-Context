/*
TODO:
1. Search <section> for keyword dictionary matches
2. Add link between matches and something interesting
*/

var articleText;

window.document.onload = function(e)
{
    var articleDiv = document.getElementById("article-body-blocks");
    articleText = articleDiv.textContent || articleDiv.innerText;
    articleText = articleText.trim();
};
