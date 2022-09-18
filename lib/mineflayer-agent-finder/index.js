const Enumerable = require('node-enumerable')

function AgentFinder () {
  this.bot = null
  this.mcData = null;

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

  this.findFirstBlock = (blocks, startPosition) => {
    const botPosition = this.bot.entity.position

    // TODO:: нельзя копать под собой
    // TODO:: создать фильтр исключающие все блоки под собой
    // TODO:: добывать блоки близкие от центра команды, ибо роет в разные направления

    blocks.sort((a, b) => {
      return a.distanceTo(startPosition) - b.distanceTo(startPosition)
    })

    // blocks = blocks.slice(0, 20);
    //
    // blocks.sort((a, b) => {
    //   return a.distanceTo(botPosition) - b.distanceTo(botPosition)
    // })

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
