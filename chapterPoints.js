
function showPointsForChapterAtRow(chapterRow, classification) {

    getChaptersArray(classification, function(chapters) {
        
        if (chapters == undefined) {
            return
        }
        
        chapter = undefined
        for (var i = 0; i < chapters.length; i++) {
            if (chapters[i].rowIndex == chapterRow) {
                chapter = chapters[i]
                break
            }
        }
        
        if (chapter == undefined) {
            return
        }
        
        console.log(chapter.name)
        
        $("#standings").css("display", "none")
        $("#chapterPoints").css("display", "")
        
        var pageBody = ` 
            <div id='${"events-" + classification}' style="margin: 0 auto;">
                <div id="bigChapterLetters">${chapter.letters}</div>
                <div id="bigChapterName">${chapter.name}</div>
                <div id="bigChapterPoints">
                    <b>???th Place</b>
                    <br>
                    ${chapter.points} ${(chapter.points == 1) ? "Point" : "Total Points"}
                </div>

                <div id="chapterEvents">
                    <div id="chapterEventsTitle"><b>Events</b></div>
                    <table id="chapterEventsTable">
                        ${ arrayToHTML(chapter.pointCategories, function(category) {

                            return `<tr class="contentRow">
                                <td>
                                    <div class="chapterEventName"><b>${category.name}</b></div>
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


//where the magic happens

function arrayToHTML(array, map) {
    return array.map(map).reduce(function(content, newString) { 
        
        if (newString == undefined) {
            return content
        } else {
            return content + newString
        }

    })
}
