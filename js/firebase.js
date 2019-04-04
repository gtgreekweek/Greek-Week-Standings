var config = {
    apiKey: "AIzaSyCjVbP6rCdOGEdL4yT9L6olvfjjazaLLiU",
    authDomain: "greek-week-28065.firebaseapp.com",
    databaseURL: "https://greek-week-28065.firebaseio.com",
    projectId: "greek-week-28065",
    storageBucket: "greek-week-28065.appspot.com",
    messagingSenderId: "1060345771072"
};
firebase.initializeApp(config);


function loadChapters(callback) {
	var promises = [firebase.database().ref("fraternities").once("value"),
                    firebase.database().ref("sororities").once("value")]
    Promise.all(promises).then(results => {
        fraternityObject = results[0].val();
        sororityObject = results[1].val();
        fraternities = []
        sororities = []

        for (name in fraternityObject) {
            frat = {
                name: name,
                letters: fraternityObject[name].letters,
                points: fraternityObject[name].totalPoints
            }
            fraternities.push(frat);
        }

        for (name in sororityObject) {
            srat = {
                name: name,
                letters: sororityObject[name].letters,
                points: sororityObject[name].totalPoints
            }
            sororities.push(srat);
        }

        callback(fraternities, sororities)
    })
}

function loadMostRecentEvents(callback) {
	var promises = [firebase.database().ref("events").once("value"),
                    firebase.database().ref("calendar").once("value")]
    Promise.all(promises).then(results => {
    	eventsObject = results[0].val()
    	calendarArray = results[1].val()

		calendarArray = calendarArray.sort(function(a, b) {
            aDate = new Date(a["Date"] + " " + a["Time"]);
            bDate = new Date(b["Date"] + " " + b["Time"]);
	        return bDate - aDate
	    })
    	var now = new Date()
    	events = []
    	for (index in calendarArray) {
    		calendarEntry = calendarArray[index]
    		if (new Date(calendarEntry["Date"] + " " +  calendarEntry["Time"]) <= now && events.indexOf(calendarEntry["Display Name"]) < 0) {
    			events.push(calendarEntry["Display Name"])
    		}
    	}

        eventsToReturn = []

        for (index in events) {
            eventName = events[index]
            eventObject = eventsObject[eventName]
            eventsToReturn.push(eventObject)
        }
    	callback(eventsToReturn)
    })
}

// Load chapter from Firebase
function loadChapter(name, classification, callback) {
    var chaptersTable = classification == fraternity ? "fraternities" : "sororities"
    var promises = [
        firebase.database().ref("events").once("value"),
        firebase.database().ref(chaptersTable).once("value"),
    ]

    Promise.all(promises).then(results => {
        var events = results[0].val()
        var chapters = results[1].val()

        var results = {chapter : chapters[name], scores : {}}

        var keysSorted = Object.keys(chapters).sort(function (a,b) {
            return chapters[b].totalPoints - chapters[a].totalPoints
        })

        results.chapter.place = keysSorted.indexOf(name) + 1

        for (event_name in events) {
            var event = events[event_name]

            event_data = {}

            participation = classification == fraternity ? "Participation_points_fraternities" : "Participation_points_sororities"
            placement = classification == fraternity ? "Placement_points_fraternities" : "Placement_points_sororities"
            spectator = classification == fraternity ? "Spectators_points_fraternities" : "Spectators_points_sororities"

            if (event[participation]) {
                var points = event[participation][name]
                event_data["participation"] = points
            }
            if (event[placement]) {
                var points = event[placement][name]
                event_data["placement"] = points
            }
            if (event[spectator]) {
                var points = event[spectator][name]
                event_data["spectator"] = points
            }

            results.scores[event_name] = event_data
        }

        callback(results);
    })
}