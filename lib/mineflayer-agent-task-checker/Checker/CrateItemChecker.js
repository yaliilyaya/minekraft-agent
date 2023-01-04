function CrateItemChecker(AgentInventory, AgentCraft, AgentFinder) {
    this.AgentInventory = AgentInventory
    this.AgentCraft = AgentCraft
    this.AgentFinder = AgentFinder

    /**
     * Все ингридиенты должны храняиться в инвентаре
     * @param task
     */
    this.check = async (task) => {
        console.log('Проверка на создания предмета согласно задачи. ' + task.toString())
        const item = task.parts[0]
        if (this.checkInventoryItemExist(item)) {
            console.log(`Необходимое уже есть в инвентаре ${item.name} - ${item.count}`)
            return {success: false, isCompleted: true}
        }

        const recipeCollection = await this.AgentCraft.findAllRecipe(item.name)

        if (recipeCollection.isEmpty()) {
            console.log('Рецепт не найден. Пробуем добыть элемент')
            return {
                success: false,
                taskList: [
                    {
                        type: 'digItem',
                        info: {
                            name: item.name,
                            count: item.count
                        },
                    }
                ]
            }
        }

        //Если рецепт требует верстак, то нужно проверить устанавливали ли мы его ранее
        if (recipeCollection.first().requiresTable) {
            //Нужно проверить, что в близи есть установленный верстак
            const craftingTable = this.AgentFinder.findCraftingTable()
            if (!craftingTable) {
                return {
                    success: false,
                    taskList: [{type: 'buildCraftingTable'}]
                }
            }
        }

        const craftCount = Math.ceil(item.count / recipeCollection.first().result.count)

        if (recipeCollection.findHashes().length > 1) {
            console.log('Найден не один рецепт. Проблемы могут быть с созданием')
            console.log(recipeCollection.abstractRecipes.map(i => i.list))
        }

        let needRecipeItem = this.findNeedRecipeItem(recipeCollection, craftCount)
        if (needRecipeItem.length > 0) {
            console.log(`Для создания необходимы ингредиенты: `
                + needRecipeItem.map(recipeItem =>
                `${recipeItem.name}(${recipeItem.count * craftCount})`)
            )

            return {
                success: false,
                taskList: needRecipeItem.map(recipeItem => {
                    return {
                        type: 'takeItem',
                        info: {
                            name: recipeItem.name,
                            count: recipeItem.count * craftCount
                        },
                    }
                })
            }
        }

        console.log(
            `Всё готово для создания предмета ${item.name} - `
            + recipeCollection.findFirstRecipeItemNames().map(recipeItem =>
                `${recipeItem.name}(${recipeItem.count * craftCount})`
            )
        )

        return {success: true}
    }

    this.checkInventoryItemExist = (item) => this.AgentInventory.isItemExist(item.name, item.count)

    this.findNeedRecipeItem = (recipeCollection, craftCount) => {

        return recipeCollection.findFirstRecipeItemNames()
            .filter(recipeItem => !this.AgentInventory.isItemExist(recipeItem.name, recipeItem.count * craftCount))
    }
}

module.exports = {
    CrateItemChecker: CrateItemChecker
}