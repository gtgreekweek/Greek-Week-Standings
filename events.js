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
    $('.mainSheet #pageTitle').text(event);
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
                            <div class="standingsHeader sratHeader">Top 3 Sororities</div>
                            <div id="sorority"></div>
                        </div>
                        <div class="col-sm-6">
                            <div class="standingsHeader fratHeader">Top 5 Fraternities</div>
                            <div id="fraternity"></div>
                        </div>
                    </div>
                    <div class="row allOrgs" style="width:100%;" cellpadding="0" cellspacing="0">
                        <div class="col-sm-6">
                            <div class="standingsHeader sratHeader">All Sororities</div>
                            <div id="sorority"></div>
                        </div>
                        <div class="col-sm-6">
                            <div class="standingsHeader fratHeader">All Fraternities</div>
                            <div id="fraternity"></div>
                        </div>
                    </div>`
    $('.mainSheet #pageContent').removeClass('loading').html(content);
}

function insertTopChapters(type, chapters) {
    for (chapter of chapters) {
        var row = `<tr class='${(chapter.totalPoints == 0) ? "zeroPointItem" : "pointItem"}'>
                       <td class="chapterPointName"><a href="/chapter.html?${type === 'fraternity' ? 'f' : 's'}=${chapter.chapter.name.replace(/\s/g, '')}">${chapter.chapter.name}</a></td>
                       <td class="chapterPointValue">
                           <b>${chapter.totalPoints} ${(chapter.totalPoints == 1) ? "point" : "points"}</b>
                       </td>
                   </tr>`;
        $(`#pageContent .row.topRankings #${type}`).append(row);
    }
}

function insertAllChapters(type, chapters) {
    for (chapter of chapters) {
        var row = `<tr class='${(chapter.totalPoints == 0) ? "zeroPointItem" : "pointItem"}'>
                       <td class="chapterPointName"><a href="/chapter.html?${type === 'fraternity' ? 'f' : 's'}=${chapter.chapter.name.replace(/\s/g, '')}">${chapter.chapter.name}</a></td>
                       <td class="chapterPointValue">
                           <b>${chapter.totalPoints} ${(chapter.totalPoints == 1) ? "point" : "points"}</b>
                       </td>
                   </tr>`;
        $(`#pageContent .row.allOrgs #${type}`).append(row);
    }
}

function transformChaptersToEvents(chapters, event) {
    var eventData = [];
    for (var chapter of chapters) {
        var data = {
            totalPoints: 0,
            chapter: chapter
        }

        var chapterEventData = chapter.pointCategories.filter(function(e) { return e.name === event;});
        if (chapterEventData.length === 1) {
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

        insertTopChapters('fraternity', fraternityEvent.splice(0, 5));
        insertTopChapters('sorority', sororityEvent.splice(0, 3));
        insertAllChapters('fraternity', fraternityEvent);
        insertAllChapters('sorority', sororityEvent);
    });
}

