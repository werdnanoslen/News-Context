var articleDiv;
var articleText;
var keywords;
var dicts;
var dictsCombined;


function addLinks()
{
    var links = articleDiv.getElementsByTagName("a");
    for (var i=0; i<links.length; ++i)
    {
        links[i].title = "";
    }
    for (var keyword in keywords)
    {
        var prevChar = articleDiv.innerHTML.indexOf(keyword) - 1;
        if (">" == articleDiv.innerHTML.charAt(prevChar))
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
            var search = "https://www.google.dk/search?q=" + keyword;
            var href = "<a href=\"" + search + "\">" + keyword + "</a>";
            var linkified = articleDiv.innerHTML.replace(keyword, href);
            articleDiv.innerHTML = linkified;
        }
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
}


/*
  This should ideally figure out which dicts to download.
  For now, we're going to hardcode them for sake of demo.
  TODO: async?
*/
function getDicts()
{
    var companies = ["ARM Holdings", "Aberdeen Asset Management", "Admiral Group", "Aggreko", "Anglo American", "Antofagasta", "Ashtead Group", "Associated British Foods", "AstraZeneca", "Aviva", "BAE Systems", "BG Group", "BHP Billiton", "BP", "BT Group", "Babcock International Group", "Barclays", "Barratt Developments", "British American Tobacco", "British Land Co", "British Sky Broadcasting Group", "Bunzl", "Burberry Group", "CRH", "Capita", "Carnival", "Centrica", "Coca-Cola HBC AG", "Compass Group", "Diageo", "Easyjet", "Experian", "Fresnillo", "G4S", "GKN", "GlaxoSmithKline", "Glencore Xstrata", "HSBC Hldgs", "Hammerson", "Hargreaves Lansdown", "IMI", "ITV", "Imperial Tobacco Group", "InterContinental Hotels Group", "International Consolidated Airlines Group", "Intertek Group", "Johnson Matthey", "Kingfisher", "Land Securities Group", "Legal & General Group", "Lloyds Banking Group", "London Stock Exchange Group", "Marks & Spencer Group", "Meggitt", "Melrose Industries", "Mondi", "Morrison (Wm) Supermarkets", "National Grid", "Next", "Old Mutual", "Pearson", "Persimmon", "Petrofac", "Prudential", "RSA Insurance Group", "Randgold Resources", "Reckitt Benckiser Group", "Reed Elsevier", "Resolution", "Rexam", "Rio Tinto", "Rolls-Royce Holdings", "Royal Bank Of Scotland Group", "Royal Dutch Shell A", "Royal Dutch Shell B", "Royal Mail", "SABMiller", "SSE", "Sage Group", "Sainsbury (J)", "Schroders", "Severn Trent", "Shire", "Smith & Nephew", "Smiths Group", "Sports Direct International", "St.James Place", "Standard Chartered", "Standard Life", "TUI Travel", "Tesco", "Travis Perkins", "Tullow Oil", "Unilever", "United Utilities Group", "Vodafone Group", "WPP", "Weir Group", "Whitbread", "William Hill", "Wolseley"];

    var countries = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas, The", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cabo Verde", "Cayman Islands", "Central African Republic", "Chad", "Channel Islands", "Chile", "China", "Colombia", "Comoros", "Congo, Dem. Rep.", "Congo, Rep.", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt, Arab Rep.", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Faeroe Islands", "Fiji", "Finland", "France", "French Polynesia", "Gabon", "Gambia, The", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong SAR, China", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Rep.", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Dem. Rep.", "Korea, Rep.", "Kosovo", "Kuwait", "Kyrgyz Republic", "Lao PDR", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao SAR, China", "Macedonia, FYR", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia, Fed. Sts.", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russian Federation", "Rwanda", "Samoa", "San Marino", "São Tomé and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovak Republic", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "St. Kitts and Nevis", "St. Lucia", "St. Martin (French part)", "St. Vincent and the Grenadines", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela, RB", "Vietnam", "Virgin Islands (U.S.)", "West Bank and Gaza", "Yemen, Rep.", "Zambia", "Zimbabwe"];

    dicts = [companies, countries];
    dictsCombined = companies + countries;
}



window.document.onload = function(e)
{
    getArticleText();
    getDicts();
    findMatches();
    addLinks();
};
