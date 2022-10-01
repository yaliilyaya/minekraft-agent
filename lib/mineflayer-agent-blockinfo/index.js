function AgentBlockInfo () {
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

  /**
   * TODO:: нужен поиск по группе предметов
   * @param name
   * @returns {*}
   */
  this.findBlocksIdByName = (name) => {
    const names = groupBlockInfo[name] !== undefined
      ? groupBlockInfo[name]
      : [name]

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
  AgentBlockInfoBuilder: () => {
    return new AgentBlockInfo()
  }
}