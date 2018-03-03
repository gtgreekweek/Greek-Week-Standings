var fraternity = "frat"
var sorority = "srat"

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
    return points
}

function Event(eventName) {
    this.fraternityPoints = [];
    this.sororityPoints = [];
    this.name = eventName
    this.topFraternities = [];
    this.topSororities = [];

    this.generateTopPlacements = function() {
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
}
