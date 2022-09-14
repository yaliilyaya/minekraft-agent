const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const inventoryViewer = require('mineflayer-web-inventory')
const {performance} = require("perf_hooks");
const Enumerable = require('node-enumerable');

const bot = mineflayer.createBot({
    host: '176.119.159.250', // optional
    port: 25565, // optional
    username: 'agent-007', // E-mail и пароль используются для
    // password: '12345678', // лицензионных серверов
    version: '1.16.5', // При установленном значении false версия будет выбрана автоматически, используйте пример выше чтобы выбрать нужную версию
    //auth: 'mojang' // Необязательное поле. По умолчанию используется mojang, если используется учетная запись microsoft, установите значение «microsoft»
})

bot.loadPlugin(pathfinder)

let mcData = null;
// http://localhost:3007/
bot.once('spawn', async () => {
    mcData = require('minecraft-data')(bot.version)

    //await runTaskDigBlocks('dig grass_block');
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

    if (message.startsWith('dig')) {
       await runTaskDigBlocks(message);
    }
})

async function runTaskDigBlocks(message)
{
    if (!isLoaded) {
        await bot.waitForChunksToLoad()
        console.log('Ready!')
        isLoaded = true;
    }

    const blockName = message.split(' ')[1]
    const blockId = findBlockIdByName(blockName);
    const blockIds = [blockId];
    for (let number of Enumerable.range(0, 1000)) {
        console.log(`run dig block number ${number}`);

        await digFirstBlockByIds(blockIds, blockName);
    }
}

function findBlockIdByName(name) {
    if (!name || mcData.blocksByName[name] === undefined) {
        console.log(bot.entity.position)
        return
    }

    return mcData.blocksByName[name].id;
}

async function digFirstBlockByIds(blockIds, name = 'empty') {

    const blocks = findBlocksIdByIdInRange(blockIds, [2, 4, 8, 10, 20, 50, 100, 500, 1000])
    const block = findFirstBlock(blocks);
    if (block) {
        console.log(`I found ${blocks.length} ${name} blocks`)
        await digTarget(block);
    }
}

function findBlocksIdByIdInRange(blockIds, range = [128]) {
    for (let maxDistance of Enumerable.from(range)) {
        console.log(`find block ${blockIds} in range ${maxDistance}`);
        let blocks = bot.findBlocks({ matching: blockIds, maxDistance: maxDistance, count: 100 })
        if (blocks.length) {
            return blocks;
        }
    }

    return [];
}

function findFirstBlock(blocks) {
    const botPosition = bot.entity.position;
    blocks.sort((a, b) => {
        return a.distanceTo(botPosition) - b.distanceTo(botPosition);
    })

    return blocks ? blocks.shift() : undefined;
}

async function digTarget(block) {
    bot.pathfinder.setMovements(new Movements(bot, mcData))
    await bot.pathfinder.goto(new goals.GoalNear(block.x, block.y, block.z, 2))

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