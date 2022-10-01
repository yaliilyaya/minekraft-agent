function InventoryItemCollection(items) {
  this.items = items;

  this.findByName = (name) => {
    const items = this.findAllByName(name)
    return items.length > 0 ? items[0] : null
  }

  this.findAllByName = (name) => this.items.filter(item => item.name === name)

  this.findByNames = (names) => {
    let lastName = names[0];
    if (names.length > 1) {
      lastName = names.filter(name => this.items.some(item => item.name === name))[0];
    }

    return this.items.filter(item => item.name === lastName)[0]
  }
}

function AgentInventory () {
  this.bot = null
  this.AgentToolsInfo = null
  this.inventoryItemCollection = null;

  this.init = () => {
    let items = this.bot.inventory.items()
    items = this.includeThat45Slot(items);
    this.inventoryItemCollection = new InventoryItemCollection(items)
  }

  this.equipTool = async (name) => {
    const item = this.findToolsByName(name)
    if (item) {
      try {
        await this.bot.equip(item)
        console.log(`equipped ${item.name}`)
      } catch (err) {
        console.log(`cannot equip ${name}: ${err.message}`)
      }
    } else {
      console.log(`I have no ${name}`)
    }
  }

  this.equipItem = async (name, destination) => {
    const item = this.inventoryItemCollection.findByName(name)
    console.log(item);
    if (item) {
      try {
        await this.bot.equip(item, destination)
        console.log(`equipped ${name}(${destination})`)
      } catch (err) {
        console.log(`cannot equip ${name}(${destination}): ${err.message}`)
      }
    } else {
      console.log(`I have no ${name}`)
    }
  }

  this.findToolsByName = (name) => {
    if (!name) {
      return null
    }
    const names = this.AgentToolsInfo.findToolsByName(name);
    return this.inventoryItemCollection.findByNames(names)
  }

  this.includeThat45Slot = (items) => {
    if (require('minecraft-data')(this.bot.version).isNewerOrEqualTo('1.9')
        && this.bot.inventory.slots[45]
    ) {
      items.push(this.bot.inventory.slots[45])
    }

    return items;
  }
}

module.exports = {
  AgentInventoryBuilder: (bot, AgentToolsInfo) => {
    const agentInventory = new AgentInventory()
    agentInventory.bot = bot;
    agentInventory.AgentToolsInfo = AgentToolsInfo;
    return agentInventory
  }
}
