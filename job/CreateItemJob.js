function CreateItemJob(AgentInventory, AgentCraft, AgentFinder, AgentDig)
{
    this.AgentInventory = AgentInventory
    this.AgentCraft = AgentCraft
    this.AgentFinder = AgentFinder
    this.AgentDig = AgentDig

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

    this.run = async (task, callback) => {
        const isSuccess = await this.craftItem(task.parts[0].name, task.parts[0].count)

        if (isSuccess) {
            callback({type: 'success'});
        } else {
            callback({type: 'error'});
        }
        return
    }


    this.craftItem = async (name, amount = 1) => {
        console.log(`Начинаю создание предмета ${name} - ${amount}`)
        const recipeCollection = await this.AgentCraft.findAllRecipe(name)

        const recipes = recipeCollection.recipes.filter( recipe => {
            const recipeItems = recipe.delta.filter(recipeItem => recipeItem.count < 0)
            const issetRecipeItems = recipeItems.filter(recipeItem => {
                return this.AgentInventory.isItemExist(recipeItem.item.name, Math.ceil(amount / recipe.result.count))
            })
            return issetRecipeItems.length === recipeItems.length
        })

        //если в инвентаре есть ингридиенты для нескольких рецептов выбираем первый
        const recipe = recipes.length > 0 ? recipes[0] : 0;
        const craftCount = Math.ceil(amount / recipe.result.count)

        if (!recipe) {
            return false
        }
        if (recipe.requiresTable) {
            console.log('Нужно подойти к верстаку')
            const craftingTable = await this.AgentFinder.findCraftingTable();
            if (!craftingTable) {
                console.log('Не удалось найти верстак')
                return false
            }
            console.log('Иду к верстаку по кординатам', craftingTable.position)
            await this.AgentDig.moveToDigTarget(craftingTable.position)
        }

        const isSuccess = await this.AgentCraft.craft(recipe, craftCount);
        if (isSuccess) {
            console.log(`Успешно создал предмет ${name} - ${amount}`)
        } else {
            console.log(`Проблемы при создании предмета ${name} - ${amount}`)
        }
        return isSuccess
    }


    this.checkInventoryItemExist = (item) => this.AgentInventory.isItemExist(item.name, item.count)

    this.findNeedRecipeItem = (recipeCollection, craftCount) => {

        return recipeCollection.findFirstRecipeItemNames()
            .filter(recipeItem => !this.AgentInventory.isItemExist(recipeItem.name, recipeItem.count * craftCount))
    }
}

module.exports = {
    CreateItemJob: CreateItemJob
}