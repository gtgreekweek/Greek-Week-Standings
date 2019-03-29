// CONSTANTS
var dataDocument = "https://docs.google.com/spreadsheets/d/1FQDZEDpVKWtm4xwp5TP0UdCemP0YREkosvfNCKpOMlQ/pub?gid=32378140&single=true&output=csv"

var fraternity = "frat"
var sorority = "srat"

//uses Tabletop to load chapters from Google Sheets
function getChapterArrays(completion) {
    Tabletop.init(
        {
            key: dataDocument,
            simpleSheet: false,
            callback: function(data, tabletop) {

                fratData = decomposeTabletopIntoChapterArray(data, fraternity)
                sratData = decomposeTabletopIntoChapterArray(data, sorority)
                completion(fratData, sratData)
            },
        }
    );
}

function decomposeTabletopIntoChapterArray(data, classification) {

    var arrays = data[classification == fraternity ? "Fraternity" : "Sorority"].elements.map(function(object) {

        var array = [];
        var count = Object.keys(object).length;

        for (var i = 0; i < count; i++) {
            array.push(object[i]);
        }

        return array;
    });

    return parseArraysIntoChapters(arrays);
}

function parseArraysIntoChapters(array) {

    var chapters = [];
    var chapterCount = array.length - 2; //2 header rows

    for (var i = 0; i < chapterCount; i++) {
        chapters.push(new Chapter(i + 2, array));
    }

    return chapters;
}




// Chapter Object
function Chapter(index, csv) {

    this.rowIndex = index
    this.pointCategories = []

    chapterRow = csv[index]

    this.points = parseFloat(chapterRow[0])
    if (this.points == undefined) {
        this.points = 0
    }

    this.name = chapterRow[1]
    this.letters = chapterRow[2]

    //load all point categories
    categoryRow = csv[0]
    itemRow = csv[1]
    var currentCategory = undefined

    for (var column = 3; column < chapterRow.length; column++) {

        //if there is a new category, save the old one and start a new one
        var currentCategoryName = undefined
        if (currentCategory != undefined) {
            currentCategoryName = currentCategory.name
        }

        var categoryName = categoryRow[column]
        if (categoryName != currentCategoryName) {

            if (currentCategory != undefined) {
                this.pointCategories.push(currentCategory)
            }

            currentCategory = {
                name: categoryName,
                items: [],
                totalPoints: function() {
                    return this.items.map(e => e.points).reduce((acc, elem) => acc += elem);
                }
            }
        }

        if (currentCategory == undefined) {
            continue
        }

        //parse out the item in the current column
        itemName = itemRow[column]
        itemPointsString = chapterRow[column]
        itemPoints = 0

        if (!itemPointsString.isEmpty()) {
            itemPoints = parseFloat(itemPointsString)
        }

        currentCategory.items.push({
            name: itemName,
            points: itemPoints
        })
    }

    //when done, push the last category
    if (currentCategory != undefined) {
        this.pointCategories.push(currentCategory)
    }


    //helper functions

    this.nameNoSpaces = function() {
        var name = this.name

        while(name.includes(" ")) {
            name = name.replace(" ", "")
        }

        return name
    }

    this.placeStringFromArray = function(chaptersArray) {
        var sortedChapters = chaptersArray.sort(function(left, right) {
            return right.points - left.points
        })

        console.log(sortedChapters);

        var placeNumber = sortedChapters.indexOf(this) + 1
        var placeWithSuffix = ordinal_suffix_of(placeNumber)

        return `${placeWithSuffix} Place`
    }
}


//helper functions

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
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
