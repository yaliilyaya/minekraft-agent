const Enumerable = require('node-enumerable')

function AgentFinder () {
  this.bot = null
  this.mcData = null;

  /**
   * TODO:: нужен поис по группе предметов
   * @param name
   * @returns {*}
   */
  this.findBlockIdByName = (name) => {
    if (!name || this.mcData.blocksByName[name] === undefined) {
      console.log(this.bot.entity.position)
      return
    }

    return this.mcData.blocksByName[name].id
  }

  this.findBlocksIdByIdInRange = (blockIds, range = [128]) => {
    for (const maxDistance of Enumerable.from(range)) {
      console.log(`find block ${blockIds} in range ${maxDistance}`)
      const blocks = this.bot.findBlocks({ matching: blockIds, maxDistance, count: 100 })
      if (blocks.length > 0) {
        return blocks
      }
    }

    return []
  }

  this.findFirstBlock = (blocks) => {
    const botPosition = this.bot.entity.position
    blocks.sort((a, b) => {
      return a.distanceTo(botPosition) - b.distanceTo(botPosition)
    })

    return blocks ? blocks.shift() : undefined
  }
}

module.exports = {
  AgentFinderBuilder: (bot) => {
    const agentFinder = new AgentFinder()
    agentFinder.bot = bot
    return agentFinder
  }
}
