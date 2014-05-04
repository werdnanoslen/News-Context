var articleDiv;
var articleHTML;
var articleText;
var keywords;
var dicts;
var dictsCombined;


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
            "Country": "Afghanistan",
            "Capital": "Kabul",
            "GDP per Capita (2011 PPP $ (UN))": "1083",
            "Population": "29,824,536"
        },
        "Albania": {
            "Country": "Albania",
            "Capital": "Tirana",
            "GDP per Capita (2011 PPP $ (UN))": "7861",
            "Population": "3,162,083"
        },
        "Algeria": {
            "Country": "Algeria",
            "Capital": "Algiers",
            "GDP per Capita (2011 PPP $ (UN))": "7643",
            "Population": "38,481,705"
        },
        "American Samoa": {
            "Country": "American Samoa",
            "Capital": "Pago Pago",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "55,128"
        },
        "Andorra": {
            "Country": "Andorra",
            "Capital": "Andorra la Vella",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "78,36"
        },
        "Angola": {
            "Country": "Angola",
            "Capital": "Luanda",
            "GDP per Capita (2011 PPP $ (UN))": "5201",
            "Population": "20,820,525"
        },
        "Antigua and Barbuda": {
            "Country": "Antigua and Barbuda",
            "Capital": "St. Johns",
            "GDP per Capita (2011 PPP $ (UN))": "14139",
            "Population": "89,069"
        },
        "Argentina": {
            "Country": "Argentina",
            "Capital": "Buenos Aires",
            "GDP per Capita (2011 PPP $ (UN))": "15501",
            "Population": "41,086,927"
        },
        "Armenia": {
            "Country": "Armenia",
            "Capital": "Yerevan",
            "GDP per Capita (2011 PPP $ (UN))": "5112",
            "Population": "2,969,081"
        },
        "Aruba": {
            "Country": "Aruba",
            "Capital": "",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "102,384"
        },
        "Australia": {
            "Country": "Australia",
            "Capital": "Canberra",
            "GDP per Capita (2011 PPP $ (UN))": "34548",
            "Population": "22,722,000"
        },
        "Austria": {
            "Country": "Austria",
            "Capital": "Vienna",
            "GDP per Capita (2011 PPP $ (UN))": "36353",
            "Population": "8,429,991"
        },
        "Azerbaijan": {
            "Country": "Azerbaijan",
            "Capital": "Baku",
            "GDP per Capita (2011 PPP $ (UN))": "8890",
            "Population": "9,295,784"
        },
        "Bahamas, The": {
            "Country": "Bahamas, The",
            "Capital": "Nassau",
            "GDP per Capita (2011 PPP $ (UN))": "28239",
            "Population": "371,96"
        },
        "Bahrain": {
            "Country": "Bahrain",
            "Capital": "Bahrain",
            "GDP per Capita (2011 PPP $ (UN))": "21345",
            "Population": "1,317,827"
        },
        "Bangladesh": {
            "Country": "Bangladesh",
            "Capital": "Dhaka",
            "GDP per Capita (2011 PPP $ (UN))": "1568",
            "Population": "154,695,368"
        },
        "Barbados": {
            "Country": "Barbados",
            "Capital": "Bridgetown",
            "GDP per Capita (2011 PPP $ (UN))": "17564",
            "Population": "283,221"
        },
        "Belarus": {
            "Country": "Belarus",
            "Capital": "Minsk",
            "GDP per Capita (2011 PPP $ (UN))": "13191",
            "Population": "9,464,000"
        },
        "Belgium": {
            "Country": "Belgium",
            "Capital": "Brussels",
            "GDP per Capita (2011 PPP $ (UN))": "33127",
            "Population": "11,128,246"
        },
        "Belize": {
            "Country": "Belize",
            "Capital": "Belmopan",
            "GDP per Capita (2011 PPP $ (UN))": "5896",
            "Population": "324,06"
        },
        "Benin": {
            "Country": "Benin",
            "Capital": "Benin",
            "GDP per Capita (2011 PPP $ (UN))": "1428",
            "Population": "10,050,702"
        },
        "Bermuda": {
            "Country": "Bermuda",
            "Capital": "Hamilton",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "64,806"
        },
        "Bhutan": {
            "Country": "Bhutan",
            "Capital": "Thimphu",
            "GDP per Capita (2011 PPP $ (UN))": "5096",
            "Population": "741,822"
        },
        "Bolivia": {
            "Country": "Bolivia",
            "Capital": "Sucre",
            "GDP per Capita (2011 PPP $ (UN))": "4499",
            "Population": "10,496,285"
        },
        "Bosnia and Herzegovina": {
            "Country": "Bosnia and Herzegovina",
            "Capital": "Sarajevo",
            "GDP per Capita (2011 PPP $ (UN))": "7607",
            "Population": "3,833,916"
        },
        "Botswana": {
            "Country": "Botswana",
            "Capital": "Gaborone",
            "GDP per Capita (2011 PPP $ (UN))": "12939",
            "Population": "2,003,910"
        },
        "Brazil": {
            "Country": "Brazil",
            "Capital": "Bras\u00edlia",
            "GDP per Capita (2011 PPP $ (UN))": "10278",
            "Population": "198,656,019"
        },
        "Brunei Darussalam": {
            "Country": "Brunei Darussalam",
            "Capital": "Bandar Seri Begawan",
            "GDP per Capita (2011 PPP $ (UN))": "45507",
            "Population": "412,238"
        },
        "Bulgaria": {
            "Country": "Bulgaria",
            "Capital": "Sofia",
            "GDP per Capita (2011 PPP $ (UN))": "11799",
            "Population": "7,305,888"
        },
        "Burkina Faso": {
            "Country": "Burkina Faso",
            "Capital": "Ouagadougou",
            "GDP per Capita (2011 PPP $ (UN))": "1149",
            "Population": "16,460,141"
        },
        "Burundi": {
            "Country": "Burundi",
            "Capital": "Bujumbura",
            "GDP per Capita (2011 PPP $ (UN))": "533",
            "Population": "9,849,569"
        },
        "Cambodia": {
            "Country": "Cambodia",
            "Capital": "Phnom Penh",
            "GDP per Capita (2011 PPP $ (UN))": "2080",
            "Population": "14,864,646"
        },
        "Cameroon": {
            "Country": "Cameroon",
            "Capital": "Yaound\u00e9",
            "GDP per Capita (2011 PPP $ (UN))": "2090",
            "Population": "21,699,631"
        },
        "Canada": {
            "Country": "Canada",
            "Capital": "Ottawa",
            "GDP per Capita (2011 PPP $ (UN))": "35716",
            "Population": "34,754,312"
        },
        "Cabo Verde": {
            "Country": "Cabo Verde",
            "Capital": "Praia",
            "GDP per Capita (2011 PPP $ (UN))": "3616",
            "Population": "494,401"
        },
        "Cayman Islands": {
            "Country": "Cayman Islands",
            "Capital": "George Town",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "57,57"
        },
        "Central African Republic": {
            "Country": "Central African Republic",
            "Capital": "Bangui",
            "GDP per Capita (2011 PPP $ (UN))": "716",
            "Population": "4,525,209"
        },
        "Chad": {
            "Country": "Chad",
            "Capital": "N'Djamena",
            "GDP per Capita (2011 PPP $ (UN))": "1343",
            "Population": "12,448,175"
        },
        "Channel Islands": {
            "Country": "Channel Islands",
            "Capital": "",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "161,235"
        },
        "Chile": {
            "Country": "Chile",
            "Capital": "Santiago",
            "GDP per Capita (2011 PPP $ (UN))": "15272",
            "Population": "17,464,814"
        },
        "China": {
            "Country": "China",
            "Capital": "Beijing",
            "GDP per Capita (2011 PPP $ (UN))": "7418",
            "Population": "1,350,695,000"
        },
        "Colombia": {
            "Country": "Colombia",
            "Capital": "Bogot\u00e1",
            "GDP per Capita (2011 PPP $ (UN))": "8861",
            "Population": "47,704,427"
        },
        "Comoros": {
            "Country": "Comoros",
            "Capital": "Moroni",
            "GDP per Capita (2011 PPP $ (UN))": "980",
            "Population": "717,503"
        },
        "Congo, Dem. Rep.": {
            "Country": "Congo, Dem. Rep.",
            "Capital": "Kinshasa",
            "GDP per Capita (2011 PPP $ (UN))": "3885",
            "Population": "65,705,093"
        },
        "Congo, Rep.": {
            "Country": "Congo, Rep.",
            "Capital": "Brazzaville",
            "GDP per Capita (2011 PPP $ (UN))": "329",
            "Population": "4,337,051"
        },
        "Costa Rica": {
            "Country": "Costa Rica",
            "Capital": "San Jos\u00e9",
            "GDP per Capita (2011 PPP $ (UN))": "10732",
            "Population": "4,805,295"
        },
        "_empty_": {
            "Country": "",
            "Capital": "",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "556,783"
        },
        "Croatia": {
            "Country": "Croatia",
            "Capital": "Zagreb",
            "GDP per Capita (2011 PPP $ (UN))": "16162",
            "Population": "4,267,600"
        },
        "Cuba": {
            "Country": "Cuba",
            "Capital": "Havana",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "11,270,957"
        },
        "Cura\u00e7ao": {
            "Country": "Cura\u00e7ao",
            "Capital": "",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "152,056"
        },
        "Cyprus": {
            "Country": "Cyprus",
            "Capital": "Nicosia",
            "GDP per Capita (2011 PPP $ (UN))": "26045",
            "Population": "1,128,994"
        },
        "Czech Republic": {
            "Country": "Czech Republic",
            "Capital": "Prague",
            "GDP per Capita (2011 PPP $ (UN))": "23967",
            "Population": "10,510,785"
        },
        "Denmark": {
            "Country": "Denmark",
            "Capital": "Copenhagen",
            "GDP per Capita (2011 PPP $ (UN))": "32399",
            "Population": "5,591,572"
        },
        "Djibouti": {
            "Country": "Djibouti",
            "Capital": "Djibouti",
            "GDP per Capita (2011 PPP $ (UN))": "2087",
            "Population": "859,652"
        },
        "Dominica": {
            "Country": "Dominica",
            "Capital": "Roseau",
            "GDP per Capita (2011 PPP $ (UN))": "11120",
            "Population": "71,684"
        },
        "Dominican Republic": {
            "Country": "Dominican Republic",
            "Capital": "Santo Domingo",
            "GDP per Capita (2011 PPP $ (UN))": "8651",
            "Population": "10,276,621"
        },
        "Ecuador": {
            "Country": "Ecuador",
            "Capital": "Quito",
            "GDP per Capita (2011 PPP $ (UN))": "7443",
            "Population": "15,492,264"
        },
        "Egypt, Arab Rep.": {
            "Country": "Egypt, Arab Rep.",
            "Capital": "Cairo",
            "GDP per Capita (2011 PPP $ (UN))": "5547",
            "Population": "80,721,874"
        },
        "El Salvador": {
            "Country": "El Salvador",
            "Capital": "San Salvador",
            "GDP per Capita (2011 PPP $ (UN))": "6032",
            "Population": "6,297,394"
        },
        "Equatorial Guinea": {
            "Country": "Equatorial Guinea",
            "Capital": "Malabo",
            "GDP per Capita (2011 PPP $ (UN))": "32026",
            "Population": "736,296"
        },
        "Eritrea": {
            "Country": "Eritrea",
            "Capital": "Asmara",
            "GDP per Capita (2011 PPP $ (UN))": "516",
            "Population": "6,130,922"
        },
        "Estonia": {
            "Country": "Estonia",
            "Capital": "Tallinn",
            "GDP per Capita (2011 PPP $ (UN))": "17885",
            "Population": "1,329,301"
        },
        "Ethiopia": {
            "Country": "Ethiopia",
            "Capital": "Addis Ababa",
            "GDP per Capita (2011 PPP $ (UN))": "979",
            "Population": "91,728,849"
        },
        "Faeroe Islands": {
            "Country": "Faeroe Islands",
            "Capital": "T\u00f3rshavn",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "49,506"
        },
        "Fiji": {
            "Country": "Fiji",
            "Capital": "Suva",
            "GDP per Capita (2011 PPP $ (UN))": "4199",
            "Population": "874,742"
        },
        "Finland": {
            "Country": "Finland",
            "Capital": "Helsinki",
            "GDP per Capita (2011 PPP $ (UN))": "32254",
            "Population": "5,413,971"
        },
        "France": {
            "Country": "France",
            "Capital": "Paris",
            "GDP per Capita (2011 PPP $ (UN))": "29819",
            "Population": "65,696,689"
        },
        "French Polynesia": {
            "Country": "French Polynesia",
            "Capital": "Papeete",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "273,814"
        },
        "Gabon": {
            "Country": "Gabon",
            "Capital": "Libreville",
            "GDP per Capita (2011 PPP $ (UN))": "13998",
            "Population": "1,632,572"
        },
        "Gambia, The": {
            "Country": "Gambia, The",
            "Capital": "Banjul ",
            "GDP per Capita (2011 PPP $ (UN))": "1873",
            "Population": "1,791,225"
        },
        "Georgia": {
            "Country": "Georgia",
            "Capital": "Tbilisi",
            "GDP per Capita (2011 PPP $ (UN))": "4826",
            "Population": "4,490,700"
        },
        "Germany": {
            "Country": "Germany",
            "Capital": "Berlin",
            "GDP per Capita (2011 PPP $ (UN))": "34437",
            "Population": "80,425,823"
        },
        "Ghana": {
            "Country": "Ghana",
            "Capital": "Accra",
            "GDP per Capita (2011 PPP $ (UN))": "1652",
            "Population": "25,366,462"
        },
        "Greece": {
            "Country": "Greece",
            "Capital": "Athens",
            "GDP per Capita (2011 PPP $ (UN))": "22558",
            "Population": "11,092,771"
        },
        "Greenland": {
            "Country": "Greenland",
            "Capital": "Nuuk",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "56,81"
        },
        "Grenada": {
            "Country": "Grenada",
            "Capital": "St. George's",
            "GDP per Capita (2011 PPP $ (UN))": "9806",
            "Population": "105,483"
        },
        "Guam": {
            "Country": "Guam",
            "Capital": "Hag\u00e5t\u00f1a",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "162,81"
        },
        "Guatemala": {
            "Country": "Guatemala",
            "Capital": "Guatemala City",
            "GDP per Capita (2011 PPP $ (UN))": "4351",
            "Population": "15,082,831"
        },
        "Guinea": {
            "Country": "Guinea",
            "Capital": "Conakry",
            "GDP per Capita (2011 PPP $ (UN))": "990",
            "Population": "11,451,273"
        },
        "Guinea-Bissau": {
            "Country": "Guinea-Bissau",
            "Capital": "Bissau",
            "GDP per Capita (2011 PPP $ (UN))": "1097",
            "Population": "1,663,558"
        },
        "Guyana": {
            "Country": "Guyana",
            "Capital": "Georgetown",
            "GDP per Capita (2011 PPP $ (UN))": "3104",
            "Population": "795,369"
        },
        "Haiti": {
            "Country": "Haiti",
            "Capital": "Port-au-Prince",
            "GDP per Capita (2011 PPP $ (UN))": "1034",
            "Population": "10,173,775"
        },
        "Honduras": {
            "Country": "Honduras",
            "Capital": "Tegucigalpa",
            "GDP per Capita (2011 PPP $ (UN))": "3566",
            "Population": "7,935,846"
        },
        "Hong Kong SAR, China": {
            "Country": "Hong Kong SAR, China",
            "Capital": "",
            "GDP per Capita (2011 PPP $ (UN))": "43844",
            "Population": "7,154,600"
        },
        "Hungary": {
            "Country": "Hungary",
            "Capital": "Budapest",
            "GDP per Capita (2011 PPP $ (UN))": "17295",
            "Population": "9,920,362"
        },
        "Iceland": {
            "Country": "Iceland",
            "Capital": "Reykjav\u00edk",
            "GDP per Capita (2011 PPP $ (UN))": "33618",
            "Population": "320,716"
        },
        "India": {
            "Country": "India",
            "Capital": "New Delhi",
            "GDP per Capita (2011 PPP $ (UN))": "3203",
            "Population": "1,236,686,732"
        },
        "Indonesia": {
            "Country": "Indonesia",
            "Capital": "Jakarta",
            "GDP per Capita (2011 PPP $ (UN))": "4094",
            "Population": "246,864,191"
        },
        "Iran, Islamic Rep.": {
            "Country": "Iran, Islamic Rep.",
            "Capital": "Tehran",
            "GDP per Capita (2011 PPP $ (UN))": "10462",
            "Population": "76,424,443"
        },
        "Iraq": {
            "Country": "Iraq",
            "Capital": "Baghdad",
            "GDP per Capita (2011 PPP $ (UN))": "3412",
            "Population": "32,578,209"
        },
        "Ireland": {
            "Country": "Ireland",
            "Capital": "Dublin",
            "GDP per Capita (2011 PPP $ (UN))": "35640",
            "Population": "4,586,897"
        },
        "Isle of Man": {
            "Country": "Isle of Man",
            "Capital": "Douglas",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "85,284"
        },
        "Israel": {
            "Country": "Israel",
            "Capital": "Jerusalem",
            "GDP per Capita (2011 PPP $ (UN))": "26720",
            "Population": "7,910,500"
        },
        "Italy": {
            "Country": "Italy",
            "Capital": "Rome",
            "GDP per Capita (2011 PPP $ (UN))": "27069",
            "Population": "59,539,717"
        },
        "Ivory Coast": {
            "Country": "Ivory Coast",
            "Capital": "Yamoussoukro",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": ""
        },
        "Jamaica": {
            "Country": "Jamaica",
            "Capital": "Kingston",
            "GDP per Capita (2011 PPP $ (UN))": "7074",
            "Population": "2,707,805"
        },
        "Japan": {
            "Country": "Japan",
            "Capital": "Tokyo",
            "GDP per Capita (2011 PPP $ (UN))": "30660",
            "Population": "127,561,489"
        },
        "Jordan": {
            "Country": "Jordan",
            "Capital": "Amman",
            "GDP per Capita (2011 PPP $ (UN))": "5269",
            "Population": "6,318,000"
        },
        "Kazakhstan": {
            "Country": "Kazakhstan",
            "Capital": "Astana",
            "GDP per Capita (2011 PPP $ (UN))": "11568",
            "Population": "16,791,425"
        },
        "Kenya": {
            "Country": "Kenya",
            "Capital": "Nairobi",
            "GDP per Capita (2011 PPP $ (UN))": "1507",
            "Population": "43,178,141"
        },
        "Kiribati": {
            "Country": "Kiribati",
            "Capital": "South Tarawa",
            "GDP per Capita (2011 PPP $ (UN))": "2220",
            "Population": "100,786"
        },
        "Korea, Dem. Rep.": {
            "Country": "Korea, Dem. Rep.",
            "Capital": "Pyongyang",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "24,763,188"
        },
        "Korea, Rep.": {
            "Country": "Korea, Rep.",
            "Capital": "Seoul",
            "GDP per Capita (2011 PPP $ (UN))": "27541",
            "Population": "50,004,441"
        },
        "Kosovo": {
            "Country": "Kosovo",
            "Capital": "Pristina",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "1,807,106"
        },
        "Kuwait": {
            "Country": "Kuwait",
            "Capital": "Kuwait City",
            "GDP per Capita (2011 PPP $ (UN))": "47935",
            "Population": "3,250,496"
        },
        "Kyrgyzstan, Republic of": {
            "Country": "Kyrgyzstan, Republic of",
            "Capital": "Bishkek",
            "GDP per Capita (2011 PPP $ (UN))": "2126",
            "Population": "5,607,200"
        },
        "Laos": {
            "Country": "Laos",
            "Capital": "Vientiane",
            "GDP per Capita (2011 PPP $ (UN))": "2464",
            "Population": "6,645,827"
        },
        "Latvia": {
            "Country": "Latvia",
            "Capital": "Riga",
            "GDP per Capita (2011 PPP $ (UN))": "13773",
            "Population": "2,034,319"
        },
        "Lebanon": {
            "Country": "Lebanon",
            "Capital": "Beirut",
            "GDP per Capita (2011 PPP $ (UN))": "12900",
            "Population": "4,424,888"
        },
        "Lesotho": {
            "Country": "Lesotho",
            "Capital": "Maseru",
            "GDP per Capita (2011 PPP $ (UN))": "1504",
            "Population": "2,051,545"
        },
        "Liberia": {
            "Country": "Liberia",
            "Capital": "Monrovia",
            "GDP per Capita (2011 PPP $ (UN))": "506",
            "Population": "4,190,435"
        },
        "Libya": {
            "Country": "Libya",
            "Capital": "Tripoli",
            "GDP per Capita (2011 PPP $ (UN))": "15361",
            "Population": "6,154,623"
        },
        "Liechtenstein": {
            "Country": "Liechtenstein",
            "Capital": "Vaduz",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "36,656"
        },
        "Lithuania": {
            "Country": "Lithuania",
            "Capital": "Vilnius",
            "GDP per Capita (2011 PPP $ (UN))": "16877",
            "Population": "2,987,773"
        },
        "Luxembourg": {
            "Country": "Luxembourg",
            "Capital": "Luxembourg City",
            "GDP per Capita (2011 PPP $ (UN))": "68459",
            "Population": "530,946"
        },
        "Macedonia, Republic of": {
            "Country": "Macedonia, Republic of",
            "Capital": "Skopje",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "2,105,575"
        },
        "Madagascar": {
            "Country": "Madagascar",
            "Capital": "Antananarivo",
            "GDP per Capita (2011 PPP $ (UN))": "853",
            "Population": "22,293,914"
        },
        "Malawi": {
            "Country": "Malawi",
            "Capital": "Lilongwe",
            "GDP per Capita (2011 PPP $ (UN))": "805",
            "Population": "15,906,483"
        },
        "Malaysia": {
            "Country": "Malaysia",
            "Capital": "Kuala Lumpur",
            "GDP per Capita (2011 PPP $ (UN))": "13672",
            "Population": "29,239,927"
        },
        "Maldives": {
            "Country": "Maldives",
            "Capital": "Mal\u00e9",
            "GDP per Capita (2011 PPP $ (UN))": "7834",
            "Population": "338,442"
        },
        "Mali": {
            "Country": "Mali",
            "Capital": "Barnako",
            "GDP per Capita (2011 PPP $ (UN))": "964",
            "Population": "14,853,572"
        },
        "Malta": {
            "Country": "Malta",
            "Capital": "Valletta",
            "GDP per Capita (2011 PPP $ (UN))": "23007",
            "Population": "419,455"
        },
        "Marshall Islands": {
            "Country": "Marshall Islands",
            "Capital": "Majuro",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "52,555"
        },
        "Mauritania": {
            "Country": "Mauritania",
            "Capital": "Nouakchott",
            "GDP per Capita (2011 PPP $ (UN))": "2255",
            "Population": "3,796,141"
        },
        "Mauritius": {
            "Country": "Mauritius",
            "Capital": "Port Louis",
            "GDP per Capita (2011 PPP $ (UN))": "12737",
            "Population": "1,291,456"
        },
        "Mexico": {
            "Country": "Mexico",
            "Capital": "Mexico City",
            "GDP per Capita (2011 PPP $ (UN))": "12776",
            "Population": "120,847,477"
        },
        "Micronesia, Fed. Sts.": {
            "Country": "Micronesia, Fed. Sts.",
            "Capital": "Palikir",
            "GDP per Capita (2011 PPP $ (UN))": "3017",
            "Population": "103,395"
        },
        "Moldova": {
            "Country": "Moldova",
            "Capital": "Chi\u0219in\u0103u",
            "GDP per Capita (2011 PPP $ (UN))": "2975",
            "Population": "3,559,519"
        },
        "Monaco": {
            "Country": "Monaco",
            "Capital": "Monaco",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "37,579"
        },
        "Mongolia": {
            "Country": "Mongolia",
            "Capital": "Ulan Bator",
            "GDP per Capita (2011 PPP $ (UN))": "4178",
            "Population": "2,796,484"
        },
        "Montenegro": {
            "Country": "Montenegro",
            "Capital": "Podgorica",
            "GDP per Capita (2011 PPP $ (UN))": "10402",
            "Population": "621,081"
        },
        "Morocco": {
            "Country": "Morocco",
            "Capital": "Rabat",
            "GDP per Capita (2011 PPP $ (UN))": "4373",
            "Population": "32,521,143"
        },
        "Mozambique": {
            "Country": "Mozambique",
            "Capital": "Maputo",
            "GDP per Capita (2011 PPP $ (UN))": "861",
            "Population": "25,203,395"
        },
        "Myanmar (Burma)": {
            "Country": "Myanmar (Burma)",
            "Capital": "Naypyidaw",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "52,797,319"
        },
        "Namibia": {
            "Country": "Namibia",
            "Capital": "Windhoek",
            "GDP per Capita (2011 PPP $ (UN))": "5986",
            "Population": "2,259,393"
        },
        "Nepal": {
            "Country": "Nepal",
            "Capital": "Kathmandu",
            "GDP per Capita (2011 PPP $ (UN))": "1102",
            "Population": "27,474,377"
        },
        "Netherlands": {
            "Country": "Netherlands",
            "Capital": "Amsterdam",
            "GDP per Capita (2011 PPP $ (UN))": "37251",
            "Population": "16,754,962"
        },
        "New Caledonia": {
            "Country": "New Caledonia",
            "Capital": "Nourn\u00e9a",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "258,121"
        },
        "New Zealand": {
            "Country": "New Zealand",
            "Capital": "Wellington",
            "GDP per Capita (2011 PPP $ (UN))": "24818",
            "Population": "4,433,100"
        },
        "Nicaragua": {
            "Country": "Nicaragua",
            "Capital": "Managua",
            "GDP per Capita (2011 PPP $ (UN))": "2579",
            "Population": "5,991,733"
        },
        "Niger": {
            "Country": "Niger",
            "Capital": "Niamey",
            "GDP per Capita (2011 PPP $ (UN))": "642",
            "Population": "17,157,042"
        },
        "Nigeria": {
            "Country": "Nigeria",
            "Capital": "Abuja",
            "GDP per Capita (2011 PPP $ (UN))": "2221",
            "Population": "168,833,776"
        },
        "Northern Mariana Islands": {
            "Country": "Northern Mariana Islands",
            "Capital": "Saipan",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "53,305"
        },
        "Norway": {
            "Country": "Norway",
            "Capital": "Oslo",
            "GDP per Capita (2011 PPP $ (UN))": "46982",
            "Population": "5,018,573"
        },
        "Oman": {
            "Country": "Oman",
            "Capital": "Muscat",
            "GDP per Capita (2011 PPP $ (UN))": "25330",
            "Population": "3,314,001"
        },
        "Pakistan": {
            "Country": "Pakistan",
            "Capital": "Islamabad",
            "GDP per Capita (2011 PPP $ (UN))": "2424",
            "Population": "179,160,111"
        },
        "Palau": {
            "Country": "Palau",
            "Capital": "Ngerulmud",
            "GDP per Capita (2011 PPP $ (UN))": "13176",
            "Population": "20,754"
        },
        "Panama": {
            "Country": "Panama",
            "Capital": "Pana City",
            "GDP per Capita (2011 PPP $ (UN))": "13766",
            "Population": "3,802,281"
        },
        "Papua New Guinea": {
            "Country": "Papua New Guinea",
            "Capital": "Port Moresby",
            "GDP per Capita (2011 PPP $ (UN))": "2363",
            "Population": "7,167,010"
        },
        "Paraguay": {
            "Country": "Paraguay",
            "Capital": "Asunci\u00f3n",
            "GDP per Capita (2011 PPP $ (UN))": "4752",
            "Population": "6,687,361"
        },
        "Peru": {
            "Country": "Peru",
            "Capital": "Lima",
            "GDP per Capita (2011 PPP $ (UN))": "9049",
            "Population": "29,987,800"
        },
        "Philippines": {
            "Country": "Philippines",
            "Capital": "Manila",
            "GDP per Capita (2011 PPP $ (UN))": "3631",
            "Population": "96,706,764"
        },
        "Poland": {
            "Country": "Poland",
            "Capital": "Warsaw",
            "GDP per Capita (2011 PPP $ (UN))": "18087",
            "Population": "38,535,873"
        },
        "Portugal": {
            "Country": "Portugal",
            "Capital": "Lisbon",
            "GDP per Capita (2011 PPP $ (UN))": "21317",
            "Population": "10,514,844"
        },
        "Puerto Rico": {
            "Country": "Puerto Rico",
            "Capital": "San Juan",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "3,667,084"
        },
        "Qatar": {
            "Country": "Qatar",
            "Capital": "Doha",
            "GDP per Capita (2011 PPP $ (UN))": "77987",
            "Population": "2,050,514"
        },
        "Romania": {
            "Country": "Romania",
            "Capital": "Bucharest",
            "GDP per Capita (2011 PPP $ (UN))": "10905",
            "Population": "20,076,727"
        },
        "Russian Federation": {
            "Country": "Russian Federation",
            "Capital": "Moscow",
            "GDP per Capita (2011 PPP $ (UN))": "14808",
            "Population": "143,533,000"
        },
        "Rwanda": {
            "Country": "Rwanda",
            "Capital": "Kigali",
            "GDP per Capita (2011 PPP $ (UN))": "1097",
            "Population": "11,457,801"
        },
        "Samoa": {
            "Country": "Samoa",
            "Capital": "Apira",
            "GDP per Capita (2011 PPP $ (UN))": "4008",
            "Population": "188,889"
        },
        "San Marino": {
            "Country": "San Marino",
            "Capital": "San Marino",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "31,247"
        },
        "S\u00e3o Tom\u00e9 and Principe": {
            "Country": "S\u00e3o Tom\u00e9 and Principe",
            "Capital": "S\u00e3o Tom\u00e9",
            "GDP per Capita (2011 PPP $ (UN))": "1805",
            "Population": "188,098"
        },
        "Saudi Arabia": {
            "Country": "Saudi Arabia",
            "Capital": "Riyadh",
            "GDP per Capita (2011 PPP $ (UN))": "21430",
            "Population": "28,287,855"
        },
        "Senegal": {
            "Country": "Senegal",
            "Capital": "Dakar",
            "GDP per Capita (2011 PPP $ (UN))": "1737",
            "Population": "13,726,021"
        },
        "Serbia": {
            "Country": "Serbia",
            "Capital": "Belgrade",
            "GDP per Capita (2011 PPP $ (UN))": "9809",
            "Population": "7,223,887"
        },
        "Seychelles": {
            "Country": "Seychelles",
            "Capital": "Victoria",
            "GDP per Capita (2011 PPP $ (UN))": "23172",
            "Population": "88,303"
        },
        "Sierra Leone": {
            "Country": "Sierra Leone",
            "Capital": "Freetown",
            "GDP per Capita (2011 PPP $ (UN))": "769",
            "Population": "5,978,727"
        },
        "Singapore": {
            "Country": "Singapore",
            "Capital": "Singapore",
            "GDP per Capita (2011 PPP $ (UN))": "53591",
            "Population": "5,312,400"
        },
        "Sint Maarten (Dutch part)": {
            "Country": "Sint Maarten (Dutch part)",
            "Capital": "",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "39,088"
        },
        "Slovakia, Republic of": {
            "Country": "Slovakia, Republic of",
            "Capital": "Bratislava",
            "GDP per Capita (2011 PPP $ (UN))": "20757",
            "Population": "5,407,579"
        },
        "Slovenia": {
            "Country": "Slovenia",
            "Capital": "Ljubljana",
            "GDP per Capita (2011 PPP $ (UN))": "24967",
            "Population": "2,057,159"
        },
        "Solomon Islands": {
            "Country": "Solomon Islands",
            "Capital": "Honiara",
            "GDP per Capita (2011 PPP $ (UN))": "2581",
            "Population": "549,598"
        },
        "Somalia": {
            "Country": "Somalia",
            "Capital": "Mogadishu",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "10,195,134"
        },
        "South Africa": {
            "Country": "South Africa",
            "Capital": "Pretoria",
            "GDP per Capita (2011 PPP $ (UN))": "9678",
            "Population": "52,274,945"
        },
        "South Sudan": {
            "Country": "South Sudan",
            "Capital": "South Sudan",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "10,837,527"
        },
        "Spain": {
            "Country": "Spain",
            "Capital": "Madrid",
            "GDP per Capita (2011 PPP $ (UN))": "27063",
            "Population": "46,761,264"
        },
        "Sri Lanka": {
            "Country": "Sri Lanka",
            "Capital": "Sri Jayawardenepura Kotte",
            "GDP per Capita (2011 PPP $ (UN))": "4929",
            "Population": "20,328,000"
        },
        "St. Kitts and Nevis": {
            "Country": "St. Kitts and Nevis",
            "Capital": "Basseterre",
            "GDP per Capita (2011 PPP $ (UN))": "13291",
            "Population": "53,584"
        },
        "St. Lucia": {
            "Country": "St. Lucia",
            "Capital": "Castries",
            "GDP per Capita (2011 PPP $ (UN))": "8231",
            "Population": "180,87"
        },
        "St. Martin (French part)": {
            "Country": "St. Martin (French part)",
            "Capital": "",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "30,959"
        },
        "St. Vincent and the Grenadines": {
            "Country": "St. Vincent and the Grenadines",
            "Capital": "Kingstown",
            "GDP per Capita (2011 PPP $ (UN))": "9482",
            "Population": "109,373"
        },
        "Sudan": {
            "Country": "Sudan",
            "Capital": "Khartoum",
            "GDP per Capita (2011 PPP $ (UN))": "1878",
            "Population": "37,195,349"
        },
        "Suriname": {
            "Country": "Suriname",
            "Capital": "Paramaribo",
            "GDP per Capita (2011 PPP $ (UN))": "7110",
            "Population": "534,541"
        },
        "Swaziland": {
            "Country": "Swaziland",
            "Capital": "Mbabane",
            "GDP per Capita (2011 PPP $ (UN))": "5349",
            "Population": "1,230,985"
        },
        "Sweden": {
            "Country": "Sweden",
            "Capital": "Stockholm",
            "GDP per Capita (2011 PPP $ (UN))": "35048",
            "Population": "9,519,374"
        },
        "Switzerland": {
            "Country": "Switzerland",
            "Capital": "Bern",
            "GDP per Capita (2011 PPP $ (UN))": "37979",
            "Population": "7,996,861"
        },
        "Syria, Arabic Republic of": {
            "Country": "Syria, Arabic Republic of",
            "Capital": "Damascus",
            "GDP per Capita (2011 PPP $ (UN))": "4741",
            "Population": "22,399,254"
        },
        "Tajikistan": {
            "Country": "Tajikistan",
            "Capital": "Dushanbe",
            "GDP per Capita (2011 PPP $ (UN))": "2052",
            "Population": "8,008,990"
        },
        "Tanzania": {
            "Country": "Tanzania",
            "Capital": "Dar Es Salaam",
            "GDP per Capita (2011 PPP $ (UN))": "1334",
            "Population": "47,783,107"
        },
        "Thailand": {
            "Country": "Thailand",
            "Capital": "Bangkok",
            "GDP per Capita (2011 PPP $ (UN))": "7633",
            "Population": "66,785,001"
        },
        "Timor-Leste": {
            "Country": "Timor-Leste",
            "Capital": "Dili",
            "GDP per Capita (2011 PPP $ (UN))": "1393",
            "Population": "1,210,233"
        },
        "Togo": {
            "Country": "Togo",
            "Capital": "Lom\u00e9",
            "GDP per Capita (2011 PPP $ (UN))": "914",
            "Population": "6,642,928"
        },
        "Tonga": {
            "Country": "Tonga",
            "Capital": "Nuku'alofa",
            "GDP per Capita (2011 PPP $ (UN))": "4092",
            "Population": "104,941"
        },
        "Trinidad and Tobago": {
            "Country": "Trinidad and Tobago",
            "Capital": "Port of Spain",
            "GDP per Capita (2011 PPP $ (UN))": "22761",
            "Population": "1,337,439"
        },
        "Tunisia": {
            "Country": "Tunisia",
            "Capital": "Tunis",
            "GDP per Capita (2011 PPP $ (UN))": "8258",
            "Population": "10,777,500"
        },
        "Turkey": {
            "Country": "Turkey",
            "Capital": "Ankara",
            "GDP per Capita (2011 PPP $ (UN))": "13466",
            "Population": "73,997,128"
        },
        "Turkmenistan": {
            "Country": "Turkmenistan",
            "Capital": "Ashgabat",
            "GDP per Capita (2011 PPP $ (UN))": "8055",
            "Population": "5,172,931"
        },
        "Turks and Caicos Islands": {
            "Country": "Turks and Caicos Islands",
            "Capital": "Cockburn Town",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "32,427"
        },
        "Tuvalu": {
            "Country": "Tuvalu",
            "Capital": "Funafuti",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "9,86"
        },
        "Uganda": {
            "Country": "Uganda",
            "Capital": "Kampala",
            "GDP per Capita (2011 PPP $ (UN))": "1188",
            "Population": "36,345,860"
        },
        "Ukraine": {
            "Country": "Ukraine",
            "Capital": "Kiev",
            "GDP per Capita (2011 PPP $ (UN))": "6359",
            "Population": "45,593,300"
        },
        "United Arab Emirates": {
            "Country": "United Arab Emirates",
            "Capital": "Abu Dhabi",
            "GDP per Capita (2011 PPP $ (UN))": "42293",
            "Population": "9,205,651"
        },
        "United Kingdom": {
            "Country": "United Kingdom",
            "Capital": "Londun",
            "GDP per Capita (2011 PPP $ (UN))": "32474",
            "Population": "63,612,729"
        },
        "United States": {
            "Country": "United States",
            "Capital": "Washington, D.C.",
            "GDP per Capita (2011 PPP $ (UN))": "42486",
            "Population": "313,914,040"
        },
        "Uruguay": {
            "Country": "Uruguay",
            "Capital": "Montevideo",
            "GDP per Capita (2011 PPP $ (UN))": "13315",
            "Population": "3,395,253"
        },
        "Uzbekistan": {
            "Country": "Uzbekistan",
            "Capital": "Tashkent",
            "GDP per Capita (2011 PPP $ (UN))": "2903",
            "Population": "29,774,500"
        },
        "Vanuatu": {
            "Country": "Vanuatu",
            "Capital": "Port Vila",
            "GDP per Capita (2011 PPP $ (UN))": "4062",
            "Population": "247,262"
        },
        "Venezuela": {
            "Country": "Venezuela",
            "Capital": "Caracas",
            "GDP per Capita (2011 PPP $ (UN))": "11258",
            "Population": "29,954,782"
        },
        "Vietnam": {
            "Country": "Vietnam",
            "Capital": "Hanoi",
            "GDP per Capita (2011 PPP $ (UN))": "3013",
            "Population": "88,772,900"
        },
        "Virgin Islands (U.S.)": {
            "Country": "Virgin Islands (U.S.)",
            "Capital": "Charlotte Amalie",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "105,275"
        },
        "West Bank and Gaza": {
            "Country": "West Bank and Gaza",
            "Capital": "Gaza",
            "GDP per Capita (2011 PPP $ (UN))": "",
            "Population": "4,046,901"
        },
        "Yemen, Rep.": {
            "Country": "Yemen, Rep.",
            "Capital": "Sana'a",
            "GDP per Capita (2011 PPP $ (UN))": "2060",
            "Population": "23,852,409"
        },
        "Zambia": {
            "Country": "Zambia",
            "Capital": "Lusaka",
            "GDP per Capita (2011 PPP $ (UN))": "1423",
            "Population": "14,075,099"
        },
        "Zimbabwe": {
            "Country": "Zimbabwe",
            "Capital": "Harare",
            "GDP per Capita (2011 PPP $ (UN))": "..",
            "Population": "13,724,317"
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
            img.style.width = "100%";

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
