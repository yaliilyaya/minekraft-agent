const Enumerable = require('node-enumerable')

function AgentTask () {
  this.bot = null
  this.AgentBlockInfo = null
  this.AgentDig = null
  this.AgentInventory = null
  this.AgentFinder = null
  this.AgentToolsInfo = null

  this.run = async (task, callback) => {
    // callback({type: 'error'});
    switch (task.type) {
      case 'dig': {
        await this.runTaskDigBlocks(task.parts[0].name, task.parts[0].count)
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
    console.log(blockIds)
    const startPosition = this.bot.entity.position
    const strategy = this.AgentFinder.findStrategy(blockName)

    if (blockIds.length > 0) {
      //После перевого цикла позиця агента меняется поэтому нам нужно сохранять истинную позицию старта
      for (const number of Enumerable.range(0, count)) {
        console.log(`run dig block number ${number}`)

        const finderResult = this.AgentFinder.findAllIdById(blockIds)
        finderResult.startPosition = startPosition
        strategy.apply(finderResult)
        const blockPosition = finderResult.first();

        console.log(blockPosition)
        const block = blockPosition != null ? this.bot.blockAt(blockPosition) : null
        if (block) {
          console.log(`I found ${block.name} blocks`)
          await this.AgentDig.moveToDigTarget(block.position)

          const tool = this.AgentToolsInfo.findToolByBlock(block.name)
          if (tool) {
            await this.AgentInventory.equipTool(tool)
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
