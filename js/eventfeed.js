
function loadFeed() {
    loadChapters(function (fraternities, sororities) {
        loadMostRecentEvents(function (eventsToShow) {
            renderEventsFeed(eventsToShow, $("#eventsFeed"), fraternities, sororities)
        })
    })
    
}

function renderEventsFeed(events, feed, fraternities, sororities) {
    var renderedContent = "<div class='col-md-6 col-md-offset-1'><table>"

    var recentFive = Object.keys(events).slice(0, 10);

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
            var start = ""
            if (key == "Placement") {
                start = (parseInt(index) + 1) + ". "
            }
            scoreString += start + letters + " - " + pointsObj.points + " Points<br>";
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

    scoreContent = `
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
        </tr>`

    if (sororityRankings == "" && fraternityRankings == "") {
        scoreContent = `
            <tr class='contentRow'>
            <td>
                <p style="margin-left: 20px">Points for this event are still pending</p
            </td>
        </tr>

        `;
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
        ${scoreContent}
        `;

    return renderedContent;
}

function getLetters(chapters, name) {
    filtered = chapters.filter((a) => {
        return a.name === name
    })

    return filtered[0].letters
}
