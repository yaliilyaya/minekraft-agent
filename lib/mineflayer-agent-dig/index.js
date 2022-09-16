const { Movements, goals } = require('mineflayer-pathfinder')

function AgentDig () {
  this.bot = null
  this.AgentFinder = null
  this.mcData = null

  this.digFirstBlockByIds = async (blockIds, name = 'empty') => {
    const blocks = this.AgentFinder.findBlocksIdByIdInRange(blockIds, [2, 4, 8, 10, 20, 50, 100, 500, 1000])
    const block = this.AgentFinder.findFirstBlock(blocks)
    if (block !== undefined) {
      console.log(`I found ${blocks.length} ${name} blocks`)
      // TODO:: нельзя копать под собой
      // TODO:: нужно подбирать упавший добытый блок или же все блоки в радиусе 2х клеток
      await this.moveToDigTarget(block)
      await this.digTarget(block)
    }
  }

  this.moveToDigTarget = async (block) => {
    // TODO:: ставит блоки земли если не дотягивается
    // TODO:: может не найти путь до места или упасть
    // TODO:: уничтожает листву если мешает
    this.bot.pathfinder.setMovements(new Movements(this.bot, this.mcData))
    await this.bot.pathfinder.goto(new goals.GoalNear(block.x, block.y, block.z, 2))
  }

  /**
   * TODO:: нужно менять инструмент перед добычей
   * TODO:: инструмент нужно выбирать по группе
   * @param block
   * @returns {Promise<void>}
   */
  this.digTarget = async (block) => {
    if (this.bot.targetDigBlock) {
      console.log(`already digging ${this.bot.targetDigBlock.name}`)
    } else {
      const target = this.bot.blockAt(block)
      if (target && this.bot.canDigBlock(target)) {
        console.log(`starting to dig ${target.name}`)
        try {
          // TODO:: нужно поворачивать голову к блоку который добывает
          await this.bot.dig(target)
          console.log(`finished digging ${target.name}`)
        } catch (err) {
          console.log(err.stack)
        }
      } else {
        console.log(`cannot dig ${block} - ${this.bot.entity.position}`)
        // bot.chat('cannot dig')
      }
    }
  }
}

module.exports = {
  AgentDigBuilder: (bot, AgentFinder) => {
    const agentFinder = new AgentDig()
    agentFinder.bot = bot
    agentFinder.AgentFinder = AgentFinder
    return agentFinder
  }
}
