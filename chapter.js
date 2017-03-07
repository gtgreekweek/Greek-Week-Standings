
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
                items: []
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
}


//i like this
String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};