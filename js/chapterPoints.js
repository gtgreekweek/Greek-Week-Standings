
function abort() {
    window.location = "index.html";
}

function loadPointsForChapter() {

    //parse query parameters
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

    //convert 'AlphaChiOmega' to 'Alpha Chi Omega' and update the page's title
    var chapterNameWithSpaces = chapterName.split(/(?=[A-Z])/).reduce(function(partial, item) { return partial + " " + item }, "")
    $("title").html(`${chapterNameWithSpaces} - Greek Week 2019`)

    //load data for chapter
    loadChapter(chapterName, classification, function(chapter_data) {

        if (chapter_data == undefined) {
            abort()
            return
        }

        var pageBody = `
            <div id='${"events-" + classification}' style="margin: 0 auto;">
                <div class="${classification}Header pageTitle">${chapterName}</div>
                <div id="bigChapterName">${chapterName}</div>
                <div id="bigChapterPoints">
                    <span class='${classification}Header'>
                        <b>${chapterName}</b>
                    </span>
                    <br>
                    ${chapter_data.total_points} ${(chapter_data.total_points == 1) ? "Point" : "Total Points"}
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