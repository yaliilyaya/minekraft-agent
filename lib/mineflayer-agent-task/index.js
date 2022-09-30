const Enumerable = require("node-enumerable");

function AgentTask () {
  this.bot = null;
  this.AgentBlockInfo = null;
  this.AgentDig = null;
  this.AgentInventory = null;
  this.AgentFinder = null;
  this.AgentToolsInfo = null;

  this.run = async (task, callback) => {
    // callback({type: 'error'});
    switch (task.type) {
      case 'dig': {
        // task.parts.forEach((part) => {
        //   console.log(part.name);
        // })
        // this.runTaskDigBlocks
      }
    }
    // setTimeout(() => {
    //   callback({type: 'success'});
    // }, 10000)
  }

  this.runTaskDigBlocks = async (blockName, count = 1) => {
    const blockIds = this.AgentBlockInfo.findBlocksIdByName(blockName)
    const startPosition = this.bot.entity.position
    console.log(blockIds);
    if (blockIds.length > 0) {
      for (const number of Enumerable.range(0, count)) {
        console.log(`run dig block number ${number}`)

        // TODO:: исключать блоки из поиска если они контактируют с водой, и лавой. проблемы возникнут с песком, и др сыпусими материалами
        const blockPositions = this.AgentFinder.findBlocksIdByIdInRange(blockIds, [8, 10, 20, 50, 100, 500, 1000], startPosition)

        const blockPosition = this.AgentFinder.findFirstBlock(blockPositions, startPosition)
        // console.log(`startPosition ${startPosition}`);
        // console.log(`block ${block}`);
        // return;
        const block = blockPosition !== undefined ? this.bot.blockAt(blockPosition) : null;
        if (block) {
          console.log(`I found ${blockPositions.length} ${block.name} blocks`)
          await this.AgentDig.moveToDigTarget(block.position);

          const tool = this.AgentToolsInfo.findToolByBlock(block.name);
          if (tool) {
            await this.AgentInventory.equipTool(tool);
          }
          // TODO:: нужно подбирать упавший добытый блок или же все блоки в радиусе 2х клеток
          await this.AgentDig.digTarget(block.position)
        }
      }
    }
  }
}

module.exports = {
  AgentTaskBuilder: (bot, AgentBlockInfo, AgentDig, AgentInventory, AgentFinder, AgentToolsInfo) => {
    const agentFinder = new AgentTask()
    agentFinder.bot = bot
    agentFinder.AgentBlockInfo = AgentBlockInfo
    agentFinder.AgentDig = AgentDig
    agentFinder.AgentInventory = AgentInventory
    agentFinder.AgentFinder = AgentFinder
    agentFinder.AgentToolsInfo = AgentToolsInfo
    return agentFinder
  }
}
