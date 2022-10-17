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
        const recipeCollection = await this.AgentCraft.findAllRecipe(task.parts[0].name, true)
        // recipes.applyFilterItemsRecipes()


        let needRecipeItem = this.findNeedRecipeItem(recipeCollection)
        if (needRecipeItem.length === 0) {
            return {success: true}
        }

        console.log(needRecipeItem)

        return {success: false, isCompleted: true}

        if (recipeCollection.isEmpty()) {
            //TODO:: Нужно идти к станку
            return {success: false, isCompleted: true}
        }

        if (this.checkInventoryItemExist(task)) {
            return {success: false, isCompleted: true}
        }

        if (recipeCollection.findHashes().length > 1) {
            console.log('Найден не один рецепт. Проблемы могут быть с созданием')
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

    this.findNeedRecipeItem = (recipeCollection) => {
        return recipeCollection.findFirstRecipeItemNames()
            .filter(item => this.AgentInventory.isItemExist(item.name, item.count))
    }
}

module.exports = {
    CrateItemChecker: CrateItemChecker
}