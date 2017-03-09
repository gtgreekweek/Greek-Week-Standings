
// CONSTANTS
var fraternitiesCSV = "https://docs.google.com/spreadsheets/d/1ec27H8thNdeJ8AVgzaJoIhxK-CYiYdNP_J1VIiLar1g/pub?gid=32378140&single=true&output=csv"
var sororitiesCSV = "https://docs.google.com/spreadsheets/d/1ec27H8thNdeJ8AVgzaJoIhxK-CYiYdNP_J1VIiLar1g/pub?gid=360463781&single=true&output=csv"

var fraternity = "frat"
var sorority = "srat"


// Load Standings

function loadStandings() {
    //showPointsForChapterAtRow(10, fraternity)
    loadStandingsIntoDiv(fraternity, $("#fraternities"))
    loadStandingsIntoDiv(sorority, $("#sororities"))
}

function loadStandingsIntoDiv(classification, div) {
    
    getChaptersArray(classification, function(chapters) {
        
        var sortedChapters = chapters.sort(function(left, right) {
            return right.points - left.points
        })
        
        renderListOfChaptersInDiv(sortedChapters, div, classification)
    })
    
}

function renderListOfChaptersInDiv(chapters, div, classification) {
    var renderedContent = "<table class='contentTable'>"
    
    for (var i = 0; i < chapters.length; i++) {
        var onClick = `showPointsForChapterAtRow(${chapters[i].rowIndex}, '${classification}')`
        
        renderedContent += `
            <tr class='contentRow'>
                <td>
                    <a href="javascript:void(0)" onclick="${onClick}">
                        <table class="chapterNameTable">
                            <tr>
                                <td><div class="chapterLetters">${chapters[i].letters}</div></td>
                            </tr>
                            <tr>
                                <td><div class="chapterName">${chapters[i].name}</div></td>
                            </tr>
                        </table>
                    </a>
                </td>
                <td>
                    <a href="javascript:void(0)" onclick="${onClick}">
                        <table>
                        <tr> <td> <div class="chapterPoints">
                            <b>${chapters[i].points}</b> ${chapters[i].points == 1.0 ? "Point" : "Points"}
                        </td> </tr> </div>
                        </table>
                    </a>
                </td>
            </tr>
        `
    }
    
    renderedContent += "</table>"
    div.html(renderedContent)
}

