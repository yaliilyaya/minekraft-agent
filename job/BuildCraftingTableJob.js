const {BuildArea} = require("../lib/mineflayer-agent-finder/BuildArea");
const vec3 = require("vec3");
const {Vec3} = require("vec3");

//TODO:: реализовать установку станка на поверхность(землю, траву, камень)...
function BuildCraftingTableJob(bot, AgentInventory, AgentDig, AgentFinder, AgentToolsInfo)
{
    this.bot = bot
    this.AgentInventory = AgentInventory;
    this.AgentDig = AgentDig
    this.AgentFinder = AgentFinder
    this.AgentToolsInfo = AgentToolsInfo


    /**
     * для начала нужно проверить в инвентаре
     * после в сундуках дома
     * после в бочках мусора
     * в случае если не найдены компоненты то нужно создать задачу на добычу или же на создание нового предмета
     * @param task
     */
    this.check = async (task) => {

        const item = {name: 'crafting_table', count: 1}
        if (!this.checkInventoryItemExist(item)) {
            console.log(`Не нашли верстак в инвентаре, нужно его создать`)
            return {
                success: false,
                taskList: [
                    {
                        type: 'crateItem',
                        info: {
                            name: item.name,
                            count: item.count
                        },
                    }
                ]
            }
        }

        console.log(`Верстак есть в инвентаре, можно ставить его на землю`)

        return {success: true}
    }

    this.run = async (task, callback) => {
        const isSuccess = await this.buildCraftingTable()
        if (isSuccess) {
            callback({type: 'success'});
        } else {
            callback({type: 'error'});
        }
        return
    }

    this.buildCraftingTable = async function () {

        // В общем и в целом, загнался я с этим умным поиском блоков на пол года. Что уже слишком.
        // В примитивном сценарии будем искать просто место впереди персонажа и ставить туды верстак.
        // Если верстак нельзя будет поставить будем ставить в другое рядом расположенное место
        // при этом нужно запоминать либо последнюю позицию в которое хотим поставить верстак или все неудачные позиции.
        //
        // Вообще хотелось бы научиться определять позиции по спирали- но это позже

        const floorPositionBot = this.bot.entity.position.floored().offset(0, -1, 0);


        const buildArea = new BuildArea();
        buildArea.end = new vec3(3, 2, 3)

        //Ищем куда ставить верстак
        const foundationCollection = this.AgentFinder.findFoundationPlace(buildArea)
        console.log(foundationCollection.foundationBlocks.map((foundation) => {
            const pos = foundation.block.position;
            return `{${pos.x};${pos.y};${pos.z}}`

        }));
        //Нашли куда ставить, нужно очистить местность
        // Так как верстак занимает по высоте только один блок то чистим только фундамент от мусора

        const clearBlocks = foundationCollection.foundationBlocks.map((foundation) => {
            let clearPosition = foundation.block.position
            clearPosition.y += 1;
            return  this.bot.blockAt(clearPosition)
        }).filter((block) => block.name !== 'air')

        for (const block of clearBlocks) {
            await this.AgentDig.moveToDigTarget(block.position)

            const tool = this.AgentToolsInfo.findToolByBlock(block.name)
            if (tool) {
                await this.AgentInventory.equipTool(tool)
            }
            // TODO:: нужно подбирать упавший добытый блок или же все блоки в радиусе 2х клеток
            await this.AgentDig.digTarget(block.position)
        }
        // Почистили, теперь нужно поставить в центр блок. Но мы поставим в любое место где нет игрока
        if (foundationCollection) {
            const buildPosition = foundationCollection.foundationBlocks
                .filter((foundation) => foundation.block.position !== floorPositionBot)
                .map((foundation) => foundation.block.position.offset(0, -1, 0))
                .sort((a, b) => floorPositionBot.distanceTo(a) - floorPositionBot.distanceTo(b) )
                .shift()

            console.log(buildPosition)

            //Нашли нужную позиция для строительства - ставим верстак
            const replaceBlock = this.bot.blockAt(buildPosition)

            console.log(`Ставлю на блок ${replaceBlock.name}, ${buildPosition}`)
            const craftingTable = this.AgentInventory.findToolsByName('crafting_table');

            await this.AgentInventory.equip(craftingTable);
            await this.bot.placeBlock(replaceBlock, new Vec3(0, 1, 0))
            return true
        } else {

            console.log('не нашли место')
            return false
        }

    }

    this.checkInventoryItemExist = (item) => this.AgentInventory.isItemExist(item.name, item.count)
}

module.exports = {
    BuildCraftingTableJob: BuildCraftingTableJob,
}