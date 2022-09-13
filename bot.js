const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
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

bot.loadPlugin(pathfinder)

bot.on('chat', function (username, message) {
    if (username === bot.username) return
    bot.chat(message)
})
let mcData = null;
// http://localhost:3007/
bot.once('spawn', () => {
    mcData = require('minecraft-data')(bot.version)
    // mineflayerViewer(bot, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
})


inventoryViewer(bot, {

})

// Прослушивание ошибок и причин отключения от сервера:
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))


let isLoaded = false;

bot.on('chat', async (username, message) => {

    if (username === bot.username) return



    if (message === 'loaded') {
        console.log(bot.entity.position)
        await bot.waitForChunksToLoad()
        bot.chat('Ready!')
    }

    if (message.startsWith('dig')) {
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
        const blocks = bot.findBlocks({ matching: ids, maxDistance: 128, count: 500 })
        const time = (performance.now() - startTime).toFixed(2)

        const botPosition = bot.entity.position;
        bot.chat(`I found ${blocks.length} ${name} blocks in ${time} ms`)
        // blocks.sort((a, b) => {
        //     return a.distanceTo(botPosition) - b.distanceTo(botPosition);
        // })
        for (const block of blocks) {
            await digTarget(block);
        }
    }
})

async function digTarget(block) {
    bot.pathfinder.setMovements(new Movements(bot, mcData))

    await bot.pathfinder.goto(new goals.GoalNear(block.x, block.y + 1, block.z, 2))

    if (bot.targetDigBlock) {
        console.log(`already digging ${bot.targetDigBlock.name}`)
        //bot.chat(`already digging ${bot.targetDigBlock.name}`)
    } else {
        let target = bot.blockAt(block)
        if (target && bot.canDigBlock(target)) {
            console.log(`starting to dig ${target.name}`)
            //bot.chat(`starting to dig ${target.name}`)
            try {
                //TODO:: нужно поворачивать голову к блоку который добывает
                await bot.dig(target)
                console.log(`finished digging ${target.name}`)
                //bot.chat(`finished digging ${target.name}`)
            } catch (err) {
                console.log(err.stack)
            }
        } else {
            console.log(`cannot dig ${block} - ${bot.entity.position}`)
            //bot.chat('cannot dig')
        }
    }
}