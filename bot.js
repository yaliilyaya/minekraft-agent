const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const inventoryViewer = require('mineflayer-web-inventory')
const {performance} = require("perf_hooks");

const bot = mineflayer.createBot({
    host: '176.119.159.250', // optional
    port: 25565, // optional
    username: 'agent-007', // E-mail и пароль используются для
    // password: '12345678', // лицензионных серверов
    version: '1.16.5', // При установленном значении false версия будет выбрана автоматически, используйте пример выше чтобы выбрать нужную версию
    //auth: 'mojang' // Необязательное поле. По умолчанию используется mojang, если используется учетная запись microsoft, установите значение «microsoft»
})

bot.on('chat', function (username, message) {
    if (username === bot.username) return
    bot.chat(message)
})

// http://localhost:3007/
bot.once('spawn', () => {
    // mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
})


// inventoryViewer(bot, {
//
// })

// Прослушивание ошибок и причин отключения от сервера:
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))


let isLoaded = false;

bot.on('chat', async (username, message) => {

    if (username === bot.username) return

    const mcData = require('minecraft-data')(bot.version)

    if (message === 'loaded') {
        console.log(bot.entity.position)
        await bot.waitForChunksToLoad()
        bot.chat('Ready!')
    }

    if (message.startsWith('find')) {
        if (!isLoaded) {
            await bot.waitForChunksToLoad()
            bot.chat('Ready!')
            isLoaded = true;
        }

        const name = message.split(' ')[1]
        if (mcData.blocksByName[name] === undefined) {
            console.log(bot.entity.position)
            return
        }
        const ids = [mcData.blocksByName[name].id]

        const startTime = performance.now()
        const blocks = bot.findBlocks({ matching: ids, maxDistance: 128, count: 10 })
        const time = (performance.now() - startTime).toFixed(2)

        bot.chat(`I found ${blocks.length} ${name} blocks in ${time} ms`)
        if (blocks.length) {
            let block = blocks[0]
            await digTarget(block)
            console.log(block)
        }
    }
})

async function digTarget(target) {

    if (bot.targetDigBlock) {
        bot.chat(`already digging ${bot.targetDigBlock.name}`)
    } else {
        target = bot.blockAt(block)
        if (target && bot.canDigBlock(target)) {
            bot.chat(`starting to dig ${target.name}`)
            try {
                await bot.dig(target)
                bot.chat(`finished digging ${target.name}`)
            } catch (err) {
                console.log(err.stack)
            }
        } else {
            bot.chat('cannot dig')
        }
    }

    return Promise.resolve(1);
}