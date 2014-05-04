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
                    var search = "https://www.google.dk/search?q=";
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
    var companies = {
        "ARM Holdings": {
            "Term": "ARM Holdings",
            "Description": "ARM.L  Stockprice:\u00a3886,00  0,00         Industry: Semiconductors  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= ARM Holdings",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/6\/60\/ARM_logo.svg"
        },
        "Aberdeen Asset Management": {
            "Term": "Aberdeen Asset Management",
            "Description": "ADN.L  Stockprice:\u00a3445,90  + 2,50         Industry: Investment Management  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Aberdeen Asset Management",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/2\/20\/Aberdeen_Asset_Management_new_logo.png"
        },
        "Admiral Group": {
            "Term": "Admiral Group",
            "Description": "ADM.L  Stockprice:\u00a31.391,00  -12,00         Industry: Insurance  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Admiral Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/e\/ee\/Admiral_Group.svg"
        },
        "Aggreko": {
            "Term": "Aggreko",
            "Description": "AGK.L  Stockprice:\u00a31.651,72  + 6,72         Industry: Generator hire  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Aggreko",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/2\/27\/Aggreko_logo.png"
        },
        "Anglo American": {
            "Term": "Anglo American",
            "Description": "AAL.L  Stockprice:\u00a31.570,11  + 5,61         Industry: Metals and Mining  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Anglo American plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/7\/71\/AngloAmerican_logo.jpg"
        },
        "Antofagasta": {
            "Term": "Antofagasta",
            "Description": "ANTO.L  Stockprice:\u00a3790,50  + 14,50         Industry: Mining  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Antofagasta PLC",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/7\/78\/Antofagasta.svg"
        },
        "Ashtead Group": {
            "Term": "Ashtead Group",
            "Description": "ASHM.L  Stockprice:\u00a3350,27  + 0,37         Industry: Plant hire  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Ashtead Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/e\/eb\/AshteadLogo.PNG"
        },
        "Associated British Foods": {
            "Term": "Associated British Foods",
            "Description": "ABF.L  Stockprice:\u00a32.900,00  -97,00         Industry: Food processing  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Associated British Foods",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/1\/16\/Associated_British_Foods_Logo.svg"
        },
        "AstraZeneca": {
            "Term": "AstraZeneca",
            "Description": "AZN.L  Stockprice:\u00a34.808,00  -7,00         Industry: Pharmaceutical and biotechnology  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= AstraZeneca",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/4\/4f\/AstraZeneca.svg"
        },
        "Aviva": {
            "Term": "Aviva",
            "Description": "AV.L  Stockprice:\u00a3522,89  -2,11           Industry: Financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Aviva",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/0\/07\/Aviva.svg"
        },
        "BAE Systems": {
            "Term": "BAE Systems",
            "Description": "BA.L          Stockprice:\u00a3401,10  -0,10         Industry: Aerospace, Defence and Information security  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= BAE Systems",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/2\/20\/BAE_SYSTEMS.svg"
        },
        "BG Group": {
            "Term": "BG Group",
            "Description": "BG.L  Stockprice:\u00a31.246,05  + 8,55         Industry: Oil and gas  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= BG Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/6\/6a\/BG_Group.svg"
        },
        "BHP Billiton": {
            "Term": "BHP Billiton",
            "Description": "BLT.L  Stockprice:\u00a31.931,19  + 35,19         Industry: Metals and Mining  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= BHP Billiton",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/c\/cb\/BHP_Billiton.svg"
        },
        "BP": {
            "Term": "BP",
            "Description": "BP.L  Stockprice:\u00a3501,88  + 3,83         Industry: Oil and gas  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= BP",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/e\/e7\/BP_Logo.svg"
        },
        "BT Group": {
            "Term": "BT Group",
            "Description": "BT-A.L  Stockprice:\u00a3377,50  + 0,40         Industry: Telecommunications  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= BT Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/d\/d6\/BT_logo.svg"
        },
        "Babcock International Group": {
            "Term": "Babcock International Group",
            "Description": "   Industry: Support services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Babcock International Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/3\/36\/Babcockintlogo.png"
        },
        "Barclays": {
            "Term": "Barclays",
            "Description": "BARC.L  Stockprice:\u00a3258,50  + 2,35               Industry: Banking and Financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Barclays",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/7\/7e\/Barclays_logo.svg"
        },
        "Barratt Developments": {
            "Term": "Barratt Developments",
            "Description": "   Industry: Housebuilding  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Barratt Developments",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/4\/4e\/Barrattlogo.png"
        },
        "British American Tobacco": {
            "Term": "British American Tobacco",
            "Description": "BATS.L  Stockprice:\u00a33.396,50  -52,50         Industry: Tobacco  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= British American Tobacco",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/0\/05\/British_American_Tobacco_logo.svg"
        },
        "British Land Co": {
            "Term": "British Land Co",
            "Description": "BLND.L  Stockprice:\u00a3686,50  -3,50         Industry: Real estate  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= British Land Co",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/f\/f4\/British_Land.svg"
        },
        "British Sky Broadcasting Group": {
            "Term": "British Sky Broadcasting Group",
            "Description": "BSY.L  Stockprice:\u00a3889,00  -11,50         Industry: Mass media  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= British Sky Broadcasting Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/c\/cf\/Sky_logo.svg"
        },
        "Bunzl": {
            "Term": "Bunzl",
            "Description": "BNZL.L  Stockprice:\u00a31.652,00  -13,00         Industry: Distribution and outsourcing  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Bunzl",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/3\/33\/Bunzl-Logo.svg"
        },
        "Burberry Group": {
            "Term": "Burberry Group",
            "Description": "BRBY.L  Stockprice:\u00a31.492,00  -3,00         Industry: Fashion  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Burberry Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/0\/03\/Burberry_logo.png"
        },
        "CRH": {
            "Term": "CRH",
            "Description": "CRH.L  Stockprice:\u00a31.726,00  -3,00         Industry: Building materials  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= CRH PLC",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/f\/f0\/Crh_logo.png"
        },
        "Capita": {
            "Term": "Capita",
            "Description": "CPI.L  Stockprice:\u00a31.094,00  + 8,00         Industry: Business process outsourcing  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Capita",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/4\/4f\/Capita_logo.svg"
        },
        "Carnival": {
            "Term": "Carnival",
            "Description": "CCL.L  Stockprice:\u00a32.377,24  + 20,24         Industry: Hospitality and tourism  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Carnival PLC",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/5\/58\/Carnival.svg"
        },
        "Centrica": {
            "Term": "Centrica",
            "Description": "CNA.L  Stockprice:\u00a3328,80  -1,20         Industry: Utilities  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Centrica",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/c\/c1\/Centrica_logo_2008.svg"
        },
        "Coca-Cola HBC AG": {
            "Term": "Coca-Cola HBC AG",
            "Description": "   Industry: Beverages  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Coca-Cola HBC AG",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/0\/07\/Coca-Cola_HBC_AG_Official_Logo.jpg"
        },
        "Compass Group": {
            "Term": "Compass Group",
            "Description": "CPG.L  Stockprice:\u00a3945,50  + 4,00         Industry: Support services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Compass Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/4\/49\/Compass_Group.svg"
        },
        "Diageo": {
            "Term": "Diageo",
            "Description": "DGE.L  Stockprice:\u00a31.825,68  + 0,68         Industry: Beverages  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Diageo",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/7\/7d\/Diageo.svg"
        },
        "Easyjet": {
            "Term": "Easyjet",
            "Description": "   Industry: Airline  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Easyjet",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/1\/1b\/EasyJet_logo.svg"
        },
        "Experian": {
            "Term": "Experian",
            "Description": "EXPN.L  Stockprice:\u00a31.124,00  -11,00         Industry: Business services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Experian",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/f\/f8\/Experian.svg"
        },
        "Fresnillo": {
            "Term": "Fresnillo",
            "Description": "FRES.L  Stockprice:\u00a3832,00  + 2,00         Industry: Mining  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Fresnillo PLC",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/3\/37\/Fresnillo.svg"
        },
        "G4S": {
            "Term": "G4S",
            "Description": "GFS.L  Stockprice:\u00a3238,00  + 0,90         Industry: Security  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= G4S",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/b\/b1\/G4S.svg"
        },
        "GKN": {
            "Term": "GKN",
            "Description": "GKN.L  Stockprice:\u00a3382,90  -4,10 Industry: Automotive and aerospace  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= GKN",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/0\/0e\/GKN.svg"
        },
        "GlaxoSmithKline": {
            "Term": "GlaxoSmithKline",
            "Description": "GSK.L  Stockprice:\u00a31.627,50  -10,00         Industry: Pharmaceutical and biotechnology  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= GlaxoSmithKline",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/5\/5c\/GlaxoSmithKline_logo.svg"
        },
        "Glencore Xstrata": {
            "Term": "Glencore Xstrata",
            "Description": "GLEN.L  Stockprice:\u00a3317,37  + 1,32         Industry: Commodities, metals and mining  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Glencore Xstrata",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/5\/5d\/Glencore_Xstrata_logo.png"
        },
        "HSBC Hldgs": {
            "Term": "HSBC Hldgs",
            "Description": "HSBA.L  Stockprice:\u00a3605,70  -1,70         Industry: Banking and financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= HSBC Hldgs",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/5\/54\/HSBC.svg"
        },
        "Hammerson": {
            "Term": "Hammerson",
            "Description": "HMSO.L  Stockprice:\u00a3572,00  -5,00         Industry: Property  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Hammerson",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/a\/a4\/Hammerson.svg"
        },
        "Hargreaves Lansdown": {
            "Term": "Hargreaves Lansdown",
            "Description": "HL.L  Stockprice:\u00a31.193,00  -22,00         Industry: Financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Hargreaves Lansdown",
            "Image": "http:\/\/en.wikipedia.org\/wiki\/Hargreaves_Lansdown"
        },
        "IMI": {
            "Term": "IMI",
            "Description": "IMI.L  Stockprice:\u00a31.507,00  -1,00         Industry: Engineering  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= IMI PLC",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/4\/41\/Imiplclogo.PNG"
        },
        "ITV": {
            "Term": "ITV",
            "Description": "ITV.L  Stockprice:\u00a3184,50  -2,10         Industry: Media  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= ITV PLC",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/9\/92\/ITV_logo_2013.svg"
        },
        "Imperial Tobacco Group": {
            "Term": "Imperial Tobacco Group",
            "Description": "   Industry: Tobacco  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Imperial Tobacco Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/b\/bb\/Imperialtobaccologo.svg"
        },
        "InterContinental Hotels Group": {
            "Term": "InterContinental Hotels Group",
            "Description": "IAG.L  Stockprice:\u00a32.193,54  + 169,54         Industry: Hotels  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= InterContinental Hotels Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/4\/4c\/InterContinental_Hotels_Group.svg"
        },
        "International Consolidated Airlines Group": {
            "Term": "International Consolidated Airlines Group",
            "Description": "   Industry: Passenger air transport and air freight services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= International Consolidated Airlines Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/8\/8a\/International_Airlines_Group_logo.png"
        },
        "Intertek Group": {
            "Term": "Intertek Group",
            "Description": "ITRK.L  Stockprice:\u00a32.928,00  -17,00         Industry: Testing  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Intertek Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/f\/f1\/Interteklogo.PNG"
        },
        "Johnson Matthey": {
            "Term": "Johnson Matthey",
            "Description": "JMAT.L  Stockprice:\u00a33.308,00  -51,00         Industry: Chemicals and precious metals  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Johnson Matthey",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/2\/2c\/Johnson_Matthey.svg"
        },
        "Kingfisher": {
            "Term": "Kingfisher",
            "Description": "KGF.L  Stockprice:\u00a3426,40  + 8,40         Industry: Retail  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Kingfisher plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/8\/81\/Kingfisher_plc.png"
        },
        "Land Securities Group": {
            "Term": "Land Securities Group",
            "Description": "LAND.L  Stockprice:\u00a31.059,00  -1,00         Industry: Property  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Land Securities Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/b\/be\/Land_Securities.svg"
        },
        "Legal & General Group": {
            "Term": "Legal & General Group",
            "Description": "LGEN.L  Stockprice:\u00a3214,30  + 2,50 Industry: Financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Legal & General Group plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/1\/1c\/LegalAndGeneral_Logo.png"
        },
        "Lloyds Banking Group": {
            "Term": "Lloyds Banking Group",
            "Description": "LLOY.L  Stockprice:\u00a379,63  + 0,13         Industry: Banking and financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Lloyds Banking Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/2\/2e\/Lloyds_banking_group.svg"
        },
        "London Stock Exchange Group": {
            "Term": "London Stock Exchange Group",
            "Description": "   Industry: Financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= London Stock Exchange Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/e\/ee\/London_Stock_Exchange_Group.svg"
        },
        "Marks & Spencer Group": {
            "Term": "Marks & Spencer Group",
            "Description": "MKS.L  Stockprice:\u00a3440,80  -3,20         Industry: Retail  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Marks & Spencer plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/3\/37\/MARKS_%26_Spencer_logo.svg"
        },
        "Meggitt": {
            "Term": "Meggitt",
            "Description": "MGGT.L  Stockprice:\u00a3476,90  + 0,20         Industry: Aerospace and defence  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Meggitt",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/5\/57\/Meggittlogo.PNG"
        },
        "Melrose Industries": {
            "Term": "Melrose Industries",
            "Description": "   Industry: Finance  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Melrose PLC",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/b\/be\/Melrose_plc_logo.png"
        },
        "Mondi": {
            "Term": "Mondi",
            "Description": "   Industry: Packaging and paper  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Mondi",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/e\/e8\/Mondi.svg"
        },
        "Morrison (Wm) Supermarkets": {
            "Term": "Morrison (Wm) Supermarkets",
            "Description": "MRW.L  Stockprice:\u00a3196,20   -1,30         Industry: Retailing  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Morrison (Wm) Supermarkets",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/1\/1b\/Morrisons_Logo.svg"
        },
        "National Grid": {
            "Term": "National Grid",
            "Description": "NG.L  Stockprice:\u00a3838,58  + 2,08         Industry: Utilities  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= National Grid PLC",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/a\/aa\/National_Grid.svg"
        },
        "Next": {
            "Term": "Next",
            "Description": "NXT.L  Stockprice:\u00a36.610,00  -40,00         Industry: Retail  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Next plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/5\/54\/Next_2007-_logo.svg"
        },
        "Old Mutual": {
            "Term": "Old Mutual",
            "Description": "OML.L  Stockprice:\u00a3202,60  + 2,10         Industry: Financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Old Mutual",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/5\/5c\/Old_Mutual.svg"
        },
        "Pearson": {
            "Term": "Pearson",
            "Description": "PSON.L  Stockprice:\u00a31.094,00  -8,00         Industry: Media  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Pearson plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/d\/d2\/Pearson_Without_Strapline_Blue_RGB_HiRes.png"
        },
        "Persimmon": {
            "Term": "Persimmon",
            "Description": "   Industry: Housebuilding  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Persimmon plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/3\/30\/Persimmon.svg"
        },
        "Petrofac": {
            "Term": "Petrofac",
            "Description": "PFC.L  Stockprice:\u00a31.463,00  + 9,00         Industry: Engineering, procurement & construction and oil & gas  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Petrofac",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/8\/8f\/Petrofac.svg"
        },
        "Prudential": {
            "Term": "Prudential",
            "Description": "PRU.L  Stockprice:\u00a31.368,50  -4,50         Industry: Financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Prudential",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/9\/97\/Prudential_plc_logo.svg"
        },
        "RSA Insurance Group": {
            "Term": "RSA Insurance Group",
            "Description": "RSA.L  Stockprice:\u00a397,69  + 0,19         Industry: Insurance  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= RSA Insurance Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/8\/8c\/RSA_Insurance_Group_%28emblem%29.svg"
        },
        "Randgold Resources": {
            "Term": "Randgold Resources",
            "Description": "RRS.L  Stockprice:\u00a34.739,00  + 61,00         Industry: Mining  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Randgold Resources",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/c\/c5\/Randgoldlogo.PNG"
        },
        "Reckitt Benckiser Group": {
            "Term": "Reckitt Benckiser Group",
            "Description": "RB.L  Stockprice:\u00a34.840,00  -43,00         Industry: Consumer goods  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Reckitt Benckiser Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/f\/fb\/Reckitt_Benckiser_logo.png"
        },
        "Reed Elsevier": {
            "Term": "Reed Elsevier",
            "Description": "REL.L  Stockprice:\u00a3876,50  -7,50         Industry: Media  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Reed Elsevier",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/f\/fb\/Reed_Elsevier.svg"
        },
        "Resolution": {
            "Term": "Resolution",
            "Description": "RSL.L  Stockprice:\u00a3301,00  + 3,40               Industry: Insurance, pensions and life assurance  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Resolution",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/8\/8c\/Resolution_plc.jpg"
        },
        "Rexam": {
            "Term": "Rexam",
            "Description": "REX.L  Stockprice:\u00a3504,00  -6,00         Industry: Packaging  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Rexam",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/d\/d5\/Rexam.svg"
        },
        "Rio Tinto": {
            "Term": "Rio Tinto",
            "Description": "RIO.L  Stockprice:\u00a33.247,00  + 47,00   Industry: Metals and mining  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Rio Tinto",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/7\/78\/Rio_Tinto.svg"
        },
        "Rolls-Royce Holdings": {
            "Term": "Rolls-Royce Holdings",
            "Description": "RR.L  Stockprice:\u00a31.026,00  -14,00         Industry: Aerospace and defence  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Rolls-Royce Holdings",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/a\/ae\/Rolls-Royce_logo.svg"
        },
        "Royal Bank Of Scotland Group": {
            "Term": "Royal Bank Of Scotland Group",
            "Description": "RBS.L  Stockprice:\u00a3335,84  + 29,24         Industry: Financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Royal Bank Of Scotland Group",
            "Image": "http:\/\/en.wikipedia.org\/wiki\/Royal_Bank_Of_Scotland_Group"
        },
        "Royal Dutch Shell A": {
            "Term": "Royal Dutch Shell A",
            "Description": "   Industry: Oil and gas  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Royal Dutch Shell A",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/5\/5a\/Shell-logo.svg"
        },
        "Royal Dutch Shell B": {
            "Term": "Royal Dutch Shell B",
            "Description": "RDSB.L  Stockprice:\u00a32.533,00  + 28,50         Industry: Oil and gas  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Royal Dutch Shell B",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/5\/5a\/Shell-logo.svg"
        },
        "Royal Mail": {
            "Term": "Royal Mail",
            "Description": "   Industry: Postal services and courier  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Royal Mail",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/e\/ee\/Royal_Mail.svg"
        },
        "SABMiller": {
            "Term": "SABMiller",
            "Description": "SAB.L  Stockprice:\u00a33.252,33  + 42,83         Industry: Brewing and beverage  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= SABMiller",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/a\/a3\/SABMiller.svg"
        },
        "SSE": {
            "Term": "SSE",
            "Description": "SSE.L  Stockprice:\u00a31.530,24  + 1,24         Industry: Electric utility  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= SSE plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/6\/6e\/Scottish_and_Southern_Energy.svg"
        },
        "Sage Group": {
            "Term": "Sage Group",
            "Description": "SGE.L  Stockprice:\u00a3421,47  + 0,67         Industry: Software  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Sage Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/6\/62\/Sage.svg"
        },
        "Sainsbury (J)": {
            "Term": "Sainsbury (J)",
            "Description": "SBRY.L  Stockprice:\u00a3323,91  -1,19         Industry: Retailing  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Sainsbury (J)",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/d\/d2\/JSainsburys_Logo.svg"
        },
        "Schroders": {
            "Term": "Schroders",
            "Description": "SDRC.L  Stockprice:\u00a32.613,00  + 4,00 Industry: Investment management  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Schroders",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/d\/d5\/Schroders.svg"
        },
        "Severn Trent": {
            "Term": "Severn Trent",
            "Description": "SVT.L  Stockprice:\u00a31.833,00   -15,00         Industry: Water industry  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Severn Trent",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/5\/54\/Severn_Trent_PLC_Logo.png"
        },
        "Shire": {
            "Term": "Shire",
            "Description": "SHP.L  Stockprice:\u00a33.467,00  + 17,00         Industry: Pharmaceuticals  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Shire plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/1\/1d\/Shire_blue_logo.gif"
        },
        "Smith & Nephew": {
            "Term": "Smith & Nephew",
            "Description": "SN.L  Stockprice:\u00a3914,48  + 9,48         Industry: Medical equipment  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Smith & Nephew plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/d\/d1\/Smith_%26_Nephew.svg"
        },
        "Smiths Group": {
            "Term": "Smiths Group",
            "Description": "SMIN.L  Stockprice:\u00a31.321,00  -20,00         Industry: Engineering  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Smiths Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/e\/ed\/Smiths_Group.svg"
        },
        "Sports Direct International": {
            "Term": "Sports Direct International",
            "Description": "   Industry: Retailing  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Sports Direct International",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/a\/a5\/Sports_Direct.svg"
        },
        "St.James Place": {
            "Term": "St.James Place",
            "Description": "   Industry: Finance  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= St.James Place plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/1\/1e\/SJP_Wealth_Managemen_logo.jpg"
        },
        "Standard Chartered": {
            "Term": "Standard Chartered",
            "Description": "STAN.L  Stockprice:\u00a31.287,50  -1,50         Industry: Banking and financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Standard Chartered",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/a\/ae\/Standard_Chartered.svg"
        },
        "Standard Life": {
            "Term": "Standard Life",
            "Description": "SL.L  Stockprice:\u00a3384,50  -0,80 Industry: Financial services  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Standard Life",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/6\/62\/Standard_Life_logo.gif"
        },
        "TUI Travel": {
            "Term": "TUI Travel",
            "Description": "   Industry: Transport  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= TUI Travel",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/f\/f8\/TUI_Travel.svg"
        },
        "Tesco": {
            "Term": "Tesco",
            "Description": "TSCO.L  Stockprice:\u00a3285,50  -1,05 Industry: Retailing  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Tesco",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/b\/b0\/Tesco_Logo.svg"
        },
        "Travis Perkins": {
            "Term": "Travis Perkins",
            "Description": "   Industry: Business-to-business and retail  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Travis Perkins",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/d\/df\/Travis_Perkins.svg"
        },
        "Tullow Oil": {
            "Term": "Tullow Oil",
            "Description": "TLW.L  Stockprice:\u00a3883,50        + 3,00         Industry: Oil and gas exploration  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Tullow Oil",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/b\/bc\/Tullow_Oil.svg"
        },
        "Unilever": {
            "Term": "Unilever",
            "Description": "ULVR.L  Stockprice:\u00a32.606,00        -15,00 Industry: Consumer goods  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Unilever",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/e\/e4\/Unilever.svg"
        },
        "United Utilities Group": {
            "Term": "United Utilities Group",
            "Description": "UU.L  Stockprice:\u00a3794,00        0,00         Industry: Utility \u2013 water, wastewater  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= United Utilities Group plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/b\/bd\/UnitedUtilities.png"
        },
        "Vodafone Group": {
            "Term": "Vodafone Group",
            "Description": "VOD.L  Stockprice:\u00a3222,90       + 2,25         Industry: Telecommunications  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Vodafone Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/5\/57\/Vodafone_logo.svg"
        },
        "WPP": {
            "Term": "WPP",
            "Description": "WPP.L  Stockprice:\u00a31.286,00        0,00         Industry: Advertising and public relations  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= WPP plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/2\/2d\/WPP_Group.svg"
        },
        "Weir Group": {
            "Term": "Weir Group",
            "Description": "WEIR.L  Stockprice:\u00a32.654,00  + 20,00         Industry: Engineering  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Weir Group",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/9\/91\/WeirGroupLogo.png"
        },
        "Whitbread": {
            "Term": "Whitbread",
            "Description": "WTB.L  Stockprice:\u00a34.070,00  + 1,00         Industry: Leisure and hospitality  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Whitbread",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/f\/f0\/Whitbread_logo.png"
        },
        "William Hill": {
            "Term": "William Hill",
            "Description": "   Industry: Gambling  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= William Hill plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/en\/c\/cf\/William_Hill.svg"
        },
        "Wolseley": {
            "Term": "Wolseley",
            "Description": "WOS.L  Stockprice:\u00a33.475,00  + 24,00         Industry: Building materials  Read more here: http:\/\/en.wikipedia.org\/w\/index.php?search= Wolseley plc",
            "Image": "http:\/\/upload.wikimedia.org\/wikipedia\/commons\/7\/7a\/Wolseley.svg"
        }
    };

    var countries = {
        "Afghanistan": {
            "Term": "Afghanistan",
            "Description": "Capital city: Kabul<br \/>GDP per capita: 1083<br \/>Population: 29,824,536",
            "Image": "http:\/\/s-nordby.com\/img\/1.bmp"
        },
        "Albania": {
            "Term": "Albania",
            "Description": "Capital city: Tirana<br \/>GDP per capita: 7861<br \/>Population: 3,162,083",
            "Image": "http:\/\/s-nordby.com\/img\/2.bmp"
        },
        "Algeria": {
            "Term": "Algeria",
            "Description": "Capital city: Algiers<br \/>GDP per capita: 7643<br \/>Population: 38,481,705",
            "Image": "http:\/\/s-nordby.com\/img\/3.bmp"
        },
        "Andorra": {
            "Term": "Andorra",
            "Description": "Capital city: Andorra la Vella<br \/>GDP per capita: ..<br \/>Population: 78,36",
            "Image": "http:\/\/s-nordby.com\/img\/4.bmp"
        },
        "Angola": {
            "Term": "Angola",
            "Description": "Capital city: Luanda<br \/>GDP per capita: 5201<br \/>Population: 20,820,525",
            "Image": "http:\/\/s-nordby.com\/img\/5.bmp"
        },
        "Antigua": {
            "Term": "Antigua",
            "Description": "Capital city: St. Johns<br \/>GDP per capita: 14139<br \/>Population: 89,069",
            "Image": "http:\/\/s-nordby.com\/img\/6.bmp"
        },
        "Argentina": {
            "Term": "Argentina",
            "Description": "Capital city: Buenos Aires<br \/>GDP per capita: 15501<br \/>Population: 41,086,927",
            "Image": "http:\/\/s-nordby.com\/img\/7.bmp"
        },
        "Armenia": {
            "Term": "Armenia",
            "Description": "Capital city: Yerevan<br \/>GDP per capita: 5112<br \/>Population: 2,969,081",
            "Image": "http:\/\/s-nordby.com\/img\/8.bmp"
        },
        "Australia": {
            "Term": "Australia",
            "Description": "Capital city: Canberra<br \/>GDP per capita: 34548<br \/>Population: 22,722,000",
            "Image": "http:\/\/s-nordby.com\/img\/9.bmp"
        },
        "Austria": {
            "Term": "Austria",
            "Description": "Capital city: Vienna<br \/>GDP per capita: 36353<br \/>Population: 8,429,991",
            "Image": "http:\/\/s-nordby.com\/img\/10.bmp"
        },
        "Azerbaijan": {
            "Term": "Azerbaijan",
            "Description": "Capital city: Baku<br \/>GDP per capita: 8890<br \/>Population: 9,295,784",
            "Image": "http:\/\/s-nordby.com\/img\/11.bmp"
        },
        "The Bahamas": {
            "Term": "The Bahamas",
            "Description": "Capital city: Nassau<br \/>GDP per capita: 28239<br \/>Population: 371,96",
            "Image": "http:\/\/s-nordby.com\/img\/12.bmp"
        },
        "Bahrain": {
            "Term": "Bahrain",
            "Description": "Capital city: Bahrain<br \/>GDP per capita: 21345<br \/>Population: 1,317,827",
            "Image": "http:\/\/s-nordby.com\/img\/13.bmp"
        },
        "Bangladesh": {
            "Term": "Bangladesh",
            "Description": "Capital city: Dhaka<br \/>GDP per capita: 1568<br \/>Population: 154,695,368",
            "Image": "http:\/\/s-nordby.com\/img\/14.bmp"
        },
        "Barbados": {
            "Term": "Barbados",
            "Description": "Capital city: Bridgetown<br \/>GDP per capita: 17564<br \/>Population: 283,221",
            "Image": "http:\/\/s-nordby.com\/img\/15.bmp"
        },
        "Belarus": {
            "Term": "Belarus",
            "Description": "Capital city: Minsk<br \/>GDP per capita: 13191<br \/>Population: 9,464,000",
            "Image": "http:\/\/s-nordby.com\/img\/16.bmp"
        },
        "Belgium": {
            "Term": "Belgium",
            "Description": "Capital city: Brussels<br \/>GDP per capita: 33127<br \/>Population: 11,128,246",
            "Image": "http:\/\/s-nordby.com\/img\/17.bmp"
        },
        "Belize": {
            "Term": "Belize",
            "Description": "Capital city: Belmopan<br \/>GDP per capita: 5896<br \/>Population: 324,06",
            "Image": "http:\/\/s-nordby.com\/img\/18.bmp"
        },
        "Benin": {
            "Term": "Benin",
            "Description": "Capital city: Benin<br \/>GDP per capita: 1428<br \/>Population: 10,050,702",
            "Image": "http:\/\/s-nordby.com\/img\/19.bmp"
        },
        "Bhutan": {
            "Term": "Bhutan",
            "Description": "Capital city: Thimphu<br \/>GDP per capita: 5096<br \/>Population: 741,822",
            "Image": "http:\/\/s-nordby.com\/img\/20.bmp"
        },
        "Bolivia": {
            "Term": "Bolivia",
            "Description": "Capital city: Sucre<br \/>GDP per capita: 4499<br \/>Population: 10,496,285",
            "Image": "http:\/\/s-nordby.com\/img\/21.bmp"
        },
        "Bosnia and Herzegovina": {
            "Term": "Bosnia and Herzegovina",
            "Description": "Capital city: Sarajevo<br \/>GDP per capita: 7607<br \/>Population: 3,833,916",
            "Image": "http:\/\/s-nordby.com\/img\/22.bmp"
        },
        "Botswana": {
            "Term": "Botswana",
            "Description": "Capital city: Gaborone<br \/>GDP per capita: 12939<br \/>Population: 2,003,910",
            "Image": "http:\/\/s-nordby.com\/img\/23.bmp"
        },
        "Brazil": {
            "Term": "Brazil",
            "Description": "Capital city: Bras\ufffdlia<br \/>GDP per capita: 10278<br \/>Population: 198,656,019",
            "Image": "http:\/\/s-nordby.com\/img\/24.bmp"
        },
        "Brunei": {
            "Term": "Brunei",
            "Description": "Capital city: Bandar Seri Begawan<br \/>GDP per capita: 45507<br \/>Population: 412,238",
            "Image": "http:\/\/s-nordby.com\/img\/25.bmp"
        },
        "Bulgaria": {
            "Term": "Bulgaria",
            "Description": "Capital city: Sofia<br \/>GDP per capita: 11799<br \/>Population: 7,305,888",
            "Image": "http:\/\/s-nordby.com\/img\/26.bmp"
        },
        "Burkina": {
            "Term": "Burkina",
            "Description": "Capital city: Ouagadougou<br \/>GDP per capita: 1149<br \/>Population: 16,460,141",
            "Image": "http:\/\/s-nordby.com\/img\/27.bmp"
        },
        "Burundi": {
            "Term": "Burundi",
            "Description": "Capital city: Bujumbura<br \/>GDP per capita: 533<br \/>Population: 9,849,569",
            "Image": "http:\/\/s-nordby.com\/img\/28.bmp"
        },
        "Cambodia": {
            "Term": "Cambodia",
            "Description": "Capital city: Phnom Penh<br \/>GDP per capita: 2080<br \/>Population: 14,864,646",
            "Image": "http:\/\/s-nordby.com\/img\/29.bmp"
        },
        "Cameroon": {
            "Term": "Cameroon",
            "Description": "Capital city: Yaound\ufffd<br \/>GDP per capita: 2090<br \/>Population: 21,699,631",
            "Image": "http:\/\/s-nordby.com\/img\/30.bmp"
        },
        "Canada": {
            "Term": "Canada",
            "Description": "Capital city: Ottawa<br \/>GDP per capita: 35716<br \/>Population: 34,754,312",
            "Image": "http:\/\/s-nordby.com\/img\/31.bmp"
        },
        "Cape Verde": {
            "Term": "Cape Verde",
            "Description": "Capital city: Praia<br \/>GDP per capita: 3616<br \/>Population: 494,401",
            "Image": "http:\/\/s-nordby.com\/img\/32.bmp"
        },
        "The Central African Republic": {
            "Term": "The Central African Republic",
            "Description": "Capital city: Bangui<br \/>GDP per capita: 716<br \/>Population: 4,525,209",
            "Image": "http:\/\/s-nordby.com\/img\/33.bmp"
        },
        "Chad": {
            "Term": "Chad",
            "Description": "Capital city: N'Djamena<br \/>GDP per capita: 1343<br \/>Population: 12,448,175",
            "Image": "http:\/\/s-nordby.com\/img\/34.bmp"
        },
        "Chile": {
            "Term": "Chile",
            "Description": "Capital city: Santiago<br \/>GDP per capita: 15272<br \/>Population: 17,464,814",
            "Image": "http:\/\/s-nordby.com\/img\/35.bmp"
        },
        "Colombia": {
            "Term": "Colombia",
            "Description": "Capital city: Bogot\ufffd<br \/>GDP per capita: 8861<br \/>Population: 47,704,427",
            "Image": "http:\/\/s-nordby.com\/img\/36.bmp"
        },
        "The Comoros": {
            "Term": "The Comoros",
            "Description": "Capital city: Moroni<br \/>GDP per capita: 980<br \/>Population: 717,503",
            "Image": "http:\/\/s-nordby.com\/img\/37.bmp"
        },
        "Costa Rica": {
            "Term": "Costa Rica",
            "Description": "Capital city: San Jos\ufffd<br \/>GDP per capita: 10732<br \/>Population: 4,805,295",
            "Image": "http:\/\/s-nordby.com\/img\/38.bmp"
        },
        "Cote d'Ivoire": {
            "Term": "Cote d'Ivoire",
            "Description": "Capital city: Yamoussoukro<br \/>GDP per capita: 1581<br \/>Population: 19,839,750",
            "Image": "http:\/\/s-nordby.com\/img\/39.bmp"
        },
        "Croatia": {
            "Term": "Croatia",
            "Description": "Capital city: Zagreb<br \/>GDP per capita: 16162<br \/>Population: 4,267,600",
            "Image": "http:\/\/s-nordby.com\/img\/40.bmp"
        },
        "Cuba": {
            "Term": "Cuba",
            "Description": "Capital city: Havana<br \/>GDP per capita: ..<br \/>Population: 11,270,957",
            "Image": "http:\/\/s-nordby.com\/img\/41.bmp"
        },
        "Cyprus": {
            "Term": "Cyprus",
            "Description": "Capital city: Nicosia<br \/>GDP per capita: 26045<br \/>Population: 1,128,994",
            "Image": "http:\/\/s-nordby.com\/img\/42.bmp"
        },
        "The Czech Republic": {
            "Term": "The Czech Republic",
            "Description": "Capital city: Prague<br \/>GDP per capita: 23967<br \/>Population: 10,510,785",
            "Image": "http:\/\/s-nordby.com\/img\/43.bmp"
        },
        "The Democratic Republic of the Congo": {
            "Term": "The Democratic Republic of the Congo",
            "Description": "Capital city: Kinshasa<br \/>GDP per capita: 3885<br \/>Population: 65,705,093",
            "Image": "http:\/\/s-nordby.com\/img\/44.bmp"
        },
        "Denmark": {
            "Term": "Denmark",
            "Description": "Capital city: Copenhagen<br \/>GDP per capita: 32399<br \/>Population: 5,591,572",
            "Image": "http:\/\/s-nordby.com\/img\/45.bmp"
        },
        "Djibouti": {
            "Term": "Djibouti",
            "Description": "Capital city: Djibouti<br \/>GDP per capita: 2087<br \/>Population: 859,652",
            "Image": "http:\/\/s-nordby.com\/img\/46.bmp"
        },
        "Dominica": {
            "Term": "Dominica",
            "Description": "Capital city: Roseau<br \/>GDP per capita: 11120<br \/>Population: 71,684",
            "Image": "http:\/\/s-nordby.com\/img\/47.bmp"
        },
        "The Dominican Republic": {
            "Term": "The Dominican Republic",
            "Description": "Capital city: Santo Domingo<br \/>GDP per capita: 8651<br \/>Population: 10,276,621",
            "Image": "http:\/\/s-nordby.com\/img\/48.bmp"
        },
        "East Timor": {
            "Term": "East Timor",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "http:\/\/s-nordby.com\/img\/49.bmp"
        },
        "Ecuador": {
            "Term": "Ecuador",
            "Description": "Capital city: Quito<br \/>GDP per capita: 7443<br \/>Population: 15,492,264",
            "Image": "http:\/\/s-nordby.com\/img\/50.bmp"
        },
        "Egypt": {
            "Term": "Egypt",
            "Description": "Capital city: Cairo<br \/>GDP per capita: 5547<br \/>Population: 80,721,874",
            "Image": "http:\/\/s-nordby.com\/img\/51.bmp"
        },
        "El Salvador": {
            "Term": "El Salvador",
            "Description": "Capital city: San Salvador<br \/>GDP per capita: 6032<br \/>Population: 6,297,394",
            "Image": "http:\/\/s-nordby.com\/img\/52.bmp"
        },
        "Equatorial Guinea": {
            "Term": "Equatorial Guinea",
            "Description": "Capital city: Malabo<br \/>GDP per capita: 32026<br \/>Population: 736,296",
            "Image": "http:\/\/s-nordby.com\/img\/53.bmp"
        },
        "Eritrea": {
            "Term": "Eritrea",
            "Description": "Capital city: Asmara<br \/>GDP per capita: 516<br \/>Population: 6,130,922",
            "Image": "http:\/\/s-nordby.com\/img\/55.bmp"
        },
        "Estonia": {
            "Term": "Estonia",
            "Description": "Capital city: Tallinn<br \/>GDP per capita: 17885<br \/>Population: 1,329,301",
            "Image": "http:\/\/s-nordby.com\/img\/56.bmp"
        },
        "Ethiopia": {
            "Term": "Ethiopia",
            "Description": "Capital city: Addis Ababa<br \/>GDP per capita: 979<br \/>Population: 91,728,849",
            "Image": "http:\/\/s-nordby.com\/img\/57.bmp"
        },
        "Fiji": {
            "Term": "Fiji",
            "Description": "Capital city: Suva<br \/>GDP per capita: 4199<br \/>Population: 874,742",
            "Image": "http:\/\/s-nordby.com\/img\/58.bmp"
        },
        "Finland": {
            "Term": "Finland",
            "Description": "Capital city: Helsinki<br \/>GDP per capita: 32254<br \/>Population: 5,413,971",
            "Image": "http:\/\/s-nordby.com\/img\/59.bmp"
        },
        "France": {
            "Term": "France",
            "Description": "Capital city: Paris<br \/>GDP per capita: 29819<br \/>Population: 65,696,689",
            "Image": "http:\/\/s-nordby.com\/img\/60.bmp"
        },
        "Gabon": {
            "Term": "Gabon",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "http:\/\/s-nordby.com\/img\/61.bmp"
        },
        "The Gambia": {
            "Term": "The Gambia",
            "Description": "Capital city: Banjul <br \/>GDP per capita: 1873<br \/>Population: 1,791,225",
            "Image": "http:\/\/s-nordby.com\/img\/62.bmp"
        },
        "Georgia": {
            "Term": "Georgia",
            "Description": "Capital city: Tbilisi<br \/>GDP per capita: 4826<br \/>Population: 4,490,700",
            "Image": "http:\/\/s-nordby.com\/img\/63.bmp"
        },
        "Germany": {
            "Term": "Germany",
            "Description": "Capital city: Berlin<br \/>GDP per capita: 34437<br \/>Population: 80,425,823",
            "Image": "http:\/\/s-nordby.com\/img\/64.bmp"
        },
        "Ghana": {
            "Term": "Ghana",
            "Description": "Capital city: Accra<br \/>GDP per capita: 1652<br \/>Population: 25,366,462",
            "Image": "http:\/\/s-nordby.com\/img\/65.bmp"
        },
        "Greece": {
            "Term": "Greece",
            "Description": "Capital city: Athens<br \/>GDP per capita: 22558<br \/>Population: 11,092,771",
            "Image": "http:\/\/s-nordby.com\/img\/66.bmp"
        },
        "Grenada": {
            "Term": "Grenada",
            "Description": "Capital city: St. George's<br \/>GDP per capita: 9806<br \/>Population: 105,483",
            "Image": "http:\/\/s-nordby.com\/img\/67.bmp"
        },
        "Guatemala": {
            "Term": "Guatemala",
            "Description": "Capital city: Guatemala City<br \/>GDP per capita: 4351<br \/>Population: 15,082,831",
            "Image": "http:\/\/s-nordby.com\/img\/68.bmp"
        },
        "Guinea": {
            "Term": "Guinea",
            "Description": "Capital city: Conakry<br \/>GDP per capita: 990<br \/>Population: 11,451,273",
            "Image": "http:\/\/s-nordby.com\/img\/69.bmp"
        },
        "Guinea-Bissau": {
            "Term": "Guinea-Bissau",
            "Description": "Capital city: Bissau<br \/>GDP per capita: 1097<br \/>Population: 1,663,558",
            "Image": "http:\/\/s-nordby.com\/img\/70.bmp"
        },
        "Guyana": {
            "Term": "Guyana",
            "Description": "Capital city: Georgetown<br \/>GDP per capita: 3104<br \/>Population: 795,369",
            "Image": "http:\/\/s-nordby.com\/img\/71.bmp"
        },
        "Haiti": {
            "Term": "Haiti",
            "Description": "Capital city: Port-au-Prince<br \/>GDP per capita: 1034<br \/>Population: 10,173,775",
            "Image": "http:\/\/s-nordby.com\/img\/72.bmp"
        },
        "Honduras": {
            "Term": "Honduras",
            "Description": "Capital city: Tegucigalpa<br \/>GDP per capita: 3566<br \/>Population: 7,935,846",
            "Image": "http:\/\/s-nordby.com\/img\/73.bmp"
        },
        "Hungary": {
            "Term": "Hungary",
            "Description": "Capital city: Budapest<br \/>GDP per capita: 17295<br \/>Population: 9,920,362",
            "Image": "http:\/\/s-nordby.com\/img\/74.bmp"
        },
        "Iceland": {
            "Term": "Iceland",
            "Description": "Capital city: Reykjav\ufffdk<br \/>GDP per capita: 33618<br \/>Population: 320,716",
            "Image": "http:\/\/s-nordby.com\/img\/75.bmp"
        },
        "India": {
            "Term": "India",
            "Description": "Capital city: New Delhi<br \/>GDP per capita: 3203<br \/>Population: 1,236,686,732",
            "Image": "http:\/\/s-nordby.com\/img\/76.bmp"
        },
        "Indonesia": {
            "Term": "Indonesia",
            "Description": "Capital city: Jakarta<br \/>GDP per capita: 4094<br \/>Population: 246,864,191",
            "Image": "http:\/\/s-nordby.com\/img\/77.bmp"
        },
        "Iran": {
            "Term": "Iran",
            "Description": "Capital city: Tehran<br \/>GDP per capita: 10462<br \/>Population: 76,424,443",
            "Image": "http:\/\/s-nordby.com\/img\/78.bmp"
        },
        "Iraq": {
            "Term": "Iraq",
            "Description": "Capital city: Baghdad<br \/>GDP per capita: 3412<br \/>Population: 32,578,209",
            "Image": "http:\/\/s-nordby.com\/img\/79.bmp"
        },
        "Ireland": {
            "Term": "Ireland",
            "Description": "Capital city: Dublin<br \/>GDP per capita: 35640<br \/>Population: 4,586,897",
            "Image": "http:\/\/s-nordby.com\/img\/80.bmp"
        },
        "Israel": {
            "Term": "Israel",
            "Description": "Capital city: Jerusalem<br \/>GDP per capita: 26720<br \/>Population: 7,910,500",
            "Image": "http:\/\/s-nordby.com\/img\/81.bmp"
        },
        "Italy": {
            "Term": "Italy",
            "Description": "Capital city: Rome<br \/>GDP per capita: 27069<br \/>Population: 59,539,717",
            "Image": "http:\/\/s-nordby.com\/img\/82.bmp"
        },
        "Jamaica": {
            "Term": "Jamaica",
            "Description": "Capital city: Kingston<br \/>GDP per capita: 7074<br \/>Population: 2,707,805",
            "Image": "http:\/\/s-nordby.com\/img\/83.bmp"
        },
        "Japan": {
            "Term": "Japan",
            "Description": "Capital city: Tokyo<br \/>GDP per capita: 30660<br \/>Population: 127,561,489",
            "Image": "http:\/\/s-nordby.com\/img\/84.bmp"
        },
        "Jordan": {
            "Term": "Jordan",
            "Description": "Capital city: Amman<br \/>GDP per capita: 5269<br \/>Population: 6,318,000",
            "Image": "http:\/\/s-nordby.com\/img\/85.bmp"
        },
        "Kazakhstan": {
            "Term": "Kazakhstan",
            "Description": "Capital city: Astana<br \/>GDP per capita: 11568<br \/>Population: 16,791,425",
            "Image": "http:\/\/s-nordby.com\/img\/86.bmp"
        },
        "Kenya": {
            "Term": "Kenya",
            "Description": "Capital city: Nairobi<br \/>GDP per capita: 1507<br \/>Population: 43,178,141",
            "Image": "http:\/\/s-nordby.com\/img\/87.bmp"
        },
        "Kiribati": {
            "Term": "Kiribati",
            "Description": "Capital city: South Tarawa<br \/>GDP per capita: 2220<br \/>Population: 100,786",
            "Image": "http:\/\/s-nordby.com\/img\/88.bmp"
        },
        "Kosovo": {
            "Term": "Kosovo",
            "Description": "Capital city: Pristina<br \/>GDP per capita: <br \/>Population: 1,807,106",
            "Image": "http:\/\/s-nordby.com\/img\/89.bmp"
        },
        "Kuwait": {
            "Term": "Kuwait",
            "Description": "Capital city: Kuwait City<br \/>GDP per capita: 47935<br \/>Population: 3,250,496",
            "Image": "http:\/\/s-nordby.com\/img\/90.bmp"
        },
        "Kyrgyzstan": {
            "Term": "Kyrgyzstan",
            "Description": "Capital city: Bishkek<br \/>GDP per capita: 2126<br \/>Population: 5,607,200",
            "Image": "http:\/\/s-nordby.com\/img\/91.bmp"
        },
        "Laos": {
            "Term": "Laos",
            "Description": "Capital city: Vientiane<br \/>GDP per capita: 2464<br \/>Population: 6,645,827",
            "Image": "http:\/\/s-nordby.com\/img\/92.bmp"
        },
        "Latvia": {
            "Term": "Latvia",
            "Description": "Capital city: Riga<br \/>GDP per capita: 13773<br \/>Population: 2,034,319",
            "Image": "http:\/\/s-nordby.com\/img\/93.bmp"
        },
        "Lebanon": {
            "Term": "Lebanon",
            "Description": "Capital city: Beirut<br \/>GDP per capita: 12900<br \/>Population: 4,424,888",
            "Image": "http:\/\/s-nordby.com\/img\/94.bmp"
        },
        "Lesotho": {
            "Term": "Lesotho",
            "Description": "Capital city: Maseru<br \/>GDP per capita: 1504<br \/>Population: 2,051,545",
            "Image": "http:\/\/s-nordby.com\/img\/95.bmp"
        },
        "Liberia": {
            "Term": "Liberia",
            "Description": "Capital city: Monrovia<br \/>GDP per capita: 506<br \/>Population: 4,190,435",
            "Image": "http:\/\/s-nordby.com\/img\/96.bmp"
        },
        "Libya": {
            "Term": "Libya",
            "Description": "Capital city: Tripoli<br \/>GDP per capita: 15361<br \/>Population: 6,154,623",
            "Image": "http:\/\/s-nordby.com\/img\/97.bmp"
        },
        "Liechtenstein": {
            "Term": "Liechtenstein",
            "Description": "Capital city: Vaduz<br \/>GDP per capita: ..<br \/>Population: 36,656",
            "Image": "http:\/\/s-nordby.com\/img\/98.bmp"
        },
        "Lithuania": {
            "Term": "Lithuania",
            "Description": "Capital city: Vilnius<br \/>GDP per capita: 16877<br \/>Population: 2,987,773",
            "Image": "http:\/\/s-nordby.com\/img\/99.bmp"
        },
        "Luxembourg": {
            "Term": "Luxembourg",
            "Description": "Capital city: Luxembourg City<br \/>GDP per capita: 68459<br \/>Population: 530,946",
            "Image": "http:\/\/s-nordby.com\/img\/100.bmp"
        },
        "Macedonia": {
            "Term": "Macedonia",
            "Description": "Capital city: Skopje<br \/>GDP per capita: <br \/>Population: 2,105,575",
            "Image": "http:\/\/s-nordby.com\/img\/101.bmp"
        },
        "Madagascar": {
            "Term": "Madagascar",
            "Description": "Capital city: Antananarivo<br \/>GDP per capita: 853<br \/>Population: 22,293,914",
            "Image": "http:\/\/s-nordby.com\/img\/102.bmp"
        },
        "Malawi": {
            "Term": "Malawi",
            "Description": "Capital city: Lilongwe<br \/>GDP per capita: 805<br \/>Population: 15,906,483",
            "Image": "http:\/\/s-nordby.com\/img\/103.bmp"
        },
        "Malaysia": {
            "Term": "Malaysia",
            "Description": "Capital city: Kuala Lumpur<br \/>GDP per capita: 13672<br \/>Population: 29,239,927",
            "Image": "http:\/\/s-nordby.com\/img\/104.bmp"
        },
        "Maldives": {
            "Term": "Maldives",
            "Description": "Capital city: Mal\ufffd<br \/>GDP per capita: 7834<br \/>Population: 338,442",
            "Image": "http:\/\/s-nordby.com\/img\/105.bmp"
        },
        "Mali": {
            "Term": "Mali",
            "Description": "Capital city: Barnako<br \/>GDP per capita: 964<br \/>Population: 14,853,572",
            "Image": "http:\/\/s-nordby.com\/img\/106.bmp"
        },
        "Malta": {
            "Term": "Malta",
            "Description": "Capital city: Valletta<br \/>GDP per capita: 23007<br \/>Population: 419,455",
            "Image": "http:\/\/s-nordby.com\/img\/107.bmp"
        },
        "The Marshall Islands": {
            "Term": "The Marshall Islands",
            "Description": "Capital city: Majuro<br \/>GDP per capita: ..<br \/>Population: 52,555",
            "Image": "http:\/\/s-nordby.com\/img\/108.bmp"
        },
        "Mauritania": {
            "Term": "Mauritania",
            "Description": "Capital city: Nouakchott<br \/>GDP per capita: 2255<br \/>Population: 3,796,141",
            "Image": "http:\/\/s-nordby.com\/img\/109.bmp"
        },
        "Mauritius": {
            "Term": "Mauritius",
            "Description": "Capital city: Port Louis<br \/>GDP per capita: 12737<br \/>Population: 1,291,456",
            "Image": "http:\/\/s-nordby.com\/img\/110.bmp"
        },
        "Mexico": {
            "Term": "Mexico",
            "Description": "Capital city: Mexico City<br \/>GDP per capita: 12776<br \/>Population: 120,847,477",
            "Image": "http:\/\/s-nordby.com\/img\/111.bmp"
        },
        "Micronesia": {
            "Term": "Micronesia",
            "Description": "Capital city: Palikir<br \/>GDP per capita: 3017<br \/>Population: 103,395",
            "Image": "http:\/\/s-nordby.com\/img\/112.bmp"
        },
        "Moldova": {
            "Term": "Moldova",
            "Description": "Capital city: Chi?in?u<br \/>GDP per capita: 2975<br \/>Population: 3,559,519",
            "Image": "http:\/\/s-nordby.com\/img\/113.bmp"
        },
        "Monaco": {
            "Term": "Monaco",
            "Description": "Capital city: Monaco<br \/>GDP per capita: ..<br \/>Population: 37,579",
            "Image": "http:\/\/s-nordby.com\/img\/114.bmp"
        },
        "Mongolia": {
            "Term": "Mongolia",
            "Description": "Capital city: Ulan Bator<br \/>GDP per capita: 4178<br \/>Population: 2,796,484",
            "Image": "http:\/\/s-nordby.com\/img\/115.bmp"
        },
        "Montenegro": {
            "Term": "Montenegro",
            "Description": "Capital city: Podgorica<br \/>GDP per capita: 10402<br \/>Population: 621,081",
            "Image": "http:\/\/s-nordby.com\/img\/116.bmp"
        },
        "Morocco": {
            "Term": "Morocco",
            "Description": "Capital city: Rabat<br \/>GDP per capita: 4373<br \/>Population: 32,521,143",
            "Image": "http:\/\/s-nordby.com\/img\/117.bmp"
        },
        "Mozambique": {
            "Term": "Mozambique",
            "Description": "Capital city: Maputo<br \/>GDP per capita: 861<br \/>Population: 25,203,395",
            "Image": "http:\/\/s-nordby.com\/img\/118.bmp"
        },
        "Myanmar": {
            "Term": "Myanmar",
            "Description": "Capital city: Naypyidaw<br \/>GDP per capita: ..<br \/>Population: 52,797,319",
            "Image": "http:\/\/s-nordby.com\/img\/119.bmp"
        },
        "Namibia": {
            "Term": "Namibia",
            "Description": "Capital city: Windhoek<br \/>GDP per capita: 5986<br \/>Population: 2,259,393",
            "Image": "http:\/\/s-nordby.com\/img\/120.bmp"
        },
        "Nauru": {
            "Term": "Nauru",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "http:\/\/s-nordby.com\/img\/121.bmp"
        },
        "Nepal": {
            "Term": "Nepal",
            "Description": "Capital city: Kathmandu<br \/>GDP per capita: 1102<br \/>Population: 27,474,377",
            "Image": "http:\/\/s-nordby.com\/img\/122.bmp"
        },
        "The Netherlands": {
            "Term": "The Netherlands",
            "Description": "Capital city: Amsterdam<br \/>GDP per capita: 37251<br \/>Population: 16,754,962",
            "Image": "http:\/\/s-nordby.com\/img\/123.bmp"
        },
        "New Zealand": {
            "Term": "New Zealand",
            "Description": "Capital city: Wellington<br \/>GDP per capita: 24818<br \/>Population: 4,433,100",
            "Image": "http:\/\/s-nordby.com\/img\/124.bmp"
        },
        "Nicaragua": {
            "Term": "Nicaragua",
            "Description": "Capital city: Managua<br \/>GDP per capita: 2579<br \/>Population: 5,991,733",
            "Image": "http:\/\/s-nordby.com\/img\/125.bmp"
        },
        "Niger": {
            "Term": "Niger",
            "Description": "Capital city: Niamey<br \/>GDP per capita: 642<br \/>Population: 17,157,042",
            "Image": "http:\/\/s-nordby.com\/img\/126.bmp"
        },
        "Nigeria": {
            "Term": "Nigeria",
            "Description": "Capital city: Abuja<br \/>GDP per capita: 2221<br \/>Population: 168,833,776",
            "Image": "http:\/\/s-nordby.com\/img\/127.bmp"
        },
        "North Korea": {
            "Term": "North Korea",
            "Description": "Capital city: Pyongyang<br \/>GDP per capita: ..<br \/>Population: 24,763,188",
            "Image": "http:\/\/s-nordby.com\/img\/128.bmp"
        },
        "Norway": {
            "Term": "Norway",
            "Description": "Capital city: Oslo<br \/>GDP per capita: 46982<br \/>Population: 5,018,573",
            "Image": "http:\/\/s-nordby.com\/img\/129.bmp"
        },
        "Oman": {
            "Term": "Oman",
            "Description": "Capital city: Muscat<br \/>GDP per capita: 25330<br \/>Population: 3,314,001",
            "Image": "http:\/\/s-nordby.com\/img\/130.bmp"
        },
        "Pakistan": {
            "Term": "Pakistan",
            "Description": "Capital city: Islamabad<br \/>GDP per capita: 2424<br \/>Population: 179,160,111",
            "Image": "http:\/\/s-nordby.com\/img\/131.bmp"
        },
        "Palau": {
            "Term": "Palau",
            "Description": "Capital city: Ngerulmud<br \/>GDP per capita: 13176<br \/>Population: 20,754",
            "Image": "http:\/\/s-nordby.com\/img\/132.bmp"
        },
        "Panama": {
            "Term": "Panama",
            "Description": "Capital city: Pana City<br \/>GDP per capita: 13766<br \/>Population: 3,802,281",
            "Image": "http:\/\/s-nordby.com\/img\/133.bmp"
        },
        "Papua New Guinea": {
            "Term": "Papua New Guinea",
            "Description": "Capital city: Port Moresby<br \/>GDP per capita: 2363<br \/>Population: 7,167,010",
            "Image": "http:\/\/s-nordby.com\/img\/134.bmp"
        },
        "Paraguay": {
            "Term": "Paraguay",
            "Description": "Capital city: Asunci\ufffdn<br \/>GDP per capita: 4752<br \/>Population: 6,687,361",
            "Image": "http:\/\/s-nordby.com\/img\/135.bmp"
        },
        "The People's Republic of China": {
            "Term": "The People's Republic of China",
            "Description": "Capital city: Beijing<br \/>GDP per capita: 7418<br \/>Population: 1,350,695,000",
            "Image": "http:\/\/s-nordby.com\/img\/136.bmp"
        },
        "Peru": {
            "Term": "Peru",
            "Description": "Capital city: Lima<br \/>GDP per capita: 9049<br \/>Population: 29,987,800",
            "Image": "http:\/\/s-nordby.com\/img\/137.bmp"
        },
        "The Philippines": {
            "Term": "The Philippines",
            "Description": "Capital city: Manila<br \/>GDP per capita: 3631<br \/>Population: 96,706,764",
            "Image": "http:\/\/s-nordby.com\/img\/138.bmp"
        },
        "Poland": {
            "Term": "Poland",
            "Description": "Capital city: Warsaw<br \/>GDP per capita: 18087<br \/>Population: 38,535,873",
            "Image": "http:\/\/s-nordby.com\/img\/139.bmp"
        },
        "Portugal": {
            "Term": "Portugal",
            "Description": "Capital city: Lisbon<br \/>GDP per capita: 21317<br \/>Population: 10,514,844",
            "Image": "http:\/\/s-nordby.com\/img\/140.bmp"
        },
        "Qatar": {
            "Term": "Qatar",
            "Description": "Capital city: Doha<br \/>GDP per capita: 77987<br \/>Population: 2,050,514",
            "Image": "http:\/\/s-nordby.com\/img\/141.bmp"
        },
        "The Republic of China": {
            "Term": "The Republic of China",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "http:\/\/s-nordby.com\/img\/142.bmp"
        },
        "The Republic of Congo": {
            "Term": "The Republic of Congo",
            "Description": "Capital city: Brazzaville<br \/>GDP per capita: 329<br \/>Population: 4,337,051",
            "Image": "http:\/\/s-nordby.com\/img\/143.bmp"
        },
        "Romania": {
            "Term": "Romania",
            "Description": "Capital city: Bucharest<br \/>GDP per capita: 10905<br \/>Population: 20,076,727",
            "Image": "http:\/\/s-nordby.com\/img\/144.bmp"
        },
        "Russia": {
            "Term": "Russia",
            "Description": "Capital city: Moscow<br \/>GDP per capita: 14808<br \/>Population: 143,533,000",
            "Image": "http:\/\/s-nordby.com\/img\/145.bmp"
        },
        "Rwanda": {
            "Term": "Rwanda",
            "Description": "Capital city: Kigali<br \/>GDP per capita: 1097<br \/>Population: 11,457,801",
            "Image": "http:\/\/s-nordby.com\/img\/146.bmp"
        },
        "Saint Kitts": {
            "Term": "Saint Kitts",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "http:\/\/s-nordby.com\/img\/147.bmp"
        },
        "Saint Lucia": {
            "Term": "Saint Lucia",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "http:\/\/s-nordby.com\/img\/148.bmp"
        },
        "Saint Vincent": {
            "Term": "Saint Vincent",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "http:\/\/s-nordby.com\/img\/149.bmp"
        },
        "Samoa": {
            "Term": "Samoa",
            "Description": "Capital city: Apira<br \/>GDP per capita: 4008<br \/>Population: 188,889",
            "Image": "http:\/\/s-nordby.com\/img\/150.bmp"
        },
        "San Marino": {
            "Term": "San Marino",
            "Description": "Capital city: San Marino<br \/>GDP per capita: ..<br \/>Population: 31,247",
            "Image": "http:\/\/s-nordby.com\/img\/151.bmp"
        },
        "Sao Tome and Principe": {
            "Term": "Sao Tome and Principe",
            "Description": "Capital city: S\ufffdo Tom\ufffd<br \/>GDP per capita: 1805<br \/>Population: 188,098",
            "Image": "http:\/\/s-nordby.com\/img\/152.bmp"
        },
        "Saudi Arabia": {
            "Term": "Saudi Arabia",
            "Description": "Capital city: Riyadh<br \/>GDP per capita: 21430<br \/>Population: 28,287,855",
            "Image": "http:\/\/s-nordby.com\/img\/153.bmp"
        },
        "Senegal": {
            "Term": "Senegal",
            "Description": "Capital city: Dakar<br \/>GDP per capita: 1737<br \/>Population: 13,726,021",
            "Image": "http:\/\/s-nordby.com\/img\/154.bmp"
        },
        "Serbia": {
            "Term": "Serbia",
            "Description": "Capital city: Belgrade<br \/>GDP per capita: 9809<br \/>Population: 7,223,887",
            "Image": "http:\/\/s-nordby.com\/img\/155.bmp"
        },
        "The Seychelles": {
            "Term": "The Seychelles",
            "Description": "Capital city: Victoria<br \/>GDP per capita: 23172<br \/>Population: 88,303",
            "Image": "http:\/\/s-nordby.com\/img\/156.bmp"
        },
        "Sierra Leone": {
            "Term": "Sierra Leone",
            "Description": "Capital city: Freetown<br \/>GDP per capita: 769<br \/>Population: 5,978,727",
            "Image": "http:\/\/s-nordby.com\/img\/157.bmp"
        },
        "Singapore": {
            "Term": "Singapore",
            "Description": "Capital city: Singapore<br \/>GDP per capita: 53591<br \/>Population: 5,312,400",
            "Image": "http:\/\/s-nordby.com\/img\/158.bmp"
        },
        "Slovakia": {
            "Term": "Slovakia",
            "Description": "Capital city: Bratislava<br \/>GDP per capita: 20757<br \/>Population: 5,407,579",
            "Image": "http:\/\/s-nordby.com\/img\/159.bmp"
        },
        "Slovenia": {
            "Term": "Slovenia",
            "Description": "Capital city: Ljubljana<br \/>GDP per capita: 24967<br \/>Population: 2,057,159",
            "Image": "http:\/\/s-nordby.com\/img\/160.bmp"
        },
        "The Solomon Islands": {
            "Term": "The Solomon Islands",
            "Description": "Capital city: Honiara<br \/>GDP per capita: 2581<br \/>Population: 549,598",
            "Image": "http:\/\/s-nordby.com\/img\/161.bmp"
        },
        "Somalia": {
            "Term": "Somalia",
            "Description": "Capital city: Mogadishu<br \/>GDP per capita: ..<br \/>Population: 10,195,134",
            "Image": "http:\/\/s-nordby.com\/img\/162.bmp"
        },
        "South Africa": {
            "Term": "South Africa",
            "Description": "Capital city: Pretoria<br \/>GDP per capita: 9678<br \/>Population: 52,274,945",
            "Image": "http:\/\/s-nordby.com\/img\/163.bmp"
        },
        "South Korea": {
            "Term": "South Korea",
            "Description": "Capital city: Seoul<br \/>GDP per capita: 27541<br \/>Population: 50,004,441",
            "Image": "http:\/\/s-nordby.com\/img\/164.bmp"
        },
        "Spain": {
            "Term": "Spain",
            "Description": "Capital city: Madrid<br \/>GDP per capita: 27063<br \/>Population: 46,761,264",
            "Image": "http:\/\/s-nordby.com\/img\/165.bmp"
        },
        "Sri Lanka": {
            "Term": "Sri Lanka",
            "Description": "Capital city: Sri Jayawardenepura Kotte<br \/>GDP per capita: 4929<br \/>Population: 20,328,000",
            "Image": "http:\/\/s-nordby.com\/img\/166.bmp"
        },
        "Sudan": {
            "Term": "Sudan",
            "Description": "Capital city: Khartoum<br \/>GDP per capita: 1878<br \/>Population: 37,195,349",
            "Image": "http:\/\/s-nordby.com\/img\/167.bmp"
        },
        "Suriname": {
            "Term": "Suriname",
            "Description": "Capital city: Paramaribo<br \/>GDP per capita: 7110<br \/>Population: 534,541",
            "Image": "http:\/\/s-nordby.com\/img\/168.bmp"
        },
        "Swaziland": {
            "Term": "Swaziland",
            "Description": "Capital city: Mbabane<br \/>GDP per capita: 5349<br \/>Population: 1,230,985",
            "Image": "http:\/\/s-nordby.com\/img\/169.bmp"
        },
        "Sweden": {
            "Term": "Sweden",
            "Description": "Capital city: Stockholm<br \/>GDP per capita: 35048<br \/>Population: 9,519,374",
            "Image": "http:\/\/s-nordby.com\/img\/170.bmp"
        },
        "Switzerland": {
            "Term": "Switzerland",
            "Description": "Capital city: Bern<br \/>GDP per capita: 37979<br \/>Population: 7,996,861",
            "Image": "http:\/\/s-nordby.com\/img\/171.bmp"
        },
        "Syria": {
            "Term": "Syria",
            "Description": "Capital city: Damascus<br \/>GDP per capita: 4741<br \/>Population: 22,399,254",
            "Image": "http:\/\/s-nordby.com\/img\/172.bmp"
        },
        "Tajikistan": {
            "Term": "Tajikistan",
            "Description": "Capital city: Dushanbe<br \/>GDP per capita: 2052<br \/>Population: 8,008,990",
            "Image": "http:\/\/s-nordby.com\/img\/173.bmp"
        },
        "Tanzania": {
            "Term": "Tanzania",
            "Description": "Capital city: Dar Es Salaam<br \/>GDP per capita: 1334<br \/>Population: 47,783,107",
            "Image": "http:\/\/s-nordby.com\/img\/174.bmp"
        },
        "Thailand": {
            "Term": "Thailand",
            "Description": "Capital city: Bangkok<br \/>GDP per capita: 7633<br \/>Population: 66,785,001",
            "Image": "http:\/\/s-nordby.com\/img\/175.bmp"
        },
        "Togo": {
            "Term": "Togo",
            "Description": "Capital city: Lom\ufffd<br \/>GDP per capita: 914<br \/>Population: 6,642,928",
            "Image": "http:\/\/s-nordby.com\/img\/176.bmp"
        },
        "Tonga": {
            "Term": "Tonga",
            "Description": "Capital city: Nuku'alofa<br \/>GDP per capita: 4092<br \/>Population: 104,941",
            "Image": "http:\/\/s-nordby.com\/img\/177.bmp"
        },
        "Trinidad and Tobago": {
            "Term": "Trinidad and Tobago",
            "Description": "Capital city: Port of Spain<br \/>GDP per capita: 22761<br \/>Population: 1,337,439",
            "Image": "http:\/\/s-nordby.com\/img\/178.bmp"
        },
        "Tunisia": {
            "Term": "Tunisia",
            "Description": "Capital city: Tunis<br \/>GDP per capita: 8258<br \/>Population: 10,777,500",
            "Image": "http:\/\/s-nordby.com\/img\/179.bmp"
        },
        "Turkey": {
            "Term": "Turkey",
            "Description": "Capital city: Ankara<br \/>GDP per capita: 13466<br \/>Population: 73,997,128",
            "Image": "http:\/\/s-nordby.com\/img\/180.bmp"
        },
        "Turkmenistan": {
            "Term": "Turkmenistan",
            "Description": "Capital city: Ashgabat<br \/>GDP per capita: 8055<br \/>Population: 5,172,931",
            "Image": "http:\/\/s-nordby.com\/img\/181.bmp"
        },
        "Tuvalu": {
            "Term": "Tuvalu",
            "Description": "Capital city: Funafuti<br \/>GDP per capita: ..<br \/>Population: 9,86",
            "Image": "http:\/\/s-nordby.com\/img\/182.bmp"
        },
        "Uganda": {
            "Term": "Uganda",
            "Description": "Capital city: Kampala<br \/>GDP per capita: 1188<br \/>Population: 36,345,860",
            "Image": "http:\/\/s-nordby.com\/img\/183.bmp"
        },
        "Ukraine": {
            "Term": "Ukraine",
            "Description": "Capital city: Kiev<br \/>GDP per capita: 6359<br \/>Population: 45,593,300",
            "Image": "http:\/\/s-nordby.com\/img\/184.bmp"
        },
        "The United Arab Emirates": {
            "Term": "The United Arab Emirates",
            "Description": "Capital city: Abu Dhabi<br \/>GDP per capita: 42293<br \/>Population: 9,205,651",
            "Image": "http:\/\/s-nordby.com\/img\/185.bmp"
        },
        "The United Kingdom": {
            "Term": "The United Kingdom",
            "Description": "Capital city: Capital city: London<br \/> <br \/>GDP per capita: 32474<br \/>Population: 63,612,729",
            "Image": "http:\/\/s-nordby.com\/img\/186.bmp"
        },
        "The United States": {
            "Term": "The United States",
            "Description": "Capital city: Washington, D.C.<br \/>GDP per capita: 42486<br \/>Population: 313,914,040",
            "Image": "http:\/\/s-nordby.com\/img\/187.bmp"
        },
        "Uruguay": {
            "Term": "Uruguay",
            "Description": "Capital city: Montevideo<br \/>GDP per capita: 13315<br \/>Population: 3,395,253",
            "Image": "http:\/\/s-nordby.com\/img\/188.bmp"
        },
        "Uzbekistan": {
            "Term": "Uzbekistan",
            "Description": "Capital city: Tashkent<br \/>GDP per capita: 2903<br \/>Population: 29,774,500",
            "Image": "http:\/\/s-nordby.com\/img\/189.bmp"
        },
        "Vanuatu": {
            "Term": "Vanuatu",
            "Description": "Capital city: Port Vila<br \/>GDP per capita: 4062<br \/>Population: 247,262",
            "Image": "http:\/\/s-nordby.com\/img\/190.bmp"
        },
        "The Vatican City": {
            "Term": "The Vatican City",
            "Description": "Capital city: Caracas<br \/>GDP per capita: 11258<br \/>Population: 29,954,782",
            "Image": "http:\/\/s-nordby.com\/img\/191.bmp"
        },
        "Venezuela": {
            "Term": "Venezuela",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "http:\/\/s-nordby.com\/img\/192.bmp"
        },
        "Vietnam": {
            "Term": "Vietnam",
            "Description": "Capital city: Hanoi<br \/>GDP per capita: 3013<br \/>Population: 88,772,900",
            "Image": "http:\/\/s-nordby.com\/img\/193.bmp"
        },
        "Western Sahara": {
            "Term": "Western Sahara",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "http:\/\/s-nordby.com\/img\/194.bmp"
        },
        "Yemen": {
            "Term": "Yemen",
            "Description": "Capital city: Sana'a<br \/>GDP per capita: 2060<br \/>Population: 23,852,409",
            "Image": "http:\/\/s-nordby.com\/img\/195.bmp"
        },
        "Zambia": {
            "Term": "Zambia",
            "Description": "Capital city: Lusaka<br \/>GDP per capita: 1423<br \/>Population: 14,075,099",
            "Image": "http:\/\/s-nordby.com\/img\/196.bmp"
        },
        "Zimbabwe": {
            "Term": "Zimbabwe",
            "Description": "Capital city: Harare<br \/>GDP per capita: ..<br \/>Population: 13,724,317",
            "Image": "http:\/\/s-nordby.com\/img\/197.bmp"
        }
    };

    var terms = {
        "Caspian Sea": {
            "Term": "Caspian Sea",
            "Description": "The Caspian Sea, located in western Asia on the eastern edges of Europe, is the largest lake on the planet.",
            "Image": ""
        },
        "Shah Deniz": {
            "Term": "Shah Deniz",
            "Description": "Shah Deniz gas field is the largest natural gas field in Azerbaijan. It is situated in the South Caspian Sea, off the coast of Azerbaijan.",
            "Image": "http:\/\/www.offshoreenergytoday.com\/wp-content\/uploads\/2013\/09\/Shah-Deniz-Consortium-Signs-Major-Gas-Sales-Deal-with-European-Buyers.jpg"
        },
        "European": {
            "Term": "European",
            "Description": "Anything relating to or characteristic of Europe or its inhabitants",
            "Image": ""
        },
        "E.ON": {
            "Term": "E.ON",
            "Description": "A major investor-owned energy supplier who  facilities across Europe, Russia, and North America.",
            "Image": ""
        },
        "Adriatic Sea": {
            "Term": "Adriatic Sea",
            "Description": "A part of the Mediterranean Sea. It is positioned between the eastern coastline of Italy and the coastline of countries of the Balkan Peninsula (Slovenia, Croatia, Bosnia and Herzegovina, Montenegro and Albania).",
            "Image": ""
        },
        "Britain": {
            "Term": "Britain",
            "Description": "Great Britain, also known as Britain, is an island in the Atlantic Ocean off the north-western coast of continental Europe.",
            "Image": ""
        },
        "Statoil": {
            "Term": "Statoil",
            "Description": "A Norwegian multinational oil and gas company.",
            "Image": ""
        },
        "Ilham Aliyev": {
            "Term": "Ilham Aliyev",
            "Description": "President of Azerbaijan, since 2003.",
            "Image": "http:\/\/www.trend.az\/article_photo\/2009\/10\/30\/Ilham_Aliyev_301009_9.jpg"
        },
        "Amnesty International": {
            "Term": "Amnesty International",
            "Description": "A non-governmental organisation focused on human rights.",
            "Image": ""
        },
        "Al Cook": {
            "Term": "Al Cook",
            "Description": "",
            "Image": "http:\/\/www.azerbaijantoday.az\/ARCHIVE\/29\/photos\/18bp.jpg"
        },
        "BOTAS": {
            "Term": "BOTAS",
            "Description": "The Petroleum Pipeline Corporation is the state-owned crude oil and natural gas pipelines and trading company in Turkey.",
            "Image": ""
        },
        "European Union": {
            "Term": "European Union",
            "Description": "An economic and political union of 28 member states located in Europe.",
            "Image": ""
        },
        "Trans Adriatic Pipeline": {
            "Term": "Trans Adriatic Pipeline",
            "Description": "A natural gas pipeline project. The pipeline will start in Greece, cross Albania and the Adriatic Sea and come ashore in southern Italy, allowing gas to flow directly from the Caspian region to European markets.",
            "Image": ""
        },
        "SOCAR": {
            "Term": "SOCAR",
            "Description": "A state-owned oil and natural gas corporation of Azerbaijan.",
            "Image": ""
        },
        "Deepwater Horizon": {
            "Term": "Deepwater Horizon",
            "Description": "A drillingrig that exploded in april 2010 and leaked oil in the sea.",
            "Image": "http:\/\/static.guim.co.uk\/sys-images\/Business\/Pix\/pictures\/2010\/10\/19\/1287476298203\/Deepwater-Horizon-006.jpg"
        },
        "South Caucusus": {
            "Term": "South Caucusus",
            "Description": "The South Caucasus is a geopolitical region located on the border of Eastern Europe and Southwest Asia. It consists of the countries Armenia and the majority of Georgia and Azerbaijan.",
            "Image": ""
        },
        "Trans-Anatolian Pipeline": {
            "Term": "Trans-Anatolian Pipeline",
            "Description": "The Trans-Anatolia Gas Pipeline is a gas pipeline project that will carry Azerbaijani natural gas to Europe through Turkey.",
            "Image": ""
        },
        "Baku Tsibilisi Ceyhan": {
            "Term": "Baku Tsibilisi Ceyhan",
            "Description": "The 1,768km Baku-Tbilisi-Ceyhan pipeline transports oil across Azerbaijan, Georgia and Turkey from the ACG field which is a large complex of oil fields in the Caspian Sea.",
            "Image": ""
        },
        "Corner House": {
            "Term": "Corner House",
            "Description": "A grassroot organization that supports democratic and community movements for environmental and social justice.",
            "Image": ""
        },
        "Marriott": {
            "Term": "Marriott",
            "Description": "A large chain of hotels all over the world.",
            "Image": ""
        },
        "Platform": {
            "Term": "Platform",
            "Description": "Platform London is an interdisciplinary London-based art and campaigning collective founded in 1983 that creates projects with social justice and environmental justice themes.",
            "Image": ""
        },
        "The Oil Road": {
            "Term": "The Oil Road",
            "Description": "A book about oil imported from the Caspian.",
            "Image": ""
        },
        "Euro-Caspian": {
            "Term": "Euro-Caspian",
            "Description": "The Trans-Caspian (also called Euro-Caspian) Gas Pipeline is a project which if built would transport natural gas from Kazakhstan and Turkmenistan to central Europe, circumventing both Russia and Iran.",
            "Image": ""
        },
        "EU": {
            "Term": "EU",
            "Description": "The European Union is a supra-national governing body in Europe. 28 nations are part of the EU.",
            "Image": ""
        },
        "Azeri": {
            "Term": "Azeri",
            "Description": "The people of the Republic of Azerbaijan. Their official language is Azerbaijani.",
            "Image": ""
        },
        "UK": {
            "Term": "UK",
            "Description": "The United Kingdom is an island-nation located north-west of Europe's mainland. It is the world's sixth-largest economy.",
            "Image": ""
        }
    };

    news = {
        "response": {
            "status": "ok",
            "userTier": "free",
            "total": 528,
            "startIndex": 1,
            "pageSize": 10,
            "currentPage": 1,
            "pages": 53,
            "orderBy": "newest",
            "results": [
                {
                    "id": "guardian-observer-style-guide-s",
                    "sectionId": "info",
                    "sectionName": "Info",
                    "webPublicationDate": "2014-05-02T17:51:00Z",
                    "webTitle": "Guardian and Observer style guide: S",
                    "webUrl": "http://www.theguardian.com/guardian-observer-style-guide-s",
                    "apiUrl": "http://content.guardianapis.com/guardian-observer-style-guide-s"
                },
                {
                    "id": "football/2014/may/01/azerbaijan-sponsorship-atletico-madrid-spectacular-success",
                    "sectionId": "football",
                    "sectionName": "Football",
                    "webPublicationDate": "2014-05-01T13:25:00Z",
                    "webTitle": "Azerbaijan's sponsorship of Atlético Madrid proves spectacular success | Owen Gibson",
                    "webUrl": "http://www.theguardian.com/football/2014/may/01/azerbaijan-sponsorship-atletico-madrid-spectacular-success",
                    "apiUrl": "http://content.guardianapis.com/football/2014/may/01/azerbaijan-sponsorship-atletico-madrid-spectacular-success"
                },
                {
                    "id": "world/2014/apr/25/interview-samereh-alinejad-iranian-mother-spared-sons-killer",
                    "sectionId": "world",
                    "sectionName": "World news",
                    "webPublicationDate": "2014-04-25T18:27:20Z",
                    "webTitle": "Iranian mother who spared her son's killer: 'Vengeance has left my heart'",
                    "webUrl": "http://www.theguardian.com/world/2014/apr/25/interview-samereh-alinejad-iranian-mother-spared-sons-killer",
                    "apiUrl": "http://content.guardianapis.com/world/2014/apr/25/interview-samereh-alinejad-iranian-mother-spared-sons-killer"
                },
                {
                    "id": "world/2014/apr/23/putin-military-exercises-ukraine-border",
                    "sectionId": "world",
                    "sectionName": "World news",
                    "webPublicationDate": "2014-04-23T16:55:31Z",
                    "webTitle": "Putin's military exercises are more than a game",
                    "webUrl": "http://www.theguardian.com/world/2014/apr/23/putin-military-exercises-ukraine-border",
                    "apiUrl": "http://content.guardianapis.com/world/2014/apr/23/putin-military-exercises-ukraine-border"
                },
                {
                    "id": "world/2014/apr/23/us-warns-russia-ukraine-moscow-snap-military-exercises",
                    "sectionId": "world",
                    "sectionName": "World news",
                    "webPublicationDate": "2014-04-23T16:37:00Z",
                    "webTitle": "Russia warns it will respond if interests attacked in Ukraine",
                    "webUrl": "http://www.theguardian.com/world/2014/apr/23/us-warns-russia-ukraine-moscow-snap-military-exercises",
                    "apiUrl": "http://content.guardianapis.com/world/2014/apr/23/us-warns-russia-ukraine-moscow-snap-military-exercises"
                },
                {
                    "id": "business/2014/apr/22/energy-supply-russia-ukraine-gas-rich-countries-human-rights",
                    "sectionId": "business",
                    "sectionName": "Business",
                    "webPublicationDate": "2014-04-22T14:37:00Z",
                    "webTitle": "UK energy quest highlights human rights concerns in gas-rich countries",
                    "webUrl": "http://www.theguardian.com/business/2014/apr/22/energy-supply-russia-ukraine-gas-rich-countries-human-rights",
                    "apiUrl": "http://content.guardianapis.com/business/2014/apr/22/energy-supply-russia-ukraine-gas-rich-countries-human-rights"
                },
                {
                    "id": "world/2014/apr/15/ukraine-military-forces-russia-live-blog",
                    "sectionId": "world",
                    "sectionName": "World news",
                    "webPublicationDate": "2014-04-15T21:49:36Z",
                    "webTitle": "Ukraine crisis: Kiev launches 'anti-terror operation' in east – live updates",
                    "webUrl": "http://www.theguardian.com/world/2014/apr/15/ukraine-military-forces-russia-live-blog",
                    "apiUrl": "http://content.guardianapis.com/world/2014/apr/15/ukraine-military-forces-russia-live-blog"
                },
                {
                    "id": "world/iran-blog/gallery/2014/apr/15/iranian-fashion-between-the-veils",
                    "sectionId": "world",
                    "sectionName": "World news",
                    "webPublicationDate": "2014-04-15T11:47:54Z",
                    "webTitle": "Iranian fashion: between the veils",
                    "webUrl": "http://www.theguardian.com/world/iran-blog/gallery/2014/apr/15/iranian-fashion-between-the-veils",
                    "apiUrl": "http://content.guardianapis.com/world/iran-blog/gallery/2014/apr/15/iranian-fashion-between-the-veils"
                },
                {
                    "id": "world/2014/apr/01/nato-eastern-europe-defences-russia-putin-crimea",
                    "sectionId": "world",
                    "sectionName": "World news",
                    "webPublicationDate": "2014-04-01T17:33:16Z",
                    "webTitle": "Nato moves to bolster eastern European defences against Russia",
                    "webUrl": "http://www.theguardian.com/world/2014/apr/01/nato-eastern-europe-defences-russia-putin-crimea",
                    "apiUrl": "http://content.guardianapis.com/world/2014/apr/01/nato-eastern-europe-defences-russia-putin-crimea"
                },
                {
                    "id": "world/2014/apr/01/nato-plans-stronger-military-ties-armenia-azerbaijan-moldova",
                    "sectionId": "world",
                    "sectionName": "World news",
                    "webPublicationDate": "2014-04-01T11:21:17Z",
                    "webTitle": "Nato plans stronger military ties to ex-Soviet states south of Russia",
                    "webUrl": "http://www.theguardian.com/world/2014/apr/01/nato-plans-stronger-military-ties-armenia-azerbaijan-moldova",
                    "apiUrl": "http://content.guardianapis.com/world/2014/apr/01/nato-plans-stronger-military-ties-armenia-azerbaijan-moldova"
                }
            ]
        }
    };

    dicts = [companies, countries, terms];
    dictsCombined = companies
        + Object.keys(countries)
        + Object.keys(terms);
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

            var guardian = "http://content.guardianapis.com/search?api-key=mediahackdays2014&q=";
            $.ajax({
                url: guardian + keyword,
                dataType: 'jsonp',
                success: function(data) {
                    console.log(data);/*
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
                    }*/
                }
            });
            break;
        }
    }
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
findMatches();
addLinks();
