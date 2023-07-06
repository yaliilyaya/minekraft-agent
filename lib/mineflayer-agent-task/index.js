const Enumerable = require('node-enumerable')
const {BuildArea} = require("../mineflayer-agent-finder/BuildArea");
const vec3 = require("vec3");
const {Vec3} = require("vec3");

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
        const isSuccess = await this.buildCraftingTable()
        if (isSuccess) {
          callback({type: 'success'});
        } else {
          callback({type: 'error'});
        }
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

  this.buildCraftingTable = async function () {

    // В общем и в целом, загнался я с этим умным поиском блоков на пол года. Что уже слишком.
    // В примитивном сценарии будем искать просто место впереди персонажа и ставить туды верстак.
    // Если верстак нельзя будет поставить будем ставить в другое рядом расположенное место
    // при этом нужно запоминать либо последнюю позицию в которое хотим поставить верстак или все неудачные позиции.
    //
    // Вообще хотелось бы научиться определять позиции по спирали- но это позже

    const floorPositionBot = this.bot.entity.position.floored().offset(0, -1, 0);


    const buildArea = new BuildArea();
    buildArea.end = new vec3(3, 2, 3)

    //Ищем куда ставить верстак
    const foundationCollection = this.AgentFinder.findFoundationPlace(buildArea)
    console.log(foundationCollection.foundationBlocks.map((foundation) => {
    const pos = foundation.block.position;
      return `{${pos.x};${pos.y};${pos.z}}`

    }));
    //Нашли куда ставить, нужно очистить местность
    // Так как верстак занимает по высоте только один блок то чистим только фундамент от мусора

    const clearBlocks = foundationCollection.foundationBlocks.map((foundation) => {
      let clearPosition = foundation.block.position
      clearPosition.y += 1;
      return  this.bot.blockAt(clearPosition)
    }).filter((block) => block.name !== 'air')

    for (const block of clearBlocks) {
        await this.AgentDig.moveToDigTarget(block.position)

        const tool = this.AgentToolsInfo.findToolByBlock(block.name)
        if (tool) {
          await this.AgentInventory.equipTool(tool)
        }
        // TODO:: нужно подбирать упавший добытый блок или же все блоки в радиусе 2х клеток
        await this.AgentDig.digTarget(block.position)
    }
    // Почистили, теперь нужно поставить в центр блок. Но мы поставим в любое место где нет игрока
    if (foundationCollection) {
      const buildPosition = foundationCollection.foundationBlocks
          .filter((foundation) => foundation.block.position !== floorPositionBot)
          .map((foundation) => foundation.block.position.offset(0, -1, 0))
          .sort((a, b) => floorPositionBot.distanceTo(a) - floorPositionBot.distanceTo(b) )
          .shift()

      console.log(buildPosition)

      //Нашли нужную позиция для строительства - ставим верстак
      const replaceBlock = this.bot.blockAt(buildPosition)

      console.log(`Ставлю на блок ${replaceBlock.name}, ${buildPosition}`)
      const craftingTable = this.AgentInventory.findToolsByName('crafting_table');

      await this.AgentInventory.equip(craftingTable);
      await this.bot.placeBlock(replaceBlock, new Vec3(0, 1, 0))
      return true
    } else {

      console.log('не нашли место')
      return false
    }

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
