const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const Enumerable = require("node-enumerable");
const inventoryViewer = require("mineflayer-web-inventory");
const mineflayer = require("../../index");
const {AgentFinderBuilder} = require("../mineflayer-agent-finder");
const {AgentDigBuilder} = require("../mineflayer-agent-dig");
const {AgentTaskBuilder} = require("../mineflayer-agent-task");

function Agent () {
  this.bot = null
  this.AgentFinder = null
  this.AgentDig = null
  this.AgentTask = null
  this.config = {
    host: '176.119.159.250', // optional
    port: 25565, // optional
    username: 'agent-007', // E-mail и пароль используются для
    version: '1.16.5' // При установленном значении false версия будет выбрана автоматически, используйте пример выше чтобы выбрать нужную версию
  }

  this.connection = () => {
    this.bot = mineflayer.createBot(this.config);

    this.AgentFinder = AgentFinderBuilder(this.bot)
    this.AgentDig = AgentDigBuilder(this.bot, this.AgentFinder);
    this.AgentTask = AgentTaskBuilder(this.bot, this.AgentFinder, this.AgentDig);

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
    this.AgentFinder.mcData = this.mcData;
    this.AgentDig.mcData = this.mcData;
    this.AgentTask.mcData = this.mcData;

    await this.AgentTask.runTaskDigBlocks('dig grass_block');
  }

  this.onChat = async (username, message) => {
    if (username === this.bot.username) return

    if (message.startsWith('dig')) {
      await this.AgentTask.runTaskDigBlocks(message)
    }
  }
}

module.exports = {
  AgentBuilder: () => {
    return new Agent()
  }
}
