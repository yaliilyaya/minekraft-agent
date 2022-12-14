// const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const inventoryViewer = require('mineflayer-web-inventory')
const { AgentBuilder } = require('./lib/mineflayer-agent')

const Agent = AgentBuilder()
Agent.config.host = '193.124.117.187'
Agent.config.username = 'agent-007'

const bot = Agent.connection()

bot.once('spawn', async () => {
  console.log(bot.entity.position)
  // mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
  inventoryViewer(bot, {})
})
