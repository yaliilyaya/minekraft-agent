const { pathfinder, Movements } = require('mineflayer-pathfinder')

function Agent (bot, mcData, AgentInventory, AgentTaskManager, AgentTask) {
  this.bot = bot
  this.mcData = mcData
  this.AgentInventory = AgentInventory
  this.AgentTaskManager = AgentTaskManager
  this.AgentTask = AgentTask

  this.AgentFinder = null
  this.AgentDig = null

  this.AgentBlockInfo = null
  this.AgentToolsInfo = null
  this.AgentCraft = null
  this.AgentTaskChecker = null

  this.connection = () => {
    this.bot.loadPlugin(pathfinder)

    this.bot.once('spawn', this.onSpawn)
    this.bot.on('chat', this.onChat)

    // Прослушивание ошибок и причин отключения от сервера:
    this.bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
    this.bot.on('error', err => console.log(err))

    return this.bot
  }

  this.onSpawn = async () => {
    this.AgentInventory.init()
    await this.bot.waitForChunksToLoad()
    this.bot.pathfinder.setMovements(new Movements(this.bot, this.mcData))
    this.AgentTaskManager.load();
    await this.AgentTaskManager.run();
  }

  this.onChat = async (username, message) => {
    if (username === this.bot.username) return
    console.log(message)

    if (message.startsWith('dig')) {
      const blockName = message.split(' ')[1]
      const digCount = message.split(' ')[2] !== undefined ? message.split(' ')[2] : 1
      await this.AgentTask.runTaskDigBlocks(blockName, digCount)
    }
  }
}

module.exports = {
  Agent: Agent
}
