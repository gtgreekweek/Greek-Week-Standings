// CONSTANTS
var fraternitiesCSV = "https://docs.google.com/spreadsheets/d/1ec27H8thNdeJ8AVgzaJoIhxK-CYiYdNP_J1VIiLar1g/pub?gid=32378140&single=true&output=csv"
var sororitiesCSV = "https://docs.google.com/spreadsheets/d/1ec27H8thNdeJ8AVgzaJoIhxK-CYiYdNP_J1VIiLar1g/pub?gid=360463781&single=true&output=csv"

var fraternity = "frat"
var sorority = "srat"

var loadedChapters = {}


//completion is a ([Chapter]) -> (). Calls with `undefined` is there was an error.
function getChaptersArray(classification, completion) {
    
    if (loadedChapters[classification] != undefined) {
        completion(loadedChapters[classification])
        return
    }
    
    url = (classification == fraternity) ? fraternitiesCSV : sororitiesCSV
    
    Tabletop.init( { key: url,
                     simpleSheet: false,
                     callback: function(data, tabletop) {
                         
                         console.log(data);
                         
                     },
                      } )
    
    return
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
 
    xhr.onreadystatechange = function processRequest(e) {
        if (xhr.readyState == 4 /* 4 = DONE LOADING */ ) {
            
            if (xhr.status != 200 /* 200 = SUCCESS */ ) {
                completion(undefined)
                return
            }
            
            var csvArray = xhr.responseText.split("\r\n").map(function(line) {
                return line.split(",")
            })
            
            var chapters = []
            var chapterCount = csvArray.length - 2 //2 header rows

            for (var i = 0; i < chapterCount; i++) {
                chapters.push(new Chapter(i + 2, csvArray))
            }
            
            loadedChapters[classification] = chapters
            completion(chapters) 
        }
    }
    
}


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
        var categoryName = categoryRow[column]
        if (!categoryName.isEmpty()) {
            
            if (currentCategory != undefined) {
                this.pointCategories.push(currentCategory)
            }
            
            currentCategory = {
                name: categoryName,
                items: [],
                totalPoints: function() {
                    return items.reduce(function(total, item) { return total + item.points })
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
            itemPoints = parseInt(itemPointsString)
        }
        
        currentCategory.items.push({
            name: itemName,
            points: itemPoints
        })
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

        console.log(sortedChapters)
        
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