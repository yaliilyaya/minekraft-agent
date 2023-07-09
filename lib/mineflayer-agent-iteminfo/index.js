const {McDataBuilder} = require("./McDataBuilder");
const {groupItemInfo} = require("./groupItemInfo");

function AgentItemInfo (mcData) {
  this.mcData = mcData
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

module.exports = {
  AgentItemInfo: AgentItemInfo,
  AgentItemInfoBuilder: (mcData) => {
    let agentItemInfo = new AgentItemInfo(mcData)
    agentItemInfo.init()
    return agentItemInfo
  }
}
