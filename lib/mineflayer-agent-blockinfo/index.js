//const fs = require("fs");
const {groupBlockInfo} = require('./groupBlockInfo')

function AgentBlockInfo (bot, mcData) {
  this.bot = bot
  this.mcData = mcData

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
}

module.exports = {
  AgentBlockInfo: AgentBlockInfo,
  // AgentBlockInfoBuilder: (bot, mcData) => {
  //   return new AgentBlockInfo(bot, mcData)
  //   // fs.writeFileSync('./blocks.json', JSON.stringify(mcData.blocks, null, 2) , 'utf-8');
  //   // fs.writeFileSync('./items.json', JSON.stringify(mcData.items, null, 2) , 'utf-8');
  //   // fs.writeFileSync('./recipes.json', JSON.stringify(mcData.recipes, null, 2) , 'utf-8');
  // }
}
