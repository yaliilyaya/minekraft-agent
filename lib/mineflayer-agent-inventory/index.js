const {ItemCollection} = require("./ItemCollection");

function InventoryItemCollection (inventory, includeThat45Slot) {
  this.inventory = inventory
  this.includeThat45Slot = includeThat45Slot

  this.getItems = () => {
    const items = this.inventory.items()
    if (this.includeThat45Slot) {
      items.push(this.inventory.slots[45])
    }
    return items
  }
  this.findByName = (name) => {
    const items = this.findAllByName(name)
    return items.length > 0 ? items[0] : null
  }

  this.findAllByName = (name) => {
    const names = Array.isArray(name) ? name : [name]
    return this.getItems().filter(item => names.some(name => item.name === name))
  }
  /**
   * Осуществляет поиск самого лучшего инструмента
   * TODO:: Перенести тег инструментов и эффективность в mcData
   * @param names
   * @returns {*}
   */
  this.findToolByNames = (names) => {
    let lastName = names[0]
    if (names.length > 1) {
      lastName = names.filter(name => this.getItems().some(item => item.name === name))[0]
    }

    return this.getItems().filter(item => item.name === lastName)[0]
  }
}

function AgentInventory (bot, AgentToolsInfo, AgentItemInfo)
{
  this.bot = bot
  this.AgentToolsInfo = AgentToolsInfo
  this.AgentItemInfo = AgentItemInfo
  this.inventoryItemCollection = null

  this.init = () => {
    const includeThat45Slot = this.includeThat45Slot()
    this.inventoryItemCollection = new InventoryItemCollection(this.bot.inventory, includeThat45Slot)
  }

  this.equipTool = async (name) => {
    if (!name) {
      console.log(`I have no ${name}`)
      return
    }
    const item = this.findToolsByName(name)
    if (item) {
      await this.equip(item)
    } else {
      console.log(`I have no ${name}`)
    }
  }

  this.equipItem = async (name, destination) => {
    const item = this.inventoryItemCollection.findByName(name)
    if (item) {
      await this.equip(item, destination)
    } else {
      console.log(`I have no ${name}`)
    }
  }

  this.equip = async (item, destination = null) => {
    try {
      if (destination) {
        await this.bot.equip(item, destination)
      } else {
        await this.bot.equip(item)
      }
      console.log(`equipped ${item.name}(${destination})`)
    } catch (err) {
      console.log(`cannot equip ${item.name}(${destination}): ${err.message}`)
    }
  }

  this.findToolsByName = (name) => {
    const names = this.AgentToolsInfo.findToolsByName(name)
    return this.inventoryItemCollection.findToolByNames(names)
  }

  this.findAllItemByName = (name) => {
    const names = this.AgentItemInfo.findNamesByGroup(name)
    // //TODO:: найти все блоки в инвентаре по группе
    return this.inventoryItemCollection.findAllByName(names)
  }

  this.includeThat45Slot = () => {
    return require('minecraft-data')(this.bot.version).isNewerOrEqualTo('1.9') &&
        this.bot.inventory.slots[45]
  }
  this.isItemExist = (name, count) => {
    let items = this.findAllItemByName(name);

    const itemCollection = new ItemCollection(items);
    itemCollection.sumByNames()

    console.log(`в инвентаре ${name}(${count}) - `, itemCollection.sumGroup)
    return itemCollection.isExitCount(count)
  }
}

module.exports = {
  AgentInventory: AgentInventory
}
