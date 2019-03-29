
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
    getChapterArrays(function(fraternities, sororities) {
        
        chapters = (classification == fraternity) ? fraternities : sororities
        
        if (chapters == undefined) {
            abort()
            return
        }
        
        chapter = undefined
        for (var i = 0; i < chapters.length; i++) {
            if (chapters[i].nameNoSpaces() == chapterName) {
                chapter = chapters[i]
                break
            }
        }
        
        if (chapter == undefined) {
            abort()
            return
        }
        
        var pageBody = ` 
            <div id='${"events-" + classification}' style="margin: 0 auto;">
                <div class="${classification}Header pageTitle">${chapter.letters}</div>
                <div id="bigChapterName">${chapter.name}</div>
                <div id="bigChapterPoints">
                    <span class='${classification}Header'>
                        <b>${chapter.placeStringFromArray(chapters)}</b>
                    </span>
                    <br>
                    ${chapter.points} ${(chapter.points == 1) ? "Point" : "Total Points"}
                </div>

                <div id="chapterEvents">
                    <div id="chapterEventsTitle"><b>Events</b></div>
                    <table id="chapterEventsTable">
                        ${ arrayToHTML(chapter.pointCategories, function(category) {

                            return `<tr class="contentRow">
                                <td>
                                    <div class="chapterEventName"><a href="event.html?e=${encodeURIComponent(category.name)}"><b>${category.name}</b></a></div>
                                    <table class="chapterEvent">
                                        ${ arrayToHTML(category.items, function(item) {

                                            return `<tr class='${(item.points == 0) ? "zeroPointItem" : "pointItem"}'>
                                                <td class="chapterPointName">${item.name}</td>
                                                <td class="chapterPointValue">
                                                    <b>${item.points} ${(item.points == 1) ? "point" : "points"}</b>
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

function arrayToHTML(array, map) {
    return array.map(map).reduce(function(content, newString) { 
        
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
