const mineflayer = require('mineflayer')
// const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
// const inventoryViewer = require('mineflayer-web-inventory')
// const { performance } = require('perf_hooks')
const { AgentFinderBuilder } = require('./lib/mineflayer-agent-finder')
// const {AgentDig} = require("./lib/mineflayer-agent-dig");
const bot = mineflayer.createBot({
  host: '176.119.159.250', // optional
  port: 25565, // optional
  username: 'agent-007', // E-mail и пароль используются для
  // password: '12345678', // лицензионных серверов
  version: '1.16.5' // При установленном значении false версия будет выбрана автоматически, используйте пример выше чтобы выбрать нужную версию
  // auth: 'mojang' // Необязательное поле. По умолчанию используется mojang, если используется учетная запись microsoft, установите значение «microsoft»
})

const AgentFinder = AgentFinderBuilder(bot)
