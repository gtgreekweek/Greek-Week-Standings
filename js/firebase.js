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
    firebase.database().ref("events").once("value").then(results => {
    	eventsObject = results.val()
        eventsArray = [];

        for (eventName in eventsObject) {
            event = eventsObject[eventName];
            event["name"] = eventName;
            eventsArray.push(event);
        }
    	var now = new Date()
    	eventsArray.sort((a, b) => {
            return (new Date(b["date"])) - (new Date(a["date"]));
        });
        pastEventNames = [];
    	for (index in eventsArray) {
    		event = eventsArray[index]
    		if (new Date(event["date"]) <= now && pastEventNames.indexOf(event["name"]) < 0) {
    			pastEventNames.push(event["name"])
    		}
    	}

        eventsToReturn = []

        for (index in pastEventNames) {
            eventName = pastEventNames[index]
            eventObject = eventsObject[eventName]
            eventObject["name"] = eventName
            eventsToReturn.push(eventObject)
        }
    	callback(eventsToReturn)
    })
}

// Load a single chapter from Firebase
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

            for (category in event) {
                var parts = category.split("_")
                var key = parts[0]
                var type = parts[2]
                if (classification == fraternity && type == "fraternities") {
                    event_data[key] = event[category][name]
                } else if (classification == sorority && type == "sororities") {
                    event_data[key] = event[category][name]
                }
            }

            results.scores[event_name] = event_data
        }

        callback(results);
    })
}

// Loads a single event from firebase
function loadEvent(name, callback) {
    var promises = [
        firebase.database().ref("events").once("value"),
        firebase.database().ref("sororities").once("value"),
        firebase.database().ref("fraternities").once("value"),
    ]

    Promise.all(promises).then(results => {
        var events = results[0].val()
        var sororities = results[1].val()
        var fraternities = results[2].val()

        var event = events[name]
        event_data = {}

        var scorers = {fraternities : {}, sororities : {}}

        for (var sorority_name in sororities) {
            var scores = {
                total : sororities[sorority_name].totalPoints,
                letters : sororities[sorority_name].letters,
                points : {}
            }

            for (category in event) {
                if (category == "date"){
                    continue;
                }
                var parts = category.split("_")
                var key = parts[0]
                var type = parts[2]
                if (type == "sororities") {
                    scores.points[key] = event[category][sorority_name]
                }
            }

            // Add scorer
            if (Object.keys(scores).length > 0) {
                scorers.sororities[sorority_name] = scores
            }
        }

        for (var fraternity_name in fraternities) {
            var scores = {
                total : fraternities[fraternity_name].totalPoints,
                letters : fraternities[fraternity_name].letters,
                points : {}
            }

            for (category in event) {
                var parts = category.split("_")
                var key = parts[0]
                var type = parts[2]
                if (type == "fraternities") {
                    scores.points[key] = event[category][fraternity_name]
                }
            }

            // Add scorer
            if (Object.keys(scores).length > 0) {
                scorers.fraternities[fraternity_name] = scores
            }
        }

        event_data.scorers = scorers

        callback(event_data);
    })
}