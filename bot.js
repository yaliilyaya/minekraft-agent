// const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const inventoryViewer = require('mineflayer-web-inventory')
const {ServiceContainer} = require("./lib/ServiceContainer");


const serviceContainer = new ServiceContainer()
serviceContainer.set('config.host', '127.0.0.1') // optional
serviceContainer.set('config.port', '25565')// optional
serviceContainer.set('config.username', 'agent-007') // E-mail и пароль используются для
serviceContainer.set('config.version', '1.16.5') // При установленном значении false версия будет выбрана автоматически,
                                                             // используйте пример выше чтобы выбрать нужную версию

const agent  = serviceContainer.get('Agent')
const bot = agent.connection()

bot.once('spawn', async () => {
  console.log(bot.entity.position)
  // mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
  inventoryViewer(bot, {})
})
