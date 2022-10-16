function CrateItemChecker(AgentInventory, AgentRecipeInfo, AgentCraft) {
    this.AgentInventory = AgentInventory
    this.AgentRecipeInfo = AgentRecipeInfo
    this.AgentCraft = AgentCraft

    /**
     * TODO:: сейчас не приоритетно. все ингридиенты должны храняиться в инвентаре
     * для начала нужно проверить в инвентаре
     * после в сундуках дома
     * после в бочках мусора
     * в случае если не найдены компоненты то нужно создать задачу на добычу или же на создание нового предмета
     * @param task
     */
    this.check = async (task) => {
        console.log(task.parts[0].name)
        const recipes = await this.AgentCraft.findAllRecipe(task.parts[0].name, true)
        // recipes.applyFilterItemsRecipes()

        // console.log(recipes.recipeItems)
        return {success: false, isCompleted: true}
        //Нужно идти к станку
        if (recipes.isEmpty()) {
            return {success: false, isCompleted: true}
        }

        if (this.checkInventoryItemExist(task)) {
            return {success: false, isCompleted: true}
        }
        return {success: false, isCompleted: true}
        return {success: true}
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