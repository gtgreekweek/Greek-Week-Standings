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
    // loadMostRecentEvents(function (eventsToShow) {
    //     renderEventsFeed(eventsToShow, $("#eventsFeed"))
    // })
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

function renderEventsFeed(events, feed) {
    var renderedContent = "<div class='col-md-6 col-md-offset-1'><table>"

    var recentFive = Object.keys(events).slice(0, 5);

    for (var i = 0; i < recentFive.length; i++) {
        var event = events[recentFive[i]];

        var eventHasPlacement = event.Placement_points_sororities || event.Placement_points_fraternities;

        var href = `event.html?e=${event.name}`

        renderedContent += `
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
            </tr>`;

        if (eventHasPlacement) {
            var topSororitiesString = "";
            for (var j = 0; j < event.Placement_points_sororities.length; j++) {
                topSororitiesString += (j + 1) + ". " + event.Placement_points_sororities[j].letters + "<br>";
            }
            var topFraternitiesString = "";
            for (var j = 0; j < event.Placement_points_fraternities.length; j++) {
                topFraternitiesString += (j + 1) + ". " + event.Placement_points_fraternities[j].letters + "<br>";
            }
            renderedContent += `
                <tr class='contentRow'>
                    <td>
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="sratHeader">
                                        Top Sororities
                                    </div>
                                    <div class="topSrats">${topSororitiesString}</div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="fratHeader">
                                        Top Fraternities
                                    </div>
                                    <div class="topFrats">${topFraternitiesString}</div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    renderedContent += "</table></div>";
    feed.html(renderedContent);
}

