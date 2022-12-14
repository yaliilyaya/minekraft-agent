const { pathfinder, Movements } = require('mineflayer-pathfinder')
const mineflayer = require('../../index')
const { AgentFinderBuilder } = require('../mineflayer-agent-finder')
const { AgentDigBuilder } = require('../mineflayer-agent-dig')
const { AgentTaskBuilder } = require('../mineflayer-agent-task')
const { AgentInventoryBuilder } = require('../mineflayer-agent-inventory')
const { AgentBlockInfoBuilder } = require('../mineflayer-agent-blockinfo')
const { AgentToolsInfoBuilder } = require('../mineflayer-agent-toolsinfo')
const { AgentTaskManagerBuilder } = require('../mineflayer-agent-task-manager')
const { AgentTaskCheckerBuilder } = require('../mineflayer-agent-task-checker')
const {AgentItemInfoBuilder} = require("../mineflayer-agent-iteminfo");
const {AgentCraftBuilder} = require("../mineflayer-agent-craft");
const {AgentRecipeInfoBuilder} = require("../mineflayer-agent-recipeinfo");
const {BuildArea} = require("../mineflayer-agent-finder/BuildArea");
const vec3 = require("vec3");

function Agent () {
  this.bot = null
  this.AgentFinder = null
  this.AgentDig = null
  this.AgentTask = null
  this.AgentInventory = null
  this.AgentBlockInfo = null
  this.AgentToolsInfo = null
  this.AgentCraft = null
  this.AgentTaskChecker = null
  this.AgentTaskManager = null

  this.config = {
    host: '176.119.159.250', // optional
    port: 25565, // optional
    username: 'agent-007', // E-mail и пароль используются для
    version: '1.16.5' // При установленном значении false версия будет выбрана автоматически, используйте пример выше чтобы выбрать нужную версию
  }

  this.connection = () => {
    this.bot = mineflayer.createBot(this.config)
    this.mcData = require('minecraft-data')(this.config.version)

    this.AgentBlockInfo = AgentBlockInfoBuilder(this.bot, this.mcData)
    this.AgentItemInfo = AgentItemInfoBuilder(this.mcData)
    this.AgentRecipeInfo = AgentRecipeInfoBuilder(this.bot, this.mcData, this.AgentItemInfo)
    this.AgentToolsInfo = AgentToolsInfoBuilder()
    this.AgentFinder = AgentFinderBuilder(this.bot, this.mcData)
    this.AgentInventory = AgentInventoryBuilder(this.bot, this.AgentToolsInfo, this.AgentItemInfo)

    this.AgentDig = AgentDigBuilder(this.bot, this.AgentFinder)
    this.AgentCraft = AgentCraftBuilder(this.bot, this.AgentRecipeInfo, this.AgentFinder)

    this.AgentTask = AgentTaskBuilder(
      this.bot,
      this.AgentBlockInfo,
      this.AgentDig,
      this.AgentInventory,
      this.AgentFinder,
      this.AgentToolsInfo,
      this.AgentCraft
    )

    this.AgentTaskChecker = AgentTaskCheckerBuilder(this.AgentInventory, this.AgentCraft, this.AgentItemInfo, this.AgentFinder)
    this.AgentTaskManager = AgentTaskManagerBuilder(this.AgentTask, this.AgentTaskChecker)

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
    // this.AgentTaskManager.load();
    // await this.AgentTaskManager.run();

    setTimeout(async () => {
      //TODO:: есть очень странная задержка перед загрузкой чанков

      // await this.AgentTask.craftItem('wooden_axe', 1);
      // await this.AgentTask.craftItem('oak_planks', 1);
      //await this.AgentTask.runTaskDigBlocks('log', 1);
      // await this.AgentTask.runTaskDigBlocks('dirt', 1);
      // await this.AgentTask.runTaskDigBlocks('grass', 1);
      // await this.AgentFinder.findCraftingTable()

      //TODO:: Предположим, что мы ищем место для постройки мнимого здания площадью 20x20 и высотой 7
      const buildArea = new BuildArea()
      buildArea.end = new vec3(1, 1, 1)

      const foundationPlace = await this.AgentFinder.findFoundationPlace(buildArea);

      console.log(foundationPlace.toString())
    }, 2000)
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
  AgentBuilder: () => {
    return new Agent()
  }
}
