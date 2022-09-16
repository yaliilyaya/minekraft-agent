const { Movements, goals } = require('mineflayer-pathfinder')
const Enumerable = require("node-enumerable");

function AgentTask () {
  this.bot = null
  this.AgentFinder = null
  this.AgentDig = null
  this.mcData = null
  this.isLoaded = false;

  this.runTaskDigBlocks = async (message) => {
    if (!this.isLoaded) {
      await this.bot.waitForChunksToLoad()
      console.log('Ready!')
      this.isLoaded = true
    }

    const blockName = message.split(' ')[1]
    const blockId = this.AgentFinder.findBlockIdByName(blockName)
    const blockIds = [blockId]
    for (const number of Enumerable.range(0, 1)) {
      console.log(`run dig block number ${number}`)

      await this.AgentDig.digFirstBlockByIds(blockIds, blockName)
    }
  }
}

/**
 * TODO:: нужно менять инструмент перед добычей
 * TODO:: инструмент нужно выбирать по группе
 * @param block
 * @returns {Promise<void>}
 */

module.exports = {
  AgentTaskBuilder: (bot, AgentFinder, AgentDig) => {
    const agentFinder = new AgentTask()
    agentFinder.bot = bot
    agentFinder.AgentFinder = AgentFinder
    agentFinder.AgentDig = AgentDig
    return agentFinder
  }
}
