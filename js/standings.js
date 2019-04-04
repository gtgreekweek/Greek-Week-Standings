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
        loadMostRecentEvents(function (eventsToShow) {
            renderEventsFeed(eventsToShow, $("#eventsFeed"), fraternities, sororities)
        })
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

function renderEventsFeed(events, feed, fraternities, sororities) {
    var renderedContent = "<div class='col-md-6 col-md-offset-1'><table>"

    var recentFive = Object.keys(events).slice(0, 5);

    for (var i = 0; i < recentFive.length; i++) {
        var event = events[recentFive[i]];
        renderedContent += eventsFeedStringForEvent(event, fraternities, sororities)
    }

    renderedContent += "</table></div>";
    feed.html(renderedContent);
}

function eventsFeedStringForEvent(event, fraternities, sororities) {
    var href = `event.html?e=${event.name}`


    var sororityRankings = "";
    var fraternityRankings = "";

    var scoresRow = "<tr"

    for (pointType in event) {
        if (pointType == "date") {
            continue;
        }
        var parts = pointType.split("_")
        var key = parts[0]
        var type = parts[2]

        points = event[pointType]
        pointsArray = []

        for (org in points) {
            earnedPoints = points[org];
            if (earnedPoints > 0) {
                pointsArray.push({
                    "org": org,
                    "points": earnedPoints
                })
            }
        }

        if (pointsArray.length == 0) {
            continue;
        }
        pointsArray.sort((a, b) => {
            return b["points"] - a["points"]
        })
        scoreString = "";

        for (index in pointsArray) {
            pointsObj = pointsArray[index];
            letters = type == "fraternities" ? getLetters(fraternities,pointsObj["org"]) : getLetters(sororities,pointsObj["org"])
            scoreString += (parseInt(index) + 1) + ". " + letters + " - " + pointsObj.points + " Points<br>";
        }

        if (type == "sororities") {
            sororityRankings += `
                <div class="container">
                    <div class="row">
                        <div class="col-sm-3">
                            <div class="sratHeader">
                                Sororities ${key}
                            </div>
                            <div class="topSrats">${scoreString}</div>
                        </div>
                    </div>
                </div>
            `
        } else {
            fraternityRankings += `
                <div class="container">
                    <div class="row">
                        <div class="col-sm-3">
                            <div class="fratHeader">
                                Fraternities ${key}
                            </div>
                            <div class="topFrats">${scoreString}</div>
                        </div>
                    </div>
                </div>
            `
        }
    }

    var renderedContent = `
        <tr class='contentRow'>
            <td>
                <a class="aBlock" href="${href}">
                    <table class="chapterNameTable">
                        <tr>
                            <td><div class="chapterLetters">${event.name}</div></td>
                        </tr>
                    </table>
                </a>
            </td>
            <td>
                <a class="aBlock" href="${href}">
                    <img class="disclosureIndicator" src="/images/Disclosure Indicator.png">
                </a>
            </td>
        </tr>
        <tr class='contentRow'>
            <td>
            <div class='container'>
                <div class="col-sm-3">
                    ${sororityRankings}
                </div>
                <div class="col-sm-3">
                    ${fraternityRankings}
                </div>
            </div>
            </td>
        </tr>`;

    return renderedContent;
}

function getLetters(chapters, name) {
    filtered = chapters.filter((a) => {
        return a.name === name
    })

    return filtered[0].letters
}
