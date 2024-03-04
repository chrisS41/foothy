const { score } = require("express")

class HealthScore {

    fatCaloriesPerGram = null
    satFatCaloriesPerGram = null
    carbCaloriesPerGram = null
    sugarCaloriesPerGram = null
    proteinCaloriesPerGram = null
    
    fatIdealPercentage = null
    satFatIdealPercentage = null
    carbIdealPercentage = null
    sugarIdealPercentage = null
    proteinIdealPercentage = null

    sodiumIdealMGramPerDay = null
    fiberIdealGramPerDay = null

    caloriesPerDay = null

    constructor() {
        this.fatCaloriesPerGram = 9
        this.satFatCaloriesPerGram = 9
        this.carbCaloriesPerGram = 4
        this.sugarCaloriesPerGram = 9
        this.proteinCaloriesPerGram = 4
        
        this.fatIdealPercentage = [0.15,0.30] 
        this.satFatIdealPercentage = [0.0,0.10]
        this.carbIdealPercentage = [0.55,0.75]
        this.sugarIdealPercentage = [0.0,0.10]
        this.proteinIdealPercentage = [0.10,0.15]

        this.sodiumIdealMGramPerDay = 2000 //Miligram
        this.fiberIdealGramPerDay = 8.3 //Gram

        this.caloriesPerDay = 2000
    }

    getCalories(nutrition) {        
        return parseFloat(nutrition[0][['amount']]);
    }

    getFat(nutrition) {
        return parseFloat(nutrition[2]['amount']);
    }

    getFatRange(calories) {
        return [calories/this.fatCaloriesPerGram*this.fatIdealPercentage[0], calories/this.fatCaloriesPerGram*this.fatIdealPercentage[1]]
    }

    getCarbs(nutrition) {
        return parseFloat(nutrition[3]['amount']);
    }

    getCarbsRange(calories) {
        return [calories/this.carbCaloriesPerGram*this.carbIdealPercentage[0], calories/this.carbCaloriesPerGram*this.carbIdealPercentage[1]]
    }
    
    getProtein(nutrition) {
        return parseFloat(nutrition[1]['amount']);
    }

    getProteinRange(calories) {
        return [calories/this.proteinCaloriesPerGram*this.proteinIdealPercentage[0], calories/this.proteinCaloriesPerGram*this.proteinIdealPercentage[1]]
    }

    getSFat(nutrition) {
        return parseFloat(nutrition[4]['amount']);
    }

    getFiber(nutrition) {
        return parseFloat(nutrition[5]['amount']);
    }

    getSFatRange(calories) {
        return [calories/this.satFatCaloriesPerGram*this.satFatIdealPercentage[0], calories/this.satFatCaloriesPerGram*this.satFatIdealPercentage[1]]
    }

    getSodium(nutrition) {
        return parseFloat(nutrition[6]['amount']);
    }
    getSugar(nutrition) {
        return parseFloat(nutrition[7]['amount']);
    }
    getSugarRange(calories) {
        return [calories/this.sugarCaloriesPerGram*this.sugarIdealPercentage[0], calories/this.sugarCaloriesPerGram*this.sugarIdealPercentage[1]]
    }

    isIdeal(value, range) {
        return value >= range[0] && value <= range[1]
    }

    getSodiumRange(calories) {
        return [0, calories/this.caloriesPerDay*this.sodiumIdealMGramPerDay]
    }

    getFiberRange(calories) {
        return [calories/this.caloriesPerDay*this.fiberIdealGramPerDay, 9999]
    }

    calculateScore(nutrition) {
        // console.log(nutrition)
        var score = 0;
        var calories = this.getCalories(nutrition)
        var fat = this.getFat(nutrition)
        var carb = this.getCarbs(nutrition)
        var protein = this.getProtein(nutrition)
        var sFat = this.getSFat(nutrition)
        var sugar = this.getSugar(nutrition)
        var sodium = this.getSodium(nutrition)
        var fiber = this.getFiber(nutrition)

        if(this.isIdeal(fat, this.getFatRange(calories))) score++
        if(this.isIdeal(sFat, this.getSFatRange(calories))) score++
        if(this.isIdeal(carb, this.getCarbsRange(calories))) score++
        if(this.isIdeal(protein, this.getProteinRange(calories))) score++
        if(this.isIdeal(sugar, this.getSugarRange(calories))) score++
        if(this.isIdeal(sodium, this.getSodiumRange(calories))) score++
        if(this.isIdeal(fiber, this.getFiberRange(calories))) score++

        // this.printInfo(calories)
        return this.calculateFoothyScore(score);
    }

    printInfo(calories) {
        console.log('Calories:', calories)
        console.log('Fat:', fat, '   Range:', this.getFatRange(calories))
        console.log('sFat:', sFat, '   Range:', this.getSFatRange(calories))
        console.log('carb:', carb, '   Range:', this.getCarbsRange(calories))
        console.log('protein:', protein, '   Range:', this.getProteinRange(calories))
        console.log('sugar:', sugar, '   Range:', this.getSugarRange(calories))
        console.log('sodium:', sodium, '   Range:',this.getSodiumRange(calories))
        console.log('fiber:', fiber, '   Range:', this.getFiberRange(calories))
        console.log('Score:', score);
        console.log()
    }
    
    calculateFoothyScore(score) {
            if(score >= 0 && score <= 2) return 1
            else if(score >= 3 && score <= 5) return 2
            else return 3

    }

}

module.exports = HealthScore