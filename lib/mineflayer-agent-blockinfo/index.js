//const fs = require("fs");

function AgentBlockInfo () {
  this.bot = null
  this.mcData = null

  /**
   * TODO:: нужен поиск по группе предметов
   * @param name
   * @returns {*}
   */
  this.findBlockIdByName = (name) => {
    if (!name || this.mcData.blocksByName[name] === undefined) {
      console.log(`not found ${name}`)
      return
    }

    return this.mcData.blocksByName[name].id
  }

  this.findNamesByGroup = (name) => {
    return groupBlockInfo[name] !== undefined
        ? groupBlockInfo[name]
        : [name]
  }

  /**
   * TODO:: нужен поиск по группе предметов
   * @param name
   * @returns {*}
   */
  this.findBlocksIdByName = (name) => {
    const names = this.findNamesByGroup(name)

    const ids = names.map((blockName) => {
      return this.mcData.blocksByName[blockName] !== undefined
        ? this.mcData.blocksByName[blockName].id
        : null
    })

    return ids.filter((id) => {
      return id !== null
    })
  }

  /**
   * Ищем верстак
   * @returns {*|Block}
   */
  this.findCraftingTable = () => {
    return this.bot.findBlock({
      matching: this.mcData.blocksByName.crafting_table.id
    })
  }

  this.findRecipe = (craftingTable, name) => {
    const item = this.mcData.itemsByName[name]
    return item
        ? this.bot.recipesAll(item.id, 1, craftingTable)[0]
        : null;
  }
}
const groupBlockInfo = {
  dirt: [
    'dirt',
    'grass_block'
  ],
  log: [
    'oak_log',
    'dark_oak_log',
    'birch_log',
    'spruce_log',
    'jungle_log',
    'acacia_log'
  ]
}

module.exports = {
  AgentBlockInfoBuilder: (bot, mcData) => {
    const agentBlockInfo = new AgentBlockInfo()
    agentBlockInfo.bot = bot;
    agentBlockInfo.mcData = mcData;
    // fs.writeFileSync('./blocks.json', JSON.stringify(mcData.blocks, null, 2) , 'utf-8');
    // fs.writeFileSync('./items.json', JSON.stringify(mcData.items, null, 2) , 'utf-8');
    // fs.writeFileSync('./recipes.json', JSON.stringify(mcData.recipes, null, 2) , 'utf-8');
    return agentBlockInfo
  }
}
