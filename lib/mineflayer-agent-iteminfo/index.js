const {McDataBuilder} = require("./McDataBuilder");

function AgentItemInfo () {
  this.mcData = null
  this.groupItemInfoArray = null
  this.McDataBuilder = new McDataBuilder();

  this.init = () => {
    this.groupItemInfoArray = Object.entries(groupItemInfo)
    this.mcData.itemsArray.forEach(item => item.group = this.findGroupByName(item.name))
    this.McDataBuilder.create(this.mcData)
  }
  /**
   * TODO:: нужен поиск по группе предметов
   * @param name
   * @returns {*}
   */
  this.findIdByName = (name) => {
    if (!name || this.mcData.itemsByName[name] === undefined) {
      console.log(`not found ${name}`)
      return
    }

    return this.mcData.itemsByName[name].id
  }

  this.findNamesByGroup = (name) => {
    return groupItemInfo[name] !== undefined
        ? groupItemInfo[name]
        : [name]
  }

  this.findGroupByName = (name) => {

    const group = this.groupItemInfoArray
        .filter(item => item[1].some(itemName => itemName === name))
        .map(item => item[0])[0]

    return !!group ? group : null
  }

  /**
   * @param name
   * @returns {*}
   */
  this.findAllByName = (name) => {
    const names = this.findNamesByGroup(name)

    const items = names.map(itemName => {
      return this.mcData.itemsByName[itemName] !== undefined
          ? this.mcData.itemsByName[itemName]
          : null
    })

    return items.filter((item) => {
      return item !== null
    })
  }

  /**
   * @param name
   * @returns {*}
   */
  this.findAllIdsByName = (name) => {
    const names = this.findNamesByGroup(name)

    const ids = names.map(itemName => {
      return this.mcData.itemsByName[itemName] !== undefined
        ? this.mcData.itemsByName[itemName].id
        : null
    })

    return ids.filter((id) => {
      return id !== null
    })
  }

  this.canDigItemByName = (name) => {
    const items = this.findAllByName(name)
    items.sort((a, b) => (a.digLevel !== undefined ? a.digLevel : 0) - (b.digLevel !== undefined ? b.digLevel : 0) )

    const firstItem = items[0]
    const digLevel = firstItem.digLevel !== undefined ? firstItem.digLevel : 0

    return digLevel < 0
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
    'acacia_log',
    'stripped_oak_log',
    'stripped_spruce_log',
    'stripped_birch_log',
    'stripped_jungle_log',
    'stripped_acacia_log',
    'stripped_dark_oak_log'
  ],
  wood: [
    'oak_wood',
    'stripped_oak_wood',
    'spruce_wood',
    'stripped_spruce_wood',
    'birch_wood',
    'stripped_birch_wood',
    'jungle_wood',
    'stripped_jungle_wood',
    'acacia_wood',
    'stripped_acacia_wood',
    'dark_oak_wood',
    'stripped_dark_oak_wood'
  ],
  stem: [
    'crimson_stem',
    'stripped_crimson_stem',
    'warped_stem',
    'stripped_warped_stem',
  ],
  hyphae: [
    'crimson_hyphae',
    'stripped_crimson_hyphae',
    'warped_hyphae',
    'stripped_warped_hyphae',
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
