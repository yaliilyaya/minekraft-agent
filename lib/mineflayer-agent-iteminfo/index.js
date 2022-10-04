function AgentItemInfo () {
  this.mcData = null

  this.init = () => {
    this.mcData.itemsArray.forEach(item => item.group = this.findGroupByName(item.name))
  }
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

  this.findGroupByName = (name) => {

    const group = Object.entries(groupItemInfo)
        .filter(item => item[1].some(itemName => itemName === name))
        .map(item => item[0])[0]

    return !!group ? group : null
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
  ],
  plank: [
    'oak_planks',
    'spruce_planks',
    'birch_planks',
    'jungle_planks',
    'acacia_planks',
    'dark_oak_planks',
    'crimson_planks',
    'warped_planks',
  ]
}

module.exports = {
  AgentItemInfoBuilder: (mcData) => {
    let agentItemInfo = new AgentItemInfo()
    agentItemInfo.mcData = mcData
    agentItemInfo.init()
    return agentItemInfo
  }
}
