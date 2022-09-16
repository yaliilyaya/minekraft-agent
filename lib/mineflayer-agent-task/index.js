const Enumerable = require("node-enumerable");

function AgentTask () {
  this.AgentFinder = null
  this.AgentDig = null

  this.runTaskDigBlocks = async (blockName, count = 1) => {
    const blockId = this.AgentFinder.findBlockIdByName(blockName)
    const blockIds = [blockId]
    for (const number of Enumerable.range(0, count)) {
      console.log(`run dig block number ${number}`)

      await this.AgentDig.digFirstBlockByIds(blockIds, blockName)
    }
  }
}

module.exports = {
  AgentTaskBuilder: (AgentFinder, AgentDig) => {
    const agentFinder = new AgentTask()
    agentFinder.AgentFinder = AgentFinder
    agentFinder.AgentDig = AgentDig
    return agentFinder
  }
}
