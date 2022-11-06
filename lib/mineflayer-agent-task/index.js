const Enumerable = require('node-enumerable')

function AgentTask () {
  this.bot = null
  this.AgentBlockInfo = null
  this.AgentDig = null
  this.AgentInventory = null
  this.AgentFinder = null
  this.AgentToolsInfo = null
  this.AgentCraft = null


  this.run = async (task, data, callback) => {

    // callback({type: 'error'});
    // return

    switch (task.type) {
      case 'crateItem': {
        const isSuccess = await this.craftItem(task.parts[0].name, task.parts[0].count)

        if (isSuccess) {
          callback({type: 'success'});
        } else {
          callback({type: 'error'});
        }
        return
      }
      case 'buildCraftingTable': {
        //TODO:: реализовать установку станка на поверхность(землю, траву, камень)... вообще ещё нужно определить что такое поверхность
        await this.buildCraftingTable()
        return
      }
      case 'digItem': {
        await this.runTaskDigBlocks(task.parts[0].name, task.parts[0].count)
        callback({type: 'success'});
        return
      }
    }
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

  this.runTaskDigBlocks = async (blockName, count = 1) => {
    const blockIds = this.AgentBlockInfo.findBlocksIdByName(blockName)
    console.log(blockIds)
    const startPosition = this.bot.entity.position
    const strategy = this.AgentFinder.findStrategy(blockName)

    if (blockIds.length > 0) {
      //После перевого цикла позиця агента меняется поэтому нам нужно сохранять истинную позицию старта
      for (const number of Enumerable.range(0, count)) {
        console.log(`run dig block number ${number}`)

        const finderResult = this.AgentFinder.findAllIdById(blockIds)
        finderResult.startPosition = startPosition
        strategy.apply(finderResult)
        const blockPosition = finderResult.first();

        console.log(blockPosition)
        const block = blockPosition != null ? this.bot.blockAt(blockPosition) : null
        if (block) {
          console.log(`I found ${block.name} blocks`)
          await this.AgentDig.moveToDigTarget(block.position)

          const tool = this.AgentToolsInfo.findToolByBlock(block.name)
          if (tool) {
            await this.AgentInventory.equipTool(tool)
          }
          // TODO:: нужно подбирать упавший добытый блок или же все блоки в радиусе 2х клеток
          await this.AgentDig.digTarget(block.position)
        }
      }
    }
  }

  this.buildCraftingTable = function () {
    const startPosition = this.bot.entity.position
    this.AgentFinder.findBuildPlaceCraftingTable()
  }
}

module.exports = {
  AgentTaskBuilder: (bot, AgentBlockInfo, AgentDig, AgentInventory, AgentFinder, AgentToolsInfo, AgentCraft) => {
    const agentFinder = new AgentTask()
    agentFinder.bot = bot
    agentFinder.AgentBlockInfo = AgentBlockInfo
    agentFinder.AgentDig = AgentDig
    agentFinder.AgentInventory = AgentInventory
    agentFinder.AgentFinder = AgentFinder
    agentFinder.AgentToolsInfo = AgentToolsInfo
    agentFinder.AgentCraft = AgentCraft
    return agentFinder
  }
}
