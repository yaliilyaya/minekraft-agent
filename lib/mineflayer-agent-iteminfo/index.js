function AgentItemInfo () {
  this.mcData = null

  /**
   * TODO:: нужен поиск по группе предметов
   * @param name
   * @returns {*}
   */
  this.findBlockIdByName = (name) => {
    if (!name || this.mcData.item[name] === undefined) {
      console.log(`not found ${name}`)
      return
    }

    return this.mcData.blocksByName[name].id
  }

  this.findNamesByGroup = (name) => {
    return groupItemInfo[name] !== undefined
        ? groupItemInfo[name]
        : [name]
  }

  /**
   * @param name
   * @returns {*}
   */
  this.findAllBlockIdByName = (name) => {
    const names = this.findNamesByGroup(name)

    const ids = names.map(blockName => {
      return this.mcData.itemsByName[blockName] !== undefined
        ? this.mcData.itemsByName[blockName].id
        : null
    })

    return ids.filter((id) => {
      return id !== null
    })
  }
}
const groupItemInfo = {
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
  AgentItemInfoBuilder: (mcData) => {
    let agentItemInfo = new AgentItemInfo()
    agentItemInfo.mcData = mcData
    return agentItemInfo
  }
}
