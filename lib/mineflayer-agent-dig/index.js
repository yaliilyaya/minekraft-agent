const { goals } = require('mineflayer-pathfinder')

function AgentDig (bot, AgentFinder) {
  this.bot = bot
  this.AgentFinder = AgentFinder

  this.moveToDigTarget = async (block) => {
    // TODO:: ставит блоки земли если не дотягивается
    // TODO:: может не найти путь до места или упасть
    // TODO:: уничтожает листву если мешает
    await this.bot.pathfinder.goto(new goals.GoalNear(block.x, block.y, block.z, 2))
  }

  /**
   * @param blockPosition
   * @returns {Promise<void>}
   */
  this.digTarget = async (blockPosition) => {
    if (this.bot.targetDigBlock) {
      console.log(`already digging ${this.bot.targetDigBlock.name}`)
    } else {
      const block = this.bot.blockAt(blockPosition)
      if (block && this.bot.canDigBlock(block)) {
        console.log(`starting to dig ${block.name}`)
        try {
          await this.bot.dig(block)
          console.log(`finished digging ${block.name}`)
        } catch (err) {
          console.log(err.stack)
        }
      } else {
        console.log(`cannot dig ${blockPosition} - ${this.bot.entity.position}`)
        // bot.chat('cannot dig')
      }
    }
  }
}

module.exports = {
  AgentDig: AgentDig
}
