function CrateItemChecker(AgentInventory, AgentCraft, AgentItemInfo) {
    this.AgentInventory = AgentInventory
    this.AgentCraft = AgentCraft
    this.AgentItemInfo = AgentItemInfo

    /**
     * TODO:: сейчас не приоритетно. все ингридиенты должны храняиться в инвентаре
     * для начала нужно проверить в инвентаре
     * после в сундуках дома
     * после в бочках мусора
     * в случае если не найдены компоненты то нужно создать задачу на добычу или же на создание нового предмета
     * @param task
     */
    this.check = async (task) => {
        console.log('Проверка на создания предмета согласно задачи. ' + task.toString())
        const item = task.parts[0]
        if (this.checkInventoryItemExist(item)) {
            console.log(`Необходимое уже есть в инвентаре ${item.name} - ${item.count}`)
            return {success: false, isCompleted: true}
        }

        const recipeCollection = await this.AgentCraft.findAllRecipe(item.name, true)

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
            console.log(recipeCollection.abstractRecipes)
        }

        let needRecipeItem = this.findNeedRecipeItem(recipeCollection, item)
        if (needRecipeItem.length > 0) {
            console.log(`Для создания необходимы ингредиенты: `
                + needRecipeItem.map(recipeItem =>
                `${recipeItem.name}(${recipeItem.count * item.count})`)
            )
            return {
                success: false,
                taskList: needRecipeItem.map(recipeItem => {
                    const canDigItem = this.AgentItemInfo.canDigItem(recipeItem)
                    console.log(`Нужно ли создавать элемент ${recipeItem.name} - ${canDigItem ? 'Y' : 'N'}`)
                    return {
                        type: canDigItem ? 'digItem' : 'crateItem',
                        info: {
                            name: recipeItem.name,
                            count: recipeItem.count * item.count
                        },
                    }
                })
            }
        }

        console.log(
            `Всё готово для создания предмета ${item.name} - `
            + recipeCollection.findFirstRecipeItemNames().map(recipeItem =>
                `${recipeItem.name}(${recipeItem.count * item.count})`
            )
        )

        return {success: true}
    }

    this.checkInventoryItemExist = (item) => {
        return this.AgentInventory.isItemExist(
            item.name,
            item.count
        );
    }

    this.findNeedRecipeItem = (recipeCollection, item) => {

        return recipeCollection.findFirstRecipeItemNames()
            .filter(recipeItem => !this.AgentInventory.isItemExist(recipeItem.name, recipeItem.count * item.count))
    }
}

module.exports = {
    CrateItemChecker: CrateItemChecker
}