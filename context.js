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
                    console.log("found" + keyword);
                    var search = "https://www.google.dk/search?q=";
                    var href = search + encodeURIComponent(keyword);
                    var link = "<a href=\"" + href + "\""
                        + " onmouseover=\"hover(this);\""
                        + " onmouseout=\"unhover(this);\""
                        + ">" + keyword + "</a>";
                    articleDiv.innerHTML = articleDiv.innerHTML.replace(keyword, link);
                }
            }
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
    articleHTML = articleDiv.innerHTML;
}


/*
  This should ideally figure out which dicts to download.
  For now, we're going to hardcode them for sake of demo.
  TODO: async?
*/
function getDicts()
{
    var companies = ["ARM Holdings", "Aberdeen Asset Management", "Admiral Group", "Aggreko", "Anglo American", "Antofagasta", "Ashtead Group", "Associated British Foods", "AstraZeneca", "Aviva", "BAE Systems", "BG Group", "BHP Billiton", "BP", "BT Group", "Babcock International Group", "Barclays", "Barratt Developments", "British American Tobacco", "British Land Co", "British Sky Broadcasting Group", "Bunzl", "Burberry Group", "CRH", "Capita", "Carnival", "Centrica", "Coca-Cola HBC AG", "Compass Group", "Diageo", "Easyjet", "Experian", "Fresnillo", "G4S", "GKN", "GlaxoSmithKline", "Glencore Xstrata", "HSBC Hldgs", "Hammerson", "Hargreaves Lansdown", "IMI", "ITV", "Imperial Tobacco Group", "InterContinental Hotels Group", "International Consolidated Airlines Group", "Intertek Group", "Johnson Matthey", "Kingfisher", "Land Securities Group", "Legal & General Group", "Lloyds Banking Group", "London Stock Exchange Group", "Marks & Spencer Group", "Meggitt", "Melrose Industries", "Mondi", "Morrison (Wm) Supermarkets", "National Grid", "Next", "Old Mutual", "Pearson", "Persimmon", "Petrofac", "Prudential", "RSA Insurance Group", "Randgold Resources", "Reckitt Benckiser Group", "Reed Elsevier", "Resolution", "Rexam", "Rio Tinto", "Rolls-Royce Holdings", "Royal Bank Of Scotland Group", "Royal Dutch Shell A", "Royal Dutch Shell B", "Royal Mail", "SABMiller", "SSE", "Sage Group", "Sainsbury (J)", "Schroders", "Severn Trent", "Shire", "Smith & Nephew", "Smiths Group", "Sports Direct International", "St.James Place", "Standard Chartered", "Standard Life", "TUI Travel", "Tesco", "Travis Perkins", "Tullow Oil", "Unilever", "United Utilities Group", "Vodafone Group", "WPP", "Weir Group", "Whitbread", "William Hill", "Wolseley"];

    var countries = {
        "Afghanistan": {
            "Term": "Afghanistan",
            "Description": "Capital city: Kabul<br \/>GDP per capita: 1083<br \/>Population: 29,824,536",
            "Image": "img\/flag_0.bmp"
        },
        "Albania": {
            "Term": "Albania",
            "Description": "Capital city: Tirana<br \/>GDP per capita: 7861<br \/>Population: 3,162,083",
            "Image": "img\/flag_1.bmp"
        },
        "Algeria": {
            "Term": "Algeria",
            "Description": "Capital city: Algiers<br \/>GDP per capita: 7643<br \/>Population: 38,481,705",
            "Image": "img\/flag_2.bmp"
        },
        "Andorra": {
            "Term": "Andorra",
            "Description": "Capital city: Andorra la Vella<br \/>GDP per capita: ..<br \/>Population: 78,36",
            "Image": "img\/flag_3.bmp"
        },
        "Angola": {
            "Term": "Angola",
            "Description": "Capital city: Luanda<br \/>GDP per capita: 5201<br \/>Population: 20,820,525",
            "Image": "img\/flag_4.bmp"
        },
        "Antigua": {
            "Term": "Antigua",
            "Description": "Capital city: St. Johns<br \/>GDP per capita: 14139<br \/>Population: 89,069",
            "Image": "img\/flag_5.bmp"
        },
        "Argentina": {
            "Term": "Argentina",
            "Description": "Capital city: Buenos Aires<br \/>GDP per capita: 15501<br \/>Population: 41,086,927",
            "Image": "img\/flag_6.bmp"
        },
        "Armenia": {
            "Term": "Armenia",
            "Description": "Capital city: Yerevan<br \/>GDP per capita: 5112<br \/>Population: 2,969,081",
            "Image": "img\/flag_7.bmp"
        },
        "Australia": {
            "Term": "Australia",
            "Description": "Capital city: Canberra<br \/>GDP per capita: 34548<br \/>Population: 22,722,000",
            "Image": "img\/flag_8.bmp"
        },
        "Austria": {
            "Term": "Austria",
            "Description": "Capital city: Vienna<br \/>GDP per capita: 36353<br \/>Population: 8,429,991",
            "Image": "img\/flag_9.bmp"
        },
        "Azerbaijan": {
            "Term": "Azerbaijan",
            "Description": "Capital city: Baku<br \/>GDP per capita: 8890<br \/>Population: 9,295,784",
            "Image": "img\/flag_10.bmp"
        },
        "The Bahamas": {
            "Term": "The Bahamas",
            "Description": "Capital city: Nassau<br \/>GDP per capita: 28239<br \/>Population: 371,96",
            "Image": "img\/flag_11.bmp"
        },
        "Bahrain": {
            "Term": "Bahrain",
            "Description": "Capital city: Bahrain<br \/>GDP per capita: 21345<br \/>Population: 1,317,827",
            "Image": "img\/flag_12.bmp"
        },
        "Bangladesh": {
            "Term": "Bangladesh",
            "Description": "Capital city: Dhaka<br \/>GDP per capita: 1568<br \/>Population: 154,695,368",
            "Image": "img\/flag_13.bmp"
        },
        "Barbados": {
            "Term": "Barbados",
            "Description": "Capital city: Bridgetown<br \/>GDP per capita: 17564<br \/>Population: 283,221",
            "Image": "img\/flag_14.bmp"
        },
        "Belarus": {
            "Term": "Belarus",
            "Description": "Capital city: Minsk<br \/>GDP per capita: 13191<br \/>Population: 9,464,000",
            "Image": "img\/flag_15.bmp"
        },
        "Belgium": {
            "Term": "Belgium",
            "Description": "Capital city: Brussels<br \/>GDP per capita: 33127<br \/>Population: 11,128,246",
            "Image": "img\/flag_16.bmp"
        },
        "Belize": {
            "Term": "Belize",
            "Description": "Capital city: Belmopan<br \/>GDP per capita: 5896<br \/>Population: 324,06",
            "Image": "img\/flag_17.bmp"
        },
        "Benin": {
            "Term": "Benin",
            "Description": "Capital city: Benin<br \/>GDP per capita: 1428<br \/>Population: 10,050,702",
            "Image": "img\/flag_18.bmp"
        },
        "Bhutan": {
            "Term": "Bhutan",
            "Description": "Capital city: Thimphu<br \/>GDP per capita: 5096<br \/>Population: 741,822",
            "Image": "img\/flag_19.bmp"
        },
        "Boli": {
            "Term": "Boli",
            "Description": "Capital city: Sucre<br \/>GDP per capita: 4499<br \/>Population: 10,496,285",
            "Image": "img\/flag_20.bmp"
        },
        "Bosnia and Herzegovina": {
            "Term": "Bosnia and Herzegovina",
            "Description": "Capital city: Sarajevo<br \/>GDP per capita: 7607<br \/>Population: 3,833,916",
            "Image": "img\/flag_21.bmp"
        },
        "Botswana": {
            "Term": "Botswana",
            "Description": "Capital city: Gaborone<br \/>GDP per capita: 12939<br \/>Population: 2,003,910",
            "Image": "img\/flag_22.bmp"
        },
        "Brazil": {
            "Term": "Brazil",
            "Description": "Capital city: Bras\ufffdlia<br \/>GDP per capita: 10278<br \/>Population: 198,656,019",
            "Image": "img\/flag_23.bmp"
        },
        "Brunei": {
            "Term": "Brunei",
            "Description": "Capital city: Bandar Seri Begawan<br \/>GDP per capita: 45507<br \/>Population: 412,238",
            "Image": "img\/flag_24.bmp"
        },
        "Bulgaria": {
            "Term": "Bulgaria",
            "Description": "Capital city: Sofia<br \/>GDP per capita: 11799<br \/>Population: 7,305,888",
            "Image": "img\/flag_25.bmp"
        },
        "Burkina": {
            "Term": "Burkina",
            "Description": "Capital city: Ouagadougou<br \/>GDP per capita: 1149<br \/>Population: 16,460,141",
            "Image": "img\/flag_26.bmp"
        },
        "Burundi": {
            "Term": "Burundi",
            "Description": "Capital city: Bujumbura<br \/>GDP per capita: 533<br \/>Population: 9,849,569",
            "Image": "img\/flag_27.bmp"
        },
        "Cambodia": {
            "Term": "Cambodia",
            "Description": "Capital city: Phnom Penh<br \/>GDP per capita: 2080<br \/>Population: 14,864,646",
            "Image": "img\/flag_28.bmp"
        },
        "Cameroon": {
            "Term": "Cameroon",
            "Description": "Capital city: Yaound\ufffd<br \/>GDP per capita: 2090<br \/>Population: 21,699,631",
            "Image": "img\/flag_29.bmp"
        },
        "Canada": {
            "Term": "Canada",
            "Description": "Capital city: Ottawa<br \/>GDP per capita: 35716<br \/>Population: 34,754,312",
            "Image": "img\/flag_30.bmp"
        },
        "Cape Verde": {
            "Term": "Cape Verde",
            "Description": "Capital city: Praia<br \/>GDP per capita: 3616<br \/>Population: 494,401",
            "Image": "img\/flag_31.bmp"
        },
        "The Central African Republic": {
            "Term": "The Central African Republic",
            "Description": "Capital city: Bangui<br \/>GDP per capita: 716<br \/>Population: 4,525,209",
            "Image": "img\/flag_32.bmp"
        },
        "Chad": {
            "Term": "Chad",
            "Description": "Capital city: N'Djamena<br \/>GDP per capita: 1343<br \/>Population: 12,448,175",
            "Image": "img\/flag_33.bmp"
        },
        "Chile": {
            "Term": "Chile",
            "Description": "Capital city: Santiago<br \/>GDP per capita: 15272<br \/>Population: 17,464,814",
            "Image": "img\/flag_34.bmp"
        },
        "Colombia": {
            "Term": "Colombia",
            "Description": "Capital city: Bogot\ufffd<br \/>GDP per capita: 8861<br \/>Population: 47,704,427",
            "Image": "img\/flag_35.bmp"
        },
        "The Comoros": {
            "Term": "The Comoros",
            "Description": "Capital city: Moroni<br \/>GDP per capita: 980<br \/>Population: 717,503",
            "Image": "img\/flag_36.bmp"
        },
        "Costa Rica": {
            "Term": "Costa Rica",
            "Description": "Capital city: San Jos\ufffd<br \/>GDP per capita: 10732<br \/>Population: 4,805,295",
            "Image": "img\/flag_37.bmp"
        },
        "Cote d'Ivoire": {
            "Term": "Cote d'Ivoire",
            "Description": "Capital city: Yamoussoukro<br \/>GDP per capita: 1581<br \/>Population: 19,839,750",
            "Image": "img\/flag_38.bmp"
        },
        "Croatia": {
            "Term": "Croatia",
            "Description": "Capital city: Zagreb<br \/>GDP per capita: 16162<br \/>Population: 4,267,600",
            "Image": "img\/flag_39.bmp"
        },
        "Cuba": {
            "Term": "Cuba",
            "Description": "Capital city: Havana<br \/>GDP per capita: ..<br \/>Population: 11,270,957",
            "Image": "img\/flag_40.bmp"
        },
        "Cyprus": {
            "Term": "Cyprus",
            "Description": "Capital city: Nicosia<br \/>GDP per capita: 26045<br \/>Population: 1,128,994",
            "Image": "img\/flag_41.bmp"
        },
        "The Czech Republic": {
            "Term": "The Czech Republic",
            "Description": "Capital city: Prague<br \/>GDP per capita: 23967<br \/>Population: 10,510,785",
            "Image": "img\/flag_42.bmp"
        },
        "The Democratic Republic of the Congo": {
            "Term": "The Democratic Republic of the Congo",
            "Description": "Capital city: Kinshasa<br \/>GDP per capita: 3885<br \/>Population: 65,705,093",
            "Image": "img\/flag_43.bmp"
        },
        "Denmark": {
            "Term": "Denmark",
            "Description": "Capital city: Copenhagen<br \/>GDP per capita: 32399<br \/>Population: 5,591,572",
            "Image": "img\/flag_44.bmp"
        },
        "Djibouti": {
            "Term": "Djibouti",
            "Description": "Capital city: Djibouti<br \/>GDP per capita: 2087<br \/>Population: 859,652",
            "Image": "img\/flag_45.bmp"
        },
        "Dominica": {
            "Term": "Dominica",
            "Description": "Capital city: Roseau<br \/>GDP per capita: 11120<br \/>Population: 71,684",
            "Image": "img\/flag_46.bmp"
        },
        "The Dominican Republic": {
            "Term": "The Dominican Republic",
            "Description": "Capital city: Santo Domingo<br \/>GDP per capita: 8651<br \/>Population: 10,276,621",
            "Image": "img\/flag_47.bmp"
        },
        "East Timor": {
            "Term": "East Timor",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "img\/flag_48.bmp"
        },
        "Ecuador": {
            "Term": "Ecuador",
            "Description": "Capital city: Quito<br \/>GDP per capita: 7443<br \/>Population: 15,492,264",
            "Image": "img\/flag_49.bmp"
        },
        "Egypt": {
            "Term": "Egypt",
            "Description": "Capital city: Cairo<br \/>GDP per capita: 5547<br \/>Population: 80,721,874",
            "Image": "img\/flag_50.bmp"
        },
        "El Salvador": {
            "Term": "El Salvador",
            "Description": "Capital city: San Salvador<br \/>GDP per capita: 6032<br \/>Population: 6,297,394",
            "Image": "img\/flag_51.bmp"
        },
        "Equatorial Guinea": {
            "Term": "Equatorial Guinea",
            "Description": "Capital city: Malabo<br \/>GDP per capita: 32026<br \/>Population: 736,296",
            "Image": "img\/flag_52.bmp"
        },
        "Eritrea": {
            "Term": "Eritrea",
            "Description": "Capital city: Asmara<br \/>GDP per capita: 516<br \/>Population: 6,130,922",
            "Image": "img\/flag_53.bmp"
        },
        "Estonia": {
            "Term": "Estonia",
            "Description": "Capital city: Tallinn<br \/>GDP per capita: 17885<br \/>Population: 1,329,301",
            "Image": "img\/flag_54.bmp"
        },
        "Ethiopia": {
            "Term": "Ethiopia",
            "Description": "Capital city: Addis Ababa<br \/>GDP per capita: 979<br \/>Population: 91,728,849",
            "Image": "img\/flag_55.bmp"
        },
        "Fiji": {
            "Term": "Fiji",
            "Description": "Capital city: Suva<br \/>GDP per capita: 4199<br \/>Population: 874,742",
            "Image": "img\/flag_56.bmp"
        },
        "Finland": {
            "Term": "Finland",
            "Description": "Capital city: Helsinki<br \/>GDP per capita: 32254<br \/>Population: 5,413,971",
            "Image": "img\/flag_57.bmp"
        },
        "France": {
            "Term": "France",
            "Description": "Capital city: Paris<br \/>GDP per capita: 29819<br \/>Population: 65,696,689",
            "Image": "img\/flag_58.bmp"
        },
        "Gabon": {
            "Term": "Gabon",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "img\/flag_59.bmp"
        },
        "The Gambia": {
            "Term": "The Gambia",
            "Description": "Capital city: Banjul <br \/>GDP per capita: 1873<br \/>Population: 1,791,225",
            "Image": "img\/flag_60.bmp"
        },
        "Georgia": {
            "Term": "Georgia",
            "Description": "Capital city: Tbilisi<br \/>GDP per capita: 4826<br \/>Population: 4,490,700",
            "Image": "img\/flag_61.bmp"
        },
        "Germany": {
            "Term": "Germany",
            "Description": "Capital city: Berlin<br \/>GDP per capita: 34437<br \/>Population: 80,425,823",
            "Image": "img\/flag_62.bmp"
        },
        "Ghana": {
            "Term": "Ghana",
            "Description": "Capital city: Accra<br \/>GDP per capita: 1652<br \/>Population: 25,366,462",
            "Image": "img\/flag_63.bmp"
        },
        "Greece": {
            "Term": "Greece",
            "Description": "Capital city: Athens<br \/>GDP per capita: 22558<br \/>Population: 11,092,771",
            "Image": "img\/flag_64.bmp"
        },
        "Grenada": {
            "Term": "Grenada",
            "Description": "Capital city: St. George's<br \/>GDP per capita: 9806<br \/>Population: 105,483",
            "Image": "img\/flag_65.bmp"
        },
        "Guatemala": {
            "Term": "Guatemala",
            "Description": "Capital city: Guatemala City<br \/>GDP per capita: 4351<br \/>Population: 15,082,831",
            "Image": "img\/flag_66.bmp"
        },
        "Guinea": {
            "Term": "Guinea",
            "Description": "Capital city: Conakry<br \/>GDP per capita: 990<br \/>Population: 11,451,273",
            "Image": "img\/flag_67.bmp"
        },
        "Guinea-Bissau": {
            "Term": "Guinea-Bissau",
            "Description": "Capital city: Bissau<br \/>GDP per capita: 1097<br \/>Population: 1,663,558",
            "Image": "img\/flag_68.bmp"
        },
        "Guyana": {
            "Term": "Guyana",
            "Description": "Capital city: Georgetown<br \/>GDP per capita: 3104<br \/>Population: 795,369",
            "Image": "img\/flag_69.bmp"
        },
        "Haiti": {
            "Term": "Haiti",
            "Description": "Capital city: Port-au-Prince<br \/>GDP per capita: 1034<br \/>Population: 10,173,775",
            "Image": "img\/flag_70.bmp"
        },
        "Honduras": {
            "Term": "Honduras",
            "Description": "Capital city: Tegucigalpa<br \/>GDP per capita: 3566<br \/>Population: 7,935,846",
            "Image": "img\/flag_71.bmp"
        },
        "Hungary": {
            "Term": "Hungary",
            "Description": "Capital city: Budapest<br \/>GDP per capita: 17295<br \/>Population: 9,920,362",
            "Image": "img\/flag_72.bmp"
        },
        "Iceland": {
            "Term": "Iceland",
            "Description": "Capital city: Reykjav\ufffdk<br \/>GDP per capita: 33618<br \/>Population: 320,716",
            "Image": "img\/flag_73.bmp"
        },
        "India": {
            "Term": "India",
            "Description": "Capital city: New Delhi<br \/>GDP per capita: 3203<br \/>Population: 1,236,686,732",
            "Image": "img\/flag_74.bmp"
        },
        "Indonesia": {
            "Term": "Indonesia",
            "Description": "Capital city: Jakarta<br \/>GDP per capita: 4094<br \/>Population: 246,864,191",
            "Image": "img\/flag_75.bmp"
        },
        "Iran": {
            "Term": "Iran",
            "Description": "Capital city: Tehran<br \/>GDP per capita: 10462<br \/>Population: 76,424,443",
            "Image": "img\/flag_76.bmp"
        },
        "Iraq": {
            "Term": "Iraq",
            "Description": "Capital city: Baghdad<br \/>GDP per capita: 3412<br \/>Population: 32,578,209",
            "Image": "img\/flag_77.bmp"
        },
        "Ireland": {
            "Term": "Ireland",
            "Description": "Capital city: Dublin<br \/>GDP per capita: 35640<br \/>Population: 4,586,897",
            "Image": "img\/flag_78.bmp"
        },
        "Israel": {
            "Term": "Israel",
            "Description": "Capital city: Jerusalem<br \/>GDP per capita: 26720<br \/>Population: 7,910,500",
            "Image": "img\/flag_79.bmp"
        },
        "Italy": {
            "Term": "Italy",
            "Description": "Capital city: Rome<br \/>GDP per capita: 27069<br \/>Population: 59,539,717",
            "Image": "img\/flag_80.bmp"
        },
        "Jamaica": {
            "Term": "Jamaica",
            "Description": "Capital city: Kingston<br \/>GDP per capita: 7074<br \/>Population: 2,707,805",
            "Image": "img\/flag_81.bmp"
        },
        "Japan": {
            "Term": "Japan",
            "Description": "Capital city: Tokyo<br \/>GDP per capita: 30660<br \/>Population: 127,561,489",
            "Image": "img\/flag_82.bmp"
        },
        "Jordan": {
            "Term": "Jordan",
            "Description": "Capital city: Amman<br \/>GDP per capita: 5269<br \/>Population: 6,318,000",
            "Image": "img\/flag_83.bmp"
        },
        "Kazakhstan": {
            "Term": "Kazakhstan",
            "Description": "Capital city: Astana<br \/>GDP per capita: 11568<br \/>Population: 16,791,425",
            "Image": "img\/flag_84.bmp"
        },
        "Kenya": {
            "Term": "Kenya",
            "Description": "Capital city: Nairobi<br \/>GDP per capita: 1507<br \/>Population: 43,178,141",
            "Image": "img\/flag_85.bmp"
        },
        "Kiribati": {
            "Term": "Kiribati",
            "Description": "Capital city: South Tarawa<br \/>GDP per capita: 2220<br \/>Population: 100,786",
            "Image": "img\/flag_86.bmp"
        },
        "Kosovo": {
            "Term": "Kosovo",
            "Description": "Capital city: Pristina<br \/>GDP per capita: <br \/>Population: 1,807,106",
            "Image": "img\/flag_87.bmp"
        },
        "Kuwait": {
            "Term": "Kuwait",
            "Description": "Capital city: Kuwait City<br \/>GDP per capita: 47935<br \/>Population: 3,250,496",
            "Image": "img\/flag_88.bmp"
        },
        "Kyrgyzstan": {
            "Term": "Kyrgyzstan",
            "Description": "Capital city: Bishkek<br \/>GDP per capita: 2126<br \/>Population: 5,607,200",
            "Image": "img\/flag_89.bmp"
        },
        "Laos": {
            "Term": "Laos",
            "Description": "Capital city: Vientiane<br \/>GDP per capita: 2464<br \/>Population: 6,645,827",
            "Image": "img\/flag_90.bmp"
        },
        "Latvia": {
            "Term": "Latvia",
            "Description": "Capital city: Riga<br \/>GDP per capita: 13773<br \/>Population: 2,034,319",
            "Image": "img\/flag_91.bmp"
        },
        "Lebanon": {
            "Term": "Lebanon",
            "Description": "Capital city: Beirut<br \/>GDP per capita: 12900<br \/>Population: 4,424,888",
            "Image": "img\/flag_92.bmp"
        },
        "Lesotho": {
            "Term": "Lesotho",
            "Description": "Capital city: Maseru<br \/>GDP per capita: 1504<br \/>Population: 2,051,545",
            "Image": "img\/flag_93.bmp"
        },
        "Liberia": {
            "Term": "Liberia",
            "Description": "Capital city: Monrovia<br \/>GDP per capita: 506<br \/>Population: 4,190,435",
            "Image": "img\/flag_94.bmp"
        },
        "Libya": {
            "Term": "Libya",
            "Description": "Capital city: Tripoli<br \/>GDP per capita: 15361<br \/>Population: 6,154,623",
            "Image": "img\/flag_95.bmp"
        },
        "Liechtenstein": {
            "Term": "Liechtenstein",
            "Description": "Capital city: Vaduz<br \/>GDP per capita: ..<br \/>Population: 36,656",
            "Image": "img\/flag_96.bmp"
        },
        "Lithuania": {
            "Term": "Lithuania",
            "Description": "Capital city: Vilnius<br \/>GDP per capita: 16877<br \/>Population: 2,987,773",
            "Image": "img\/flag_97.bmp"
        },
        "Luxembourg": {
            "Term": "Luxembourg",
            "Description": "Capital city: Luxembourg City<br \/>GDP per capita: 68459<br \/>Population: 530,946",
            "Image": "img\/flag_98.bmp"
        },
        "Macedonia": {
            "Term": "Macedonia",
            "Description": "Capital city: Skopje<br \/>GDP per capita: <br \/>Population: 2,105,575",
            "Image": "img\/flag_99.bmp"
        },
        "Madagascar": {
            "Term": "Madagascar",
            "Description": "Capital city: Antananarivo<br \/>GDP per capita: 853<br \/>Population: 22,293,914",
            "Image": "img\/flag_100.bmp"
        },
        "Malawi": {
            "Term": "Malawi",
            "Description": "Capital city: Lilongwe<br \/>GDP per capita: 805<br \/>Population: 15,906,483",
            "Image": "img\/flag_101.bmp"
        },
        "Malaysia": {
            "Term": "Malaysia",
            "Description": "Capital city: Kuala Lumpur<br \/>GDP per capita: 13672<br \/>Population: 29,239,927",
            "Image": "img\/flag_102.bmp"
        },
        "Maldives": {
            "Term": "Maldives",
            "Description": "Capital city: Mal\ufffd<br \/>GDP per capita: 7834<br \/>Population: 338,442",
            "Image": "img\/flag_103.bmp"
        },
        "Mali": {
            "Term": "Mali",
            "Description": "Capital city: Barnako<br \/>GDP per capita: 964<br \/>Population: 14,853,572",
            "Image": "img\/flag_104.bmp"
        },
        "Malta": {
            "Term": "Malta",
            "Description": "Capital city: Valletta<br \/>GDP per capita: 23007<br \/>Population: 419,455",
            "Image": "img\/flag_105.bmp"
        },
        "The Marshall Islands": {
            "Term": "The Marshall Islands",
            "Description": "Capital city: Majuro<br \/>GDP per capita: ..<br \/>Population: 52,555",
            "Image": "img\/flag_106.bmp"
        },
        "Mauritania": {
            "Term": "Mauritania",
            "Description": "Capital city: Nouakchott<br \/>GDP per capita: 2255<br \/>Population: 3,796,141",
            "Image": "img\/flag_107.bmp"
        },
        "Mauritius": {
            "Term": "Mauritius",
            "Description": "Capital city: Port Louis<br \/>GDP per capita: 12737<br \/>Population: 1,291,456",
            "Image": "img\/flag_108.bmp"
        },
        "Mexico": {
            "Term": "Mexico",
            "Description": "Capital city: Mexico City<br \/>GDP per capita: 12776<br \/>Population: 120,847,477",
            "Image": "img\/flag_109.bmp"
        },
        "Micronesia": {
            "Term": "Micronesia",
            "Description": "Capital city: Palikir<br \/>GDP per capita: 3017<br \/>Population: 103,395",
            "Image": "img\/flag_110.bmp"
        },
        "Moldova": {
            "Term": "Moldova",
            "Description": "Capital city: Chi?in?u<br \/>GDP per capita: 2975<br \/>Population: 3,559,519",
            "Image": "img\/flag_111.bmp"
        },
        "Monaco": {
            "Term": "Monaco",
            "Description": "Capital city: Monaco<br \/>GDP per capita: ..<br \/>Population: 37,579",
            "Image": "img\/flag_112.bmp"
        },
        "Mongolia": {
            "Term": "Mongolia",
            "Description": "Capital city: Ulan Bator<br \/>GDP per capita: 4178<br \/>Population: 2,796,484",
            "Image": "img\/flag_113.bmp"
        },
        "Montenegro": {
            "Term": "Montenegro",
            "Description": "Capital city: Podgorica<br \/>GDP per capita: 10402<br \/>Population: 621,081",
            "Image": "img\/flag_114.bmp"
        },
        "Morocco": {
            "Term": "Morocco",
            "Description": "Capital city: Rabat<br \/>GDP per capita: 4373<br \/>Population: 32,521,143",
            "Image": "img\/flag_115.bmp"
        },
        "Mozambique": {
            "Term": "Mozambique",
            "Description": "Capital city: Maputo<br \/>GDP per capita: 861<br \/>Population: 25,203,395",
            "Image": "img\/flag_116.bmp"
        },
        "Myanmar": {
            "Term": "Myanmar",
            "Description": "Capital city: Naypyidaw<br \/>GDP per capita: ..<br \/>Population: 52,797,319",
            "Image": "img\/flag_117.bmp"
        },
        "Namibia": {
            "Term": "Namibia",
            "Description": "Capital city: Windhoek<br \/>GDP per capita: 5986<br \/>Population: 2,259,393",
            "Image": "img\/flag_118.bmp"
        },
        "Nauru": {
            "Term": "Nauru",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "img\/flag_119.bmp"
        },
        "Nepal": {
            "Term": "Nepal",
            "Description": "Capital city: Kathmandu<br \/>GDP per capita: 1102<br \/>Population: 27,474,377",
            "Image": "img\/flag_120.bmp"
        },
        "The Netherlands": {
            "Term": "The Netherlands",
            "Description": "Capital city: Amsterdam<br \/>GDP per capita: 37251<br \/>Population: 16,754,962",
            "Image": "img\/flag_121.bmp"
        },
        "New Zealand": {
            "Term": "New Zealand",
            "Description": "Capital city: Wellington<br \/>GDP per capita: 24818<br \/>Population: 4,433,100",
            "Image": "img\/flag_122.bmp"
        },
        "Nicaragua": {
            "Term": "Nicaragua",
            "Description": "Capital city: Managua<br \/>GDP per capita: 2579<br \/>Population: 5,991,733",
            "Image": "img\/flag_123.bmp"
        },
        "Niger": {
            "Term": "Niger",
            "Description": "Capital city: Niamey<br \/>GDP per capita: 642<br \/>Population: 17,157,042",
            "Image": "img\/flag_124.bmp"
        },
        "Nigeria": {
            "Term": "Nigeria",
            "Description": "Capital city: Abuja<br \/>GDP per capita: 2221<br \/>Population: 168,833,776",
            "Image": "img\/flag_125.bmp"
        },
        "North Korea": {
            "Term": "North Korea",
            "Description": "Capital city: Pyongyang<br \/>GDP per capita: ..<br \/>Population: 24,763,188",
            "Image": "img\/flag_126.bmp"
        },
        "Norway": {
            "Term": "Norway",
            "Description": "Capital city: Oslo<br \/>GDP per capita: 46982<br \/>Population: 5,018,573",
            "Image": "img\/flag_127.bmp"
        },
        "Oman": {
            "Term": "Oman",
            "Description": "Capital city: Muscat<br \/>GDP per capita: 25330<br \/>Population: 3,314,001",
            "Image": "img\/flag_128.bmp"
        },
        "Pakistan": {
            "Term": "Pakistan",
            "Description": "Capital city: Islamabad<br \/>GDP per capita: 2424<br \/>Population: 179,160,111",
            "Image": "img\/flag_129.bmp"
        },
        "Palau": {
            "Term": "Palau",
            "Description": "Capital city: Ngerulmud<br \/>GDP per capita: 13176<br \/>Population: 20,754",
            "Image": "img\/flag_130.bmp"
        },
        "Panama": {
            "Term": "Panama",
            "Description": "Capital city: Pana City<br \/>GDP per capita: 13766<br \/>Population: 3,802,281",
            "Image": "img\/flag_131.bmp"
        },
        "Papua New Guinea": {
            "Term": "Papua New Guinea",
            "Description": "Capital city: Port Moresby<br \/>GDP per capita: 2363<br \/>Population: 7,167,010",
            "Image": "img\/flag_132.bmp"
        },
        "Paraguay": {
            "Term": "Paraguay",
            "Description": "Capital city: Asunci\ufffdn<br \/>GDP per capita: 4752<br \/>Population: 6,687,361",
            "Image": "img\/flag_133.bmp"
        },
        "The People's Republic of China": {
            "Term": "The People's Republic of China",
            "Description": "Capital city: Beijing<br \/>GDP per capita: 7418<br \/>Population: 1,350,695,000",
            "Image": "img\/flag_134.bmp"
        },
        "Peru": {
            "Term": "Peru",
            "Description": "Capital city: Lima<br \/>GDP per capita: 9049<br \/>Population: 29,987,800",
            "Image": "img\/flag_135.bmp"
        },
        "The Philippines": {
            "Term": "The Philippines",
            "Description": "Capital city: Manila<br \/>GDP per capita: 3631<br \/>Population: 96,706,764",
            "Image": "img\/flag_136.bmp"
        },
        "Poland": {
            "Term": "Poland",
            "Description": "Capital city: Warsaw<br \/>GDP per capita: 18087<br \/>Population: 38,535,873",
            "Image": "img\/flag_137.bmp"
        },
        "Portugal": {
            "Term": "Portugal",
            "Description": "Capital city: Lisbon<br \/>GDP per capita: 21317<br \/>Population: 10,514,844",
            "Image": "img\/flag_138.bmp"
        },
        "Qatar": {
            "Term": "Qatar",
            "Description": "Capital city: Doha<br \/>GDP per capita: 77987<br \/>Population: 2,050,514",
            "Image": "img\/flag_139.bmp"
        },
        "The Republic of China": {
            "Term": "The Republic of China",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "img\/flag_140.bmp"
        },
        "The Republic of Congo": {
            "Term": "The Republic of Congo",
            "Description": "Capital city: Brazzaville<br \/>GDP per capita: 329<br \/>Population: 4,337,051",
            "Image": "img\/flag_141.bmp"
        },
        "Romania": {
            "Term": "Romania",
            "Description": "Capital city: Bucharest<br \/>GDP per capita: 10905<br \/>Population: 20,076,727",
            "Image": "img\/flag_142.bmp"
        },
        "Russia": {
            "Term": "Russia",
            "Description": "Capital city: Moscow<br \/>GDP per capita: 14808<br \/>Population: 143,533,000",
            "Image": "img\/flag_143.bmp"
        },
        "Rwanda": {
            "Term": "Rwanda",
            "Description": "Capital city: Kigali<br \/>GDP per capita: 1097<br \/>Population: 11,457,801",
            "Image": "img\/flag_144.bmp"
        },
        "Saint Kitts": {
            "Term": "Saint Kitts",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "img\/flag_145.bmp"
        },
        "Saint Lucia": {
            "Term": "Saint Lucia",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "img\/flag_146.bmp"
        },
        "Saint Vincent": {
            "Term": "Saint Vincent",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "img\/flag_147.bmp"
        },
        "Samoa": {
            "Term": "Samoa",
            "Description": "Capital city: Apira<br \/>GDP per capita: 4008<br \/>Population: 188,889",
            "Image": "img\/flag_148.bmp"
        },
        "San Marino": {
            "Term": "San Marino",
            "Description": "Capital city: San Marino<br \/>GDP per capita: ..<br \/>Population: 31,247",
            "Image": "img\/flag_149.bmp"
        },
        "Sao Tome and Principe": {
            "Term": "Sao Tome and Principe",
            "Description": "Capital city: S\ufffdo Tom\ufffd<br \/>GDP per capita: 1805<br \/>Population: 188,098",
            "Image": "img\/flag_150.bmp"
        },
        "Saudi Arabia": {
            "Term": "Saudi Arabia",
            "Description": "Capital city: Riyadh<br \/>GDP per capita: 21430<br \/>Population: 28,287,855",
            "Image": "img\/flag_151.bmp"
        },
        "Senegal": {
            "Term": "Senegal",
            "Description": "Capital city: Dakar<br \/>GDP per capita: 1737<br \/>Population: 13,726,021",
            "Image": "img\/flag_152.bmp"
        },
        "Serbia": {
            "Term": "Serbia",
            "Description": "Capital city: Belgrade<br \/>GDP per capita: 9809<br \/>Population: 7,223,887",
            "Image": "img\/flag_153.bmp"
        },
        "The Seychelles": {
            "Term": "The Seychelles",
            "Description": "Capital city: Victoria<br \/>GDP per capita: 23172<br \/>Population: 88,303",
            "Image": "img\/flag_154.bmp"
        },
        "Sierra Leone": {
            "Term": "Sierra Leone",
            "Description": "Capital city: Freetown<br \/>GDP per capita: 769<br \/>Population: 5,978,727",
            "Image": "img\/flag_155.bmp"
        },
        "Singapore": {
            "Term": "Singapore",
            "Description": "Capital city: Singapore<br \/>GDP per capita: 53591<br \/>Population: 5,312,400",
            "Image": "img\/flag_156.bmp"
        },
        "Slovakia": {
            "Term": "Slovakia",
            "Description": "Capital city: Bratislava<br \/>GDP per capita: 20757<br \/>Population: 5,407,579",
            "Image": "img\/flag_157.bmp"
        },
        "Slovenia": {
            "Term": "Slovenia",
            "Description": "Capital city: Ljubljana<br \/>GDP per capita: 24967<br \/>Population: 2,057,159",
            "Image": "img\/flag_158.bmp"
        },
        "The Solomon Islands": {
            "Term": "The Solomon Islands",
            "Description": "Capital city: Honiara<br \/>GDP per capita: 2581<br \/>Population: 549,598",
            "Image": "img\/flag_159.bmp"
        },
        "Somalia": {
            "Term": "Somalia",
            "Description": "Capital city: Mogadishu<br \/>GDP per capita: ..<br \/>Population: 10,195,134",
            "Image": "img\/flag_160.bmp"
        },
        "South Africa": {
            "Term": "South Africa",
            "Description": "Capital city: Pretoria<br \/>GDP per capita: 9678<br \/>Population: 52,274,945",
            "Image": "img\/flag_161.bmp"
        },
        "South Korea": {
            "Term": "South Korea",
            "Description": "Capital city: Seoul<br \/>GDP per capita: 27541<br \/>Population: 50,004,441",
            "Image": "img\/flag_162.bmp"
        },
        "Spain": {
            "Term": "Spain",
            "Description": "Capital city: Madrid<br \/>GDP per capita: 27063<br \/>Population: 46,761,264",
            "Image": "img\/flag_163.bmp"
        },
        "Sri Lanka": {
            "Term": "Sri Lanka",
            "Description": "Capital city: Sri Jayawardenepura Kotte<br \/>GDP per capita: 4929<br \/>Population: 20,328,000",
            "Image": "img\/flag_164.bmp"
        },
        "Sudan": {
            "Term": "Sudan",
            "Description": "Capital city: Khartoum<br \/>GDP per capita: 1878<br \/>Population: 37,195,349",
            "Image": "img\/flag_165.bmp"
        },
        "Suriname": {
            "Term": "Suriname",
            "Description": "Capital city: Paramaribo<br \/>GDP per capita: 7110<br \/>Population: 534,541",
            "Image": "img\/flag_166.bmp"
        },
        "Swaziland": {
            "Term": "Swaziland",
            "Description": "Capital city: Mbabane<br \/>GDP per capita: 5349<br \/>Population: 1,230,985",
            "Image": "img\/flag_167.bmp"
        },
        "Sweden": {
            "Term": "Sweden",
            "Description": "Capital city: Stockholm<br \/>GDP per capita: 35048<br \/>Population: 9,519,374",
            "Image": "img\/flag_168.bmp"
        },
        "Switzerland": {
            "Term": "Switzerland",
            "Description": "Capital city: Bern<br \/>GDP per capita: 37979<br \/>Population: 7,996,861",
            "Image": "img\/flag_169.bmp"
        },
        "Syria": {
            "Term": "Syria",
            "Description": "Capital city: Damascus<br \/>GDP per capita: 4741<br \/>Population: 22,399,254",
            "Image": "img\/flag_170.bmp"
        },
        "Tajikistan": {
            "Term": "Tajikistan",
            "Description": "Capital city: Dushanbe<br \/>GDP per capita: 2052<br \/>Population: 8,008,990",
            "Image": "img\/flag_171.bmp"
        },
        "Tanzania": {
            "Term": "Tanzania",
            "Description": "Capital city: Dar Es Salaam<br \/>GDP per capita: 1334<br \/>Population: 47,783,107",
            "Image": "img\/flag_172.bmp"
        },
        "Thailand": {
            "Term": "Thailand",
            "Description": "Capital city: Bangkok<br \/>GDP per capita: 7633<br \/>Population: 66,785,001",
            "Image": "img\/flag_173.bmp"
        },
        "Togo": {
            "Term": "Togo",
            "Description": "Capital city: Lom\ufffd<br \/>GDP per capita: 914<br \/>Population: 6,642,928",
            "Image": "img\/flag_174.bmp"
        },
        "Tonga": {
            "Term": "Tonga",
            "Description": "Capital city: Nuku'alofa<br \/>GDP per capita: 4092<br \/>Population: 104,941",
            "Image": "img\/flag_175.bmp"
        },
        "Trinidad and Tobago": {
            "Term": "Trinidad and Tobago",
            "Description": "Capital city: Port of Spain<br \/>GDP per capita: 22761<br \/>Population: 1,337,439",
            "Image": "img\/flag_176.bmp"
        },
        "Tunisia": {
            "Term": "Tunisia",
            "Description": "Capital city: Tunis<br \/>GDP per capita: 8258<br \/>Population: 10,777,500",
            "Image": "img\/flag_177.bmp"
        },
        "Turkey": {
            "Term": "Turkey",
            "Description": "Capital city: Ankara<br \/>GDP per capita: 13466<br \/>Population: 73,997,128",
            "Image": "img\/flag_178.bmp"
        },
        "Turkmenistan": {
            "Term": "Turkmenistan",
            "Description": "Capital city: Ashgabat<br \/>GDP per capita: 8055<br \/>Population: 5,172,931",
            "Image": "img\/flag_179.bmp"
        },
        "Tuvalu": {
            "Term": "Tuvalu",
            "Description": "Capital city: Funafuti<br \/>GDP per capita: ..<br \/>Population: 9,86",
            "Image": "img\/flag_180.bmp"
        },
        "Uganda": {
            "Term": "Uganda",
            "Description": "Capital city: Kampala<br \/>GDP per capita: 1188<br \/>Population: 36,345,860",
            "Image": "img\/flag_181.bmp"
        },
        "Ukraine": {
            "Term": "Ukraine",
            "Description": "Capital city: Kiev<br \/>GDP per capita: 6359<br \/>Population: 45,593,300",
            "Image": "img\/flag_182.bmp"
        },
        "The United Arab Emirates": {
            "Term": "The United Arab Emirates",
            "Description": "Capital city: Abu Dhabi<br \/>GDP per capita: 42293<br \/>Population: 9,205,651",
            "Image": "img\/flag_183.bmp"
        },
        "The United Kingdom": {
            "Term": "The United Kingdom",
            "Description": "Capital city: Capital city: London<br \/> <br \/>GDP per capita: 32474<br \/>Population: 63,612,729",
            "Image": "img\/flag_184.bmp"
        },
        "The United States": {
            "Term": "The United States",
            "Description": "Capital city: Washington, D.C.<br \/>GDP per capita: 42486<br \/>Population: 313,914,040",
            "Image": "img\/flag_185.bmp"
        },
        "Uruguay": {
            "Term": "Uruguay",
            "Description": "Capital city: Montevideo<br \/>GDP per capita: 13315<br \/>Population: 3,395,253",
            "Image": "img\/flag_186.bmp"
        },
        "Uzbekistan": {
            "Term": "Uzbekistan",
            "Description": "Capital city: Tashkent<br \/>GDP per capita: 2903<br \/>Population: 29,774,500",
            "Image": "img\/flag_187.bmp"
        },
        "Vanuatu": {
            "Term": "Vanuatu",
            "Description": "Capital city: Port Vila<br \/>GDP per capita: 4062<br \/>Population: 247,262",
            "Image": "img\/flag_188.bmp"
        },
        "The Vatican City": {
            "Term": "The Vatican City",
            "Description": "Capital city: Caracas<br \/>GDP per capita: 11258<br \/>Population: 29,954,782",
            "Image": "img\/flag_189.bmp"
        },
        "Venezuela": {
            "Term": "Venezuela",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "img\/flag_190.bmp"
        },
        "Vietnam": {
            "Term": "Vietnam",
            "Description": "Capital city: Hanoi<br \/>GDP per capita: 3013<br \/>Population: 88,772,900",
            "Image": "img\/flag_191.bmp"
        },
        "Western Sahara": {
            "Term": "Western Sahara",
            "Description": "Capital city: <br \/>GDP per capita: <br \/>Population: ",
            "Image": "img\/flag_192.bmp"
        },
        "Yemen": {
            "Term": "Yemen",
            "Description": "Capital city: Sana'a<br \/>GDP per capita: 2060<br \/>Population: 23,852,409",
            "Image": "img\/flag_193.bmp"
        },
        "Zambia": {
            "Term": "Zambia",
            "Description": "Capital city: Lusaka<br \/>GDP per capita: 1423<br \/>Population: 14,075,099",
            "Image": "img\/flag_194.bmp"
        },
        "Zimbabwe": {
            "Term": "Zimbabwe",
            "Description": "Capital city: Harare<br \/>GDP per capita: ..<br \/>Population: 13,724,317",
            "Image": "img\/flag_195.bmp"
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
                if (concept["Image"].substr(0, 7) !== "http://")
                {
                    img.src = "http://s-nordby.com/" + concept["Image"];
                }
                else
                {
                    img.src = concept["Image"];
                }
            }
            img.style.maxWidth = "100%";

            if ("Caspian Sea" === keyword) //demo only
            {
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
