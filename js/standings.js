// Load Standings

function nameNoSpaces(name) {
    while(name.includes(" ")) {
        name = name.replace(" ", "")
    }

    return name
}


function loadStandings() {
    loadChapters(function (fraternities, sororities) {
        renderListOfChaptersInDiv(fraternities, $("#fraternities"), fraternity)
        renderListOfChaptersInDiv(sororities, $("#sororities"), sorority)
    })
    
}

function renderListOfChaptersInDiv(chapters, div, classification) {

    chapters = chapters.sort(function(a, b) {
        return b.points - a.points
    })

    var renderedContent = "<table class='contentTable'>"

    for (var i = 0; i < chapters.length; i++) {
        var href = `chapter.html?${classification == fraternity ? 'f' : 's'}=${chapters[i].name}`

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
                        <img class="disclosureIndicator" src="/images/Disclosure Indicator.png">
                    </a>
                </td>
            </tr>
        `
    }

    renderedContent += "</table>"
    div.html(renderedContent)
}

