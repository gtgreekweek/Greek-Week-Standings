var fraternity = "frat"
var sorority = "srat"

const allowedEvents = [
    'Leadership Breakfast',
    'Bromance',
    'Greek God',
    'Greek Goddess',
    'Stroll',
    'Eating Contest',
    'Super Splash',
    'Bailout',
    'Trivia',
    'Sumo Suit Race',
    'Cornhole',
    'Slam Dunk',
    'Faculty Luncheon',
    'Egg Toss',
    'Human Pyramid',
    'Sweatshirt Relay',
    'Inner Tube Relay',
    'Sand Volleyball',
    'Penalty Kick Shootout',
    'Flag Football',
    'Dodgeball',
    'Tug',
    'Dizzy Bat',
    'Obstacle Course',
    'Alumni Reception',
    'Greek Sing',
    'Sting Hunger Now',
    'Blood Drive',
    'Tech Beautification Day',
    'Relay for Life'
];


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

function isValidEvent(event) {
    return allowedEvents.indexOf(event) > -1;
}

function generatePageTitle(event) {
    $('.mainSheet .pageTitle').text(event);
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
    var content = `<div class="row topRankings" style="width:100%;" cellpadding="0" cellspacing="0">
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
                    <div class="row allOrgs" style="width:100%;" cellpadding="0" cellspacing="0">
                        <div class="col-sm-12">
                            <div class="pageTitle">Points Awarded</div>
                        </div>
                        <div class="col-sm-6">
                            <div class="standingsHeader sratHeader">Sororities</div>
                            <div id="sororities_all" class="sororities_table">
                                <table class="contentTable" style="width:100%;">
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="standingsHeader fratHeader">Fraternities</div>
                            <div id="fraternities_all" class="fraternities_table">
                                <table class="contentTable" style="width:100%;">
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>`
    $('.mainSheet #pageContent').removeClass('loading').html(content);
}

function generateLink(type, chapter, content) {
    return `<a class="aBlock" href="/chapter.html?${type === 'fraternity' ? 'f' : 's'}=${chapter.chapter.nameNoSpaces()}">${content}</a>` 
}

function insertTopChapters(type, chapters) {
    var i = 0;
    for (chapter of chapters) {
        i++;
        var row = `<tr class='contentRow ${(chapter.totalPoints == 0) ? "zeroPointItem" : "pointItem"}'>
                        <td class="rankingPosition" style="padding:0;padding-left: 15px;">
                            ${generateLink(type, chapter, `<table style="float:right"><tbody><tr><td><div class="rankingPosition" style="padding:0;"><b>#${i}</b></div></td></tr></tbody></table>`)}
                        </td>
                        <td class="chapterPointName">
                            ${generateLink(type, chapter, `<table class="chapterNameTable"><tbody><tr><td><div class="chapterLetters">${chapter.chapter.letters}</div></td></tr><tr><td><div class="chapterName">${chapter.chapter.name}</div></td></tr></tbody></table>`)}
                        </td>
                        <td class="chapterPointValue">
                            ${generateLink(type, chapter, `<table style="float:right"><tbody><tr><td><div class="chapterPoints"><b>${chapter.totalPoints}</b> ${(chapter.totalPoints == 1) ? "point" : "points"}</div></td></tr></tbody></table>`)}
                        </td>
                        <td>
                            ${generateLink(type, chapter, `<img class="disclosureIndicator" src="Disclosure Indicator.png">`)}
                        </td>
                   </tr>`;

            $(`#pageContent .row.topRankings #${type} > table > tbody`).append(row);
    }
}

function insertAllChapters(type, chapters) {
    for (chapter of chapters) {
        var eventRows = '';
        var scoreRows = '';
        for (item of chapter.items) {
            var hasScore = false;
            if (item.points > 0) hasScore = true;
            eventRows += `<div style="display: block; width:100%"><div style="text-align: left; display:inline-block;"><p style="color: ${hasScore ? 'black' : '#bbb'}">${item.name}</p></div></div>`;
            scoreRows += `<div style="display: block; width:100%; text-align: right;"><div style="text-align: right;display:inline-block;"><p style="color: ${hasScore ? 'black' : '#bbb'}">${item.points}</p></div></div>`;
        }
        var row = `<tr class='contentRow ${(chapter.totalPoints == 0) ? "zeroPointItem" : "pointItem"}'>
                        <td class="chapterPointName">
                            ${generateLink(type, chapter, `<table class="chapterNameTable"><tbody><tr><td><div class="chapterLetters">${chapter.chapter.letters}</div></td></tr><tr><td><div class="chapterName">${chapter.chapter.name}</div></td></tr></tbody></table>`)}
                        </td>
                        <td class="chapterPointValue">
                            ${generateLink(type, chapter, `<table style="float:right"><tbody><tr><td><div class="chapterPoints"><b>${chapter.totalPoints}</b> ${(chapter.totalPoints == 1) ? "point" : "points"}</div></td></tr></tbody></table>`)}
                        </td>
                        <td>
                            ${generateLink(type, chapter, `<img class="disclosureIndicator" src="Disclosure Indicator.png">`)}
                        </td>
                    </tr>
                    <tr class='contentRow ${(chapter.totalPoints == 0) ? "zeroPointItem" : "pointItem"}'>
                        <td style="width: 100%; padding-left: 15px">
                            ${eventRows}
                        </td>
                        <td></td>
                        <td style="width: 100%; padding-right: 20px;">
                            ${scoreRows}
                        </td>
                    </tr>`;

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

        var chapterEventData = chapter.pointCategories.filter(function(e) { return e.name === event;});
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
    if (!event || !isValidEvent(event)) {
        window.location = '/';
        return;
    }

    generatePageTitle(event);
    getChapterArrays(function(fraternities, sororities) {
        insertBasicHTMLContent();
        var fraternityEvent = transformChaptersToEvents(fraternities, event);
        var sororityEvent = transformChaptersToEvents(sororities, event);

        if (fraternityEvent.length === 0 || sororityEvent.length === 0) {
            window.location = '/';
            return;
        }

        var filterSratEvent = sororityEvent.filter(function(chapter) {
            return chapter.totalPoints > 0;
        }).sort(function(a, b) {
            if (a.chapter.name === b.chapter.name) return 0;
            return a.chapter.name > b.chapter.name ? 1 : -1;
        });

        var filterFratEvent = fraternityEvent.filter(function(chapter) {
            return chapter.totalPoints > 0;
        }).sort(function(a, b) {
            if (a.chapter.name === b.chapter.name) return 0;
            return a.chapter.name > b.chapter.name ? 1 : -1;
        });

        console.log(filterFratEvent)

        insertTopChapters('fraternities', fraternityEvent.splice(0, 5));
        insertTopChapters('sororities', sororityEvent.splice(0, 3));
        insertAllChapters('fraternities', filterFratEvent);
        insertAllChapters('sororities', filterSratEvent);
    });
}

