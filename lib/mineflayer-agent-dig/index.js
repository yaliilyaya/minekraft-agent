const { Movements, goals } = require('mineflayer-pathfinder')

function AgentDig () {
  this.bot = null
  this.AgentFinder = null

  this.moveToDigTarget = async (block) => {
    // TODO:: ставит блоки земли если не дотягивается
    // TODO:: может не найти путь до места или упасть
    // TODO:: уничтожает листву если мешает
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
