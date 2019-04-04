function abort() {
    window.location = "/";
}

function loadPointsForChapter() {
    // Parse query parameters
    var chapterName = undefined
    var classification = undefined

    var fraternityName = decodeURIComponent(getParameterByName("f"))
    var sororityName = decodeURIComponent(getParameterByName("s"))

    if (fraternityName != "undefined") {
        chapterName = fraternityName
        classification = fraternity
    } else if (sororityName != "undefined") {
        chapterName = sororityName
        classification = sorority
    } else {
        abort()
        return
    }

    // Load data for chapter
    loadChapter(chapterName, classification, function(chapter_data) {
        if (chapter_data == undefined) {
            abort()
            return
        }

        var pageBody = `
            <div id='${"events-" + classification}' style="margin: 0 auto;">
                <div class="${classification}Header pageTitle">${chapter_data.chapter.letters}</div>
                <div id="bigChapterName">${chapterName}</div>
                <div id="bigChapterPoints">
                    <span class='${classification}Header'>
                        <b>${ordinal_suffix_of(chapter_data.chapter.place)} Place</b>
                    </span>
                    <br>
                    ${chapter_data.chapter.totalPoints} ${(chapter_data.chapter.totalPoints == 1) ? "Point" : "Total Points"}
                </div>

                <div id="chapterEvents">
                    <div id="chapterEventsTitle"><b>Events</b></div>
                    <table id="chapterEventsTable">
                        ${ objectToHTML(chapter_data.scores, function(event_name) {
                            var event = chapter_data.scores[event_name];

                            return `<tr class="contentRow">
                                <td>
                                    <div class="chapterEventName"><a href="event.html?e=${encodeURIComponent(event_name)}"><b>${event_name}</b></a></div>
                                    <table class="chapterEvent">
                                        ${ objectToHTML(event, function(item) {
                                            var points = event[item]
                                            return `<tr class='${(points == 0) ? "zeroPointItem" : "pointItem"}'>
                                                <td class="chapterPointName">${capitalize(item)}</td>
                                                <td class="chapterPointValue">
                                                    <b>${points} ${(points == 1) ? "point" : "points"}</b>
                                                </td>
                                            </tr>`

                                        }) }
                                    </table>
                                </td>
                            </tr> `

                        }) }
                    </table>
                </div>

            </div>
        `

        $("#chapterPoints").html(pageBody)

    })

}


//helper functions

function objectToHTML(array, map) {
    return Object.keys(array).map(map).reduce(function(content, newString) {
        if (newString == undefined) {
            return content
        } else {
            return content + newString
        }

    }, "")
}

function getParameterByName(name) {

    url = window.location.href
    name = name.replace(/[\[\]]/g, "\\$&")

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
    var results = regex.exec(url)

    if (!results) return undefined
    if (!results[2]) return undefined
    return results[2].replace(/\+/g, " ")//decodeURIComponent(results[2].replace(/\+/g, " "));
}


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}