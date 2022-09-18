const Enumerable = require("node-enumerable");

function AgentTask () {
  this.AgentBlockInfo = null;
  this.AgentDig = null;
  this.AgentInventory = null;

  this.runTaskDigBlocks = async (blockName, count = 1) => {
    const blockId = this.AgentBlockInfo.findBlockIdByName(blockName)
    const blockIds = [blockId]
    for (const number of Enumerable.range(0, count)) {
      console.log(`run dig block number ${number}`)

      await this.AgentInventory.equipTool('diamond_shovel');

      await this.AgentDig.digFirstBlockByIds(blockIds, blockName)
    }
  }
}

module.exports = {
  AgentTaskBuilder: (AgentBlockInfo, AgentDig, AgentInventory) => {
    const agentFinder = new AgentTask()
    agentFinder.AgentBlockInfo = AgentBlockInfo
    agentFinder.AgentDig = AgentDig
    agentFinder.AgentInventory = AgentInventory
    return agentFinder
  }
}
