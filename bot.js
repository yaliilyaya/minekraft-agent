const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const inventoryViewer = require('mineflayer-web-inventory')
const { performance } = require('perf_hooks')
const Enumerable = require('node-enumerable')
const { AgentFinderBuilder } = require('./lib/mineflayer-agent-finder')
const { AgentDigBuilder } = require('./lib/mineflayer-agent-dig')

const bot = mineflayer.createBot({
  host: '176.119.159.250', // optional
  port: 25565, // optional
  username: 'agent-007', // E-mail и пароль используются для
  version: '1.16.5' // При установленном значении false версия будет выбрана автоматически, используйте пример выше чтобы выбрать нужную версию
})

bot.loadPlugin(pathfinder)
const AgentFinder = AgentFinderBuilder(bot)
const AgentDig = AgentDigBuilder(bot, AgentFinder);

let mcData = null
// http://localhost:3007/
bot.once('spawn', async () => {
  mcData = require('minecraft-data')(bot.version)
  AgentFinder.mcData = mcData;
  AgentDig.mcData = mcData;

  await runTaskDigBlocks('dig grass_block');
  // mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
})

inventoryViewer(bot, {})

// Прослушивание ошибок и причин отключения от сервера:
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))

let isLoaded = false

bot.on('chat', async (username, message) => {
  if (username === bot.username) return

  if (message.startsWith('dig')) {
    await runTaskDigBlocks(message)
  }
})

async function runTaskDigBlocks (message) {
  if (!isLoaded) {
    await bot.waitForChunksToLoad()
    console.log('Ready!')
    isLoaded = true
  }

  const blockName = message.split(' ')[1]
  const blockId = AgentFinder.findBlockIdByName(blockName)
  const blockIds = [blockId]
  for (const number of Enumerable.range(0, 1)) {
    console.log(`run dig block number ${number}`)

    await AgentDig.digFirstBlockByIds(blockIds, blockName)
  }
}


