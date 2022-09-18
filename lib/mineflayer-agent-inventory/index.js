function AgentInventory () {
  this.bot = null
  this.AgentToolsInfo = null

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
    const item = this.findItemByName(name)
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

  this.findItemByName = (name)  => {
    let items = this.bot.inventory.items()
    items = this.includeThat45Slot(items);

    //this.AgentToolsInfo
    return items.filter(item => item.name === name)[0]
  }

  this.findToolsByName = (name) => {
    if (!name) {
      return null
    }
    const names = this.AgentToolsInfo.findToolsByName(name);

    let items = this.bot.inventory.items()
    items = this.includeThat45Slot(items);

    let lastName = name
    if (names.length > 1) {
      lastName = names.filter(name => items.some(item => item.name === name))[0];
    }

    //this.AgentToolsInfo
    return items.filter(item => item.name === lastName)[0]
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
