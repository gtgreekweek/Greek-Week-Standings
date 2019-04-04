var fraternity = "frat"
var sorority = "srat"

function Event(name) {
    this.name = name;
    this.fraternityPoints = [];
    this.sororityPoints = [];
    this.topFraternities = [];
    this.topSororities = [];
}

Event.prototype.generateTopPlacements = function() {
    this.fraternityPoints.sort((a, b) => {
        return b.placementPoints - a.placementPoints;
    });
    this.topFraternities = this.fraternityPoints.slice(0,5);
    this.sororityPoints.sort((a, b) => {
        return b.placementPoints - a.placementPoints;
    });
    this.topSororities = this.sororityPoints.slice(0,3);

    for (var i = 0; i < this.topFraternities.length; i++) {
        if (this.topFraternities[i].placementPoints == 0) {
            this.topFraternities.splice(i, this.topFraternities.length - i);
            break;
        }
    }

    for (var i = 0; i < this.topSororities.length; i++) {
        if (this.topSororities[i].placementPoints == 0) {
            this.topSororities.splice(i, this.topSororities.length - i);
        }
    }
}

function generateEventsFromChapters(fraternities, sororities) {
    var events = {};
    for (var i = 0; i < fraternities.length; i++) {
        var frat = fraternities[i];
        for (var j = 0; j < frat.pointCategories.length; j++) {
            var category = frat.pointCategories[j];
            if (events[category.name] == null) {
                events[category.name] = new Event(category.name);
            }
            var points = getPointsObject(category);
            points.letters = frat.letters;
            points.name = frat.name;

            events[category.name].fraternityPoints.push(points);
        }
    }
    for (var i = 0; i < sororities.length; i++) {
        var srat = sororities[i];
        for (var j = 0; j < srat.pointCategories.length; j++) {
            var category = srat.pointCategories[j];
            if (events[category.name] == null) {
                events[category.name] = new Event(category.name);
            }
            var points = getPointsObject(category);
            points.letters = srat.letters;
            points.name = srat.name;

            events[category.name].sororityPoints.push(points);
        }
    }
    for (var event in events) {
        events[event].generateTopPlacements();
    }
    return events;
}

function getPointsObject(category) {
    var placement = 0;
    var participation = 0;
    var spectators = 0;
    for (var k = 0; k < category.items.length; k++) {
        var pointItem = category.items[k];
        if (pointItem.name == "Participation") {
            participation = pointItem.points;
        } else if (pointItem.name == "Placement") {
            placement = pointItem.points;
        } else {
            spectators = pointItem.points;
        }
    }
    var points = {
        letters: "",
        name: "",
        placementPoints: placement,
        participationPoints: participation,
        spectatorPoints: spectators,
        totalPoints: placement + participation + spectators
    };

    return points;
}

function generatePageTitle(event) {
    $('.mainSheet .pageTitle').text(event);
    $("title").html(`${event} - Greek Week 2019`)
}

function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, "\\$&");

    var url = window.location.href;

    var regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    var results = regex.exec(url);

    if (!results || !results[2]) return null;

    return results[2].replace(/\+/g, " "); //decodeURIComponent(results[2].replace(/\+/g, " "));
}

function insertBasicHTMLContent() {
    var content = `<div class="row topRankings" style="width:100%; margin-top:15px;" cellpadding="0" cellspacing="0">
                        <div class="col-sm-6">
                            <div class="standingsHeader sratHeader">Top Sororities</div>
                            <div id="sororities">
                                <table class="contentTable" style="width:100%;">
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="standingsHeader fratHeader">Top Fraternities</div>
                            <div id="fraternities">
                                <table class="contentTable" style="width:100%;">
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="row allOrgs" style="width:100%; margin-top:45px;" cellpadding="0" cellspacing="0">
                        <div class="col-sm-12" id="pointsAwardedHeader">
                            <div class="pageTitle minor" style="margin-bottom:10px">Points Awarded</div>
                        </div>
                        <div class="col-sm-6">
                            <div id="sororities_all" class="sororities_table">
                                <table class="contentTable" style="width:100%;">
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div id="fraternities_all" class="fraternities_table">
                                <table class="contentTable" style="width:100%;">
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>`

    $('.mainSheet #pageContent').removeClass('loading').html(content);
}

function generateLink(type, chapter_name, content) {
    return `<a class="aBlock" href="/chapter.html?${type == 'fraternities' ? 'f' : 's'}=${chapter_name}">${content}</a>`
}

function insertTopChapters(type, chapters, total_scores, top_chapters) {
    var new_chapters = {}

    for (top_chapter of top_chapters) {
        new_chapters[top_chapter] = chapters[top_chapter]
    }

    var top_chapters = new_chapters

    var i = 0;
    for (var chapter_name in top_chapters) {
        var chapter = chapters[chapter_name]
        var score = total_scores[chapter_name]

        if (chapter == 0) {
            continue;
        }

        i++;
        var row = `<tr class='contentRow ${(chapter == 0) ? "zeroPointItem" : "pointItem"}'>
                        <td class="rankingPosition" style="padding:0;padding-left: 15px;">
                            ${generateLink(type, chapter_name, `
                                <table style="float:right">
                                    <tbody><tr><td><div class="rankingPosition" style="padding:0;"><b>#${i}</b></div></td></tr></tbody>
                                </table>
                            `)}
                        </td>
                        <td class="chapterPointName">
                            ${generateLink(type, chapter_name, `
                                <table class="chapterNameTable">
                                    <tbody><tr><td><div class="chapterLetters">${chapter.letters}</div></td></tr><tr><td><div class="chapterName">${chapter_name}</div></td></tr></tbody>
                                </table>`
                                )}
                        </td>
                        <td class="chapterPointValue">
                            ${generateLink(type, chapter_name, `
                                <table style="float:right">
                                    <tbody><tr><td><div class="chapterPoints"><b>${score}</b> ${(score == 1) ? "point" : "points"}</div></td></tr></tbody>
                                </table>`
                            )}
                        </td>
                        <td>
                            ${generateLink(type, chapter_name, `<img class="disclosureIndicator" src="/images/Disclosure Indicator.png">`)}
                        </td>
                   </tr>`;

            $(`#pageContent .row.topRankings #${type} > table > tbody`).append(row);
    }
}

function insertAllChapters(type, chapters) {
    for (var chapter_name in chapters) {
        var chapter = chapters[chapter_name]

        var eventRows = '';
        var scoreRows = '';
        for (var name in chapter.points) {
            var score = chapter.points[name]
            var hasScore = score > 0;

            eventRows += `<div style="display: block; width:100%"><div style="text-align: left; display:inline-block;"><p style="color: ${hasScore ? 'black' : '#bbb'}">${capitalize(name)}</p></div></div>`;
            scoreRows += `<div style="display: block; width:100%; text-align: right; margin-right:15px;padding-right:15px;"><div style=""><b><p style="color: ${hasScore ? 'black' : '#bbb'};">${score} ${score === 1 ? 'point' : 'points'}</p></b></div></div>`;
        }
        var row = Object.keys(chapter.points).length > 0 ? `<tr class='contentRow ${(chapter.total == 0) ? "zeroPointItem" : "pointItem"}'>
                        <td class="chapterPointName">
                            ${generateLink(type, chapter_name, `<table class="chapterNameTable"><tbody><tr><td><div class="chapterLetters" style="font-family: Georgia; font-size:20px;">${chapter_name}</div></td></tr></tbody></table>`)}
                        </td>
                    </tr>
                    <tr class='contentRow ${(chapter.total == 0) ? "zeroPointItem" : "pointItem"}'>
                        <td style="width: 100%; padding-left: 20px; padding-bottom: 5px;">
                            ${eventRows}
                        </td>
                        <td style="width: 100%; padding-right: 20px; padding-bottom: 5px; display:inline;">
                            ${scoreRows}
                        </td>
                        <td></td>
                    </tr>` : '';

        $(`#pageContent .row.allOrgs #${type}_all > table > tbody`).append(row);
    }
}

function transformChaptersToEvents(chapters, event) {
    var eventData = [];
    for (var chapter of chapters) {
        var data = {
            totalPoints: 0,
            chapter: chapter,
            items: []
        }

        var chapterEventData = chapter.pointCategories.filter(function(e) {
            return e.name === event;
        });

        if (chapterEventData.length === 1) {
            data.items = chapterEventData[0].items;
            data.totalPoints = chapterEventData[0].totalPoints();
        }
        eventData.push(data);
    }
    eventData.sort((a, b) => {
        return b.totalPoints - a.totalPoints;
    });
    return eventData;
}

function generateEventPage() {
    var event = decodeURIComponent(getParameterByName('e'));
    if (!event) {
        window.location = '/';
        return;
    }

    generatePageTitle(event);
    loadEvent(event, function(event_data) {
        console.log(event_data)
        insertBasicHTMLContent();
        var fraternities = event_data.scorers.fraternities
        var sororities = event_data.scorers.sororities

        if (Object.keys(fraternities).length === 0 && Object.keys(sororities).length === 0) {
            window.location = '/';
            return;
        }

        var frat_total_scores = {}, srat_total_scores = {};

        Object.keys(fraternities).map(function(frat) {
            var scores = fraternities[frat].points
            var sum = 0
            for (var i in scores) {
                sum += scores[i]
            }
            if (sum > 0) {
                frat_total_scores[frat] = sum
            }
        })

        Object.keys(sororities).map(function(srat) {
            var scores = sororities[srat].points
            sum = 0
            for (i in scores) {
                sum += scores[i]
            }
            srat_total_scores[srat] = sum
        });

        var top_sororities_arr = Object.keys(srat_total_scores).sort(function (a, b) {
            return srat_total_scores[b] - srat_total_scores[a]
        })

        var top_fraternities_arr = Object.keys(frat_total_scores).sort(function (a, b) {
            return frat_total_scores[b] - frat_total_scores[a]
        })

        if (event_data.has_placement) {
            insertTopChapters('fraternities', fraternities, frat_total_scores, top_fraternities_arr.splice(0, 5));
            insertTopChapters('sororities', sororities, srat_total_scores, top_sororities_arr.splice(0, 3));
        } else {
            $('#pageContent .row.topRankings').remove();
            $('#pointsAwardedHeader').remove();
            $('#pageContent .row.allOrgs').css('margin-top', '15px');
        }

        insertAllChapters('fraternities', fraternities);
        insertAllChapters('sororities', sororities);
    });
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
