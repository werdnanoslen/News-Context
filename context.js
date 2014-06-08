var articleDiv;
var articleHTML;
var articleText;
var keywords;
var dicts;
var dictsCombined;
var news;


function addLinks()
{
    hoverDiv = document.createElement("div");
    articleDiv.appendChild(hoverDiv);
    hoverDiv.style.display = "none";
    hoverDiv.style.padding = "6px";
    hoverDiv.style.position = "absolute";
    hoverDiv.style.backgroundColor = "#ffffff";
    hoverDiv.style.boxShadow = "-2px 5px 16px -5px #000000";
    hoverDiv.style.zIndex = "100";
    hoverDiv.style.width = "300px";
    hoverDiv.borderRadius = "10px";
    hoverDiv.id = "hoverDiv";

    var links = articleDiv.getElementsByTagName("a");
    for (var i=0; i<links.length; ++i)
    {
        links[i].title = "";
    }
    for (var keyword in keywords)
    {
        var prevChar = articleHTML.indexOf(keyword) - 1;
        if (">" == articleHTML.charAt(prevChar))
        {
            console.log("Keyword \"" + keyword + "\" already linked.");
            continue;
        }
        else if (-1 === dictsCombined.indexOf(keyword))
        {
            console.log("Keyword \"" + keyword + "\" not in our list.");
            continue;
        }
        else
        {
            for (var i=0; i<dicts.length; ++i)
            {
                if (dicts[i][keyword])
                {
                    var search = dicts[i]["_config"]["Search"];
                    var href = search + encodeURIComponent(keyword);
                    var link = "<a href=\"" + href + "\""
                        + " class=\"context-link\""
                        + ">" + keyword + "</a>";
                    articleDiv.innerHTML = articleDiv.innerHTML.replace(keyword, link);
                }
            }
        }
    }

    var links = articleDiv.getElementsByClassName("context-link");
    for (var i=0; i<links.length; ++i)
    {
        links[i].addEventListener("mouseover", function(e){
            e.preventDefault();
            hover(this);
        });

        links[i].addEventListener("mouseout", function(e){
            e.preventDefault();
            unhover(this);
        });
    }
}


// Shitty NER algorithm
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
    articleHTML = articleDiv.innerHTML;
}


function getDicts()
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var terms = JSON.parse(xhr.responseText);
            dicts = [terms];
            dictsCombined = Object.keys(terms);
            findMatches();
            addLinks();
        }
    };
    xhr.open("GET", chrome.extension.getURL("/dictionaries/terms.json"), true);
    xhr.send();
}

function hover(link)
{
    var hoverDiv = document.getElementById("hoverDiv");
    var keyword = link.textContent || link.innerText;
    hoverDiv.style.display = "block";
    hoverDiv.style.top = link.offsetTop - 70 + "px";
    hoverDiv.style.left = link.offsetLeft + 70 + "px";

    for (var i=0; i<dicts.length; ++i)
    {
        var concept = dicts[i][keyword];
        if (concept)
        {
            var term = document.createElement("h1");
            var desc = document.createElement("p");
            var img = document.createElement("img");

            hoverDiv.appendChild(term);
            hoverDiv.appendChild(desc);
            hoverDiv.appendChild(img);

            term.innerHTML = concept["Term"];
            desc.innerHTML = concept["Description"];
            if (concept["Image"].length > 0)
            {
                img.src = concept["Image"];
            }
            img.style.maxWidth = "100%";
            img.style.maxHeight = "300px";

            var guardian = "http://content.guardianapis.com/search?api-key=mediahackdays2014&q=";
            $.ajax({
                url: guardian + keyword,
                success: function(data) {
                    news = data;
                    var newsDesc = document.createElement("p");
                    hoverDiv.appendChild(newsDesc);
                    newsDesc.innerHTML = "Related news:";
                    newsDesc.margin = "0";
                    newsDesc.padding = "0";
                    var numNews = 3;
                    for (var i=0; i<numNews; ++i)
                    {
                        var newsLink = document.createElement("a");
                        hoverDiv.appendChild(newsLink);
                        var newsResults = news["response"]["results"];
                        newsLink.innerHTML = newsResults[i]["webTitle"];
                        newsLink.href = newsResults[i]["webUrl"];
                        newsLink.style.display = "block";
                        newsLink.style.padding = "5px 0";
                    }
                }
            });
            break;
        }
    }
}


function refactor(json)
{
    terms = JSON.parse(JSON.stringify(json));
    termsLookup = {};
    for (var i=0; i<terms.length; ++i) {
        var term = terms[i]["Term"];
        termsLookup[term] = terms[i];
    }
    termsLookup = JSON.stringify(termsLookup);
    return termsLookup;
}


function unhover(link)
{
    var hoverDiv = document.getElementById("hoverDiv");
    hoverDiv.style.display = "none";
    hoverDiv.innerHTML = "";
}

console.log("Contextualizing...");

getArticleText();
getDicts();
