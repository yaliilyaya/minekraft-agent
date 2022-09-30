const { pathfinder, Movements} = require('mineflayer-pathfinder')
const mineflayer = require("../../index");
const {AgentFinderBuilder} = require("../mineflayer-agent-finder");
const {AgentDigBuilder} = require("../mineflayer-agent-dig");
const {AgentTaskBuilder} = require("../mineflayer-agent-task");
const {AgentInventoryBuilder} = require("../mineflayer-agent-inventory");
const {AgentBlockInfoBuilder} = require("../mineflayer-agent-blockinfo");
const {AgentToolsInfoBuilder} = require("../mineflayer-agent-toolsinfo");
const {AgentTaskManagerBuilder} = require("../mineflayer-agent-task-manager");

function Agent () {
  this.bot = null
  this.AgentFinder = null
  this.AgentDig = null
  this.AgentTask = null
  this.AgentInventory = null
  this.AgentBlockInfo = null
  this.AgentToolsInfo = null

  this.config = {
    host: '176.119.159.250', // optional
    port: 25565, // optional
    username: 'agent-007', // E-mail и пароль используются для
    version: '1.16.5' // При установленном значении false версия будет выбрана автоматически, используйте пример выше чтобы выбрать нужную версию
  }

  this.connection = () => {
    this.bot = mineflayer.createBot(this.config);

    this.AgentBlockInfo = AgentBlockInfoBuilder();
    this.AgentToolsInfo = AgentToolsInfoBuilder();
    this.AgentFinder = AgentFinderBuilder(this.bot)
    this.AgentInventory = AgentInventoryBuilder(this.bot, this.AgentToolsInfo);

    this.AgentDig = AgentDigBuilder(this.bot, this.AgentFinder);
    this.AgentTask = AgentTaskBuilder(
        this.bot,
        this.AgentBlockInfo,
        this.AgentDig,
        this.AgentInventory,
        this.AgentFinder,
        this.AgentToolsInfo
    );

    this.AgentTaskManager = AgentTaskManagerBuilder(this.AgentTask);

    this.bot.loadPlugin(pathfinder)

    this.bot.once('spawn', this.onSpawn)
    this.bot.on('chat', this.onChat)

    // Прослушивание ошибок и причин отключения от сервера:
    this.bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
    this.bot.on('error', err => console.log(err))

    return this.bot;
  }

  this.onSpawn = async () => {
    this.mcData = require('minecraft-data')(this.bot.version)
    this.AgentBlockInfo.mcData = this.mcData;

    await this.bot.waitForChunksToLoad()
    this.bot.pathfinder.setMovements(new Movements(this.bot, this.mcData))
    this.AgentTaskManager.load();
    await this.AgentTaskManager.run();

    // await this.AgentTask.runTaskDigBlocks('dirt', 1);
    // await this.AgentTask.runTaskDigBlocks('grass', 1);
  }

  this.onChat = async (username, message) => {
    if (username === this.bot.username) return
    console.log(message);

    if (message.startsWith('dig')) {
      const blockName = message.split(' ')[1]
      const digCount = message.split(' ')[2] !== undefined ? message.split(' ')[2] : 1;
      await this.AgentTask.runTaskDigBlocks(blockName, digCount)
    }
  }
}

module.exports = {
  AgentBuilder: () => {
    return new Agent()
  }
}
