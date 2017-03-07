
// CONSTANTS
var fraternitiesCSV = "https://docs.google.com/spreadsheets/d/1ec27H8thNdeJ8AVgzaJoIhxK-CYiYdNP_J1VIiLar1g/pub?gid=32378140&single=true&output=csv"
var sororitiesCSV = "https://docs.google.com/spreadsheets/d/1ec27H8thNdeJ8AVgzaJoIhxK-CYiYdNP_J1VIiLar1g/pub?gid=360463781&single=true&output=csv"


// Load Standings

function loadStandings() {
    loadStandingsIntoDiv(fraternitiesCSV, $("#fraternities"))
    loadStandingsIntoDiv(sororitiesCSV, $("#sororities"))
}

function loadStandingsIntoDiv(csvURL, div) {
    
    csvArrayFromURL(csvURL, function(csv) {
        if (csv == undefined) {
            console.log("could not load CSV")
            return
        }
        
        var chapters = []
        var chapterCount = csv.length - 2 //2 header rows
        
        for (var i = 0; i < chapterCount; i++) {
            chapters.push(new Chapter(i + 2, csv))
        }
        
        console.log(chapters)
        
        sortedChapters = chapters.sort(function(left, right) {
            return right.points - left.points
        })
        
        console.log(sortedChapters)
        
        renderListOfChaptersInDiv(sortedChapters, div)
    })
    
}

// completion is a (String) -> (). If the string is undefined, then there was an error.
function csvArrayFromURL(url, completion) {
    
    if (url == undefined) {
        completion(undefined)
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
 
    xhr.onreadystatechange = function processRequest(e) {
        if (xhr.readyState == 4 /* 4 = DONE LOADING */ ) {
            
            if (xhr.status != 200 /* 200 = SUCCESS */ ) {
                completion(undefined)
                return
            }
            
            var csvArray = xhr.responseText.split("\r\n").map(function(line) {
                return line.split(",")
            })
            
            completion(csvArray)
        }
    }
    
}

function renderListOfChaptersInDiv(chapters, div) {
    var renderedContent = "<table>"
    
    for (var i = 0; i < chapters.length; i++) {
        renderedContent += `
            <tr>
                <td>
                    <table class="chapterNameTable">
                        <tr>
                            <td><div class="chapterLetters">${chapters[i].letters}</div></td>
                        </tr>
                        <tr>
                            <td><div class="chapterName">${chapters[i].name}</div></td>
                        </tr>
                    </table>
                </td>
                <td>
                    <div class="chapterPoints"><b>${chapters[i].points}</b> ${chapters[i].points == 1.0 ? "Point" : "Points"}</div>
                </td>
            </tr>
        `
    }
    
    renderedContent += "</table>"
    div.html(renderedContent)
}

