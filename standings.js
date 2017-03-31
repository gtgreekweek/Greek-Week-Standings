
// Load Standings

function loadStandings() {
    //showPointsForChapterAtRow(10, fraternity)
    
    getChapterArrays(function(fraternities, soririties) {
        renderListOfChaptersInDiv(fraternities, $("#fraternities"), fraternity)
        renderListOfChaptersInDiv(soririties, $("#sororities"), sorority)      
    })
    
}

function renderListOfChaptersInDiv(chapters, div, classification) {
    
    chapters = chapters.sort(function(left, right) {
        return right.points - left.points
    })
    
    var renderedContent = "<table class='contentTable'>"
    
    for (var i = 0; i < chapters.length; i++) {
        var href = `chapter.html?${classification == fraternity ? 'f' : 's'}=${chapters[i].nameNoSpaces()}`
        
        renderedContent += `
            <tr class='contentRow'>
                <td>
                    <a class="aBlock" href="${href}">
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
                    <a class="aBlock" href="${href}">
                        <table>
                        <tr> <td> <div class="chapterPoints">
                            <b>${chapters[i].points}</b> ${chapters[i].points == 1.0 ? "Point" : "Points"}
                        </td> </tr> </div>
                        </table>
                    </a>
                </td>
                <td>
                    <a class="aBlock" href="${href}">
                        <img class="disclosureIndicator" src="Disclosure Indicator.png">
                    </a>
                </td>
            </tr>
        `
    }
    
    renderedContent += "</table>"
    div.html(renderedContent)
}

