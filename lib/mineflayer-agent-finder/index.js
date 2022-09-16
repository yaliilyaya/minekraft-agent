const { Movements, goals } = require('mineflayer-pathfinder')
const Enumerable = require('node-enumerable')

function AgentFinder () {
  this.bot = null

  this.findBlocksIdByIdInRange = function (blockIds, range = [128]) {
    for (const maxDistance of Enumerable.from(range)) {
      console.log(`find block ${blockIds} in range ${maxDistance}`)
      const blocks = this.bot.findBlocks({ matching: blockIds, maxDistance, count: 100 })
      if (blocks.length > 0) {
        return blocks
      }
    }

    return []
  }

  this.findFirstBlock = function (blocks) {
    const botPosition = this.bot.entity.position
    blocks.sort((a, b) => {
      return a.distanceTo(botPosition) - b.distanceTo(botPosition)
    })

    return blocks ? blocks.shift() : undefined
  }
}

/**
 * TODO:: нужно менять инструмент перед добычей
 * TODO:: инструмент нужно выбирать по группе
 * @param block
 * @returns {Promise<void>}
 */

module.exports = {
  AgentFinderBuilder: (bot) => {
    const agentFinder = new AgentFinder()
    agentFinder.bot = bot
    return agentFinder
  }
}
