function CrateItemChecker(AgentInventory, AgentRecipeInfo) {
    this.AgentInventory = AgentInventory
    this.AgentRecipeInfo = AgentRecipeInfo

    /**
     * TODO:: сейчас не приоритетно. все ингридиенты должны храняиться в инвентаре
     * для начала нужно проверить в инвентаре
     * после в сундуках дома
     * после в бочках мусора
     * в случае если не найдены компоненты то нужно создать задачу на добычу или же на создание нового предмета
     * @param task
     */
    this.check = async (task) => {
        const recipes = await this.findRecipes(task.parts[0].name)
        const itemsRecipes = this.filterItemsRecipes(recipes)

        console.log(itemsRecipes)

        //Нужно идти к станку
        if (recipes.length <= 0) {
            return {success: false, isCompleted: true}
        }

        if (this.checkInventoryItemExist(task)) {
            return {success: false, isCompleted: true}
        }
        return {success: false, isCompleted: true}
        return {success: true}
    }

    this.filterItemsRecipes = function (recipes) {
        return recipes.map((recipe) => {
            return recipe.delta.filter(recipe => recipe.count < 0)
        })
    }

    this.findRecipes = async (name) => {
        const recipes = await this.AgentRecipeInfo.findAllRecipe(name, true)
        // recipes.forEach((recipe) => console.log(recipe.delta))
        return recipes;
    }

    this.checkInventoryItemExist = (task) => {
        return this.AgentInventory.isItemExist(
            task.parts[0].name,
            task.parts[0].count
        );
    }
}

module.exports = {
    CrateItemChecker: CrateItemChecker
}