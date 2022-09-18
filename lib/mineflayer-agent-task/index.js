const Enumerable = require("node-enumerable");

function AgentTask () {
  this.AgentBlockInfo = null;
  this.AgentDig = null;
  this.AgentInventory = null;
  this.AgentFinder = null;

  this.runTaskDigBlocks = async (blockName, count = 1) => {
    const blockIds = this.AgentBlockInfo.findBlocksIdByName(blockName)
    console.log(blockIds);
    if (blockIds.length > 0) {
      for (const number of Enumerable.range(0, count)) {
        console.log(`run dig block number ${number}`)

        // TODO:: исключать блоки из поиска если они контактируют с водой, и лавой. проблемы возникнут с песком, и др сыпусими материалами
        const blocks = this.AgentFinder.findBlocksIdByIdInRange(blockIds, [2, 4, 8, 10, 20, 50, 100, 500, 1000])

        const block = this.AgentFinder.findFirstBlock(blocks)
        if (block !== undefined) {
          console.log(`I found ${blocks.length} ${blockName} blocks`)
          await this.AgentDig.moveToDigTarget(block)
          await this.AgentInventory.equipTool('diamond_shovel');
          // TODO:: нужно подбирать упавший добытый блок или же все блоки в радиусе 2х клеток
          await this.AgentDig.digTarget(block)
        }
      }
    }
  }
}

module.exports = {
  AgentTaskBuilder: (AgentBlockInfo, AgentDig, AgentInventory, AgentFinder) => {
    const agentFinder = new AgentTask()
    agentFinder.AgentBlockInfo = AgentBlockInfo
    agentFinder.AgentDig = AgentDig
    agentFinder.AgentInventory = AgentInventory
    agentFinder.AgentFinder = AgentFinder
    return agentFinder
  }
}
