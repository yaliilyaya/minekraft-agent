const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const inventoryViewer = require('mineflayer-web-inventory')
const { performance } = require('perf_hooks')
const Enumerable = require('node-enumerable')
const { AgentBuilder } = require('./lib/mineflayer-agent')

const Agent = AgentBuilder();
const bot = Agent.connection();

bot.once('spawn', async () => {
  // mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
  inventoryViewer(bot, {})
})



