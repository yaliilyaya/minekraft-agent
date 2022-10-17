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

        if (this.checkInventoryItemExist(task)) {
            console.log(`Необходимое уже есть в инвентаре ${task.parts[0].name} - ${task.parts[0].count}`)
            return {success: false, isCompleted: true}
        }

        const recipeCollection = await this.AgentCraft.findAllRecipe(task.parts[0].name, true)

        if (recipeCollection.isEmpty()) {
            console.log('Нужно идти к станку')
            return {
                success: false,
                task: {
                    name: 'moveToHome'
                }
            }
        }

        if (recipeCollection.findHashes().length > 1) {
            console.log('Найден не один рецепт. Проблемы могут быть с созданием')
        }

        let needRecipeItem = this.findNeedRecipeItem(recipeCollection)
        if (needRecipeItem.length > 0) {
            console.log(`Для создания необходимы ингредиенты ${needRecipeItem.map(item => item.name)}`)
            return {
                success: false,
                taskList: needRecipeItem.map(item => { return {
                    type: 'crateItem',
                    info: item,
                }})
            }
        }

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