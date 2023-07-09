const Enumerable = require("node-enumerable");

function DigJob(bot, AgentInventory, AgentBlockInfo, AgentDig, AgentFinder, AgentToolsInfo) {
    this.bot = bot
    this.AgentInventory = AgentInventory;

    console.log('DigJob', this.AgentInventory.constructor.name)

    this.AgentBlockInfo = AgentBlockInfo
    this.AgentDig = AgentDig
    this.AgentFinder = AgentFinder
    this.AgentToolsInfo = AgentToolsInfo

    /**
     * для начала нужно проверить в инвентаре
     * в случае если не найдены компоненты то можно начать добычу
     * @param task
     */
    this.check = async (task) => {

        const item = task.parts[0]
        if (this.checkInventoryItemExist(item)) {
            return {success: false, isCompleted: true}
        }
        console.log(`в инвентаре не найден ${item.name} нужно начать добычу ${item.count}`)
        return {success: true}
    }

    this.run = async (task, callback) => {
        await this.runTaskDigBlocks(task.parts[0].name, task.parts[0].count)
        callback({type: 'success'});
    }

    this.runTaskDigBlocks = async (blockName, count = 1) => {
        const blockIds = this.AgentBlockInfo.findBlocksIdByName(blockName)
        console.log(blockIds)
        const startPosition = this.bot.entity.position
        const strategy = this.AgentFinder.findStrategy(blockName)

        if (blockIds.length > 0) {
            //После перевого цикла позиця агента меняется поэтому нам нужно сохранять истинную позицию старта
            for (const number of Enumerable.range(0, count)) {
                console.log(`run dig block number ${number}`)

                const finderResult = this.AgentFinder.findAllIdById(blockIds)
                finderResult.startPosition = startPosition
                strategy.apply(finderResult)
                const blockPosition = finderResult.first();

                console.log(blockPosition)
                const block = blockPosition != null ? this.bot.blockAt(blockPosition) : null
                if (block) {
                    console.log(`I found ${block.name} blocks`)
                    await this.AgentDig.moveToDigTarget(block.position)

                    const tool = this.AgentToolsInfo.findToolByBlock(block.name)
                    if (tool) {
                        await this.AgentInventory.equipTool(tool)
                    }
                    // TODO:: нужно подбирать упавший добытый блок или же все блоки в радиусе 2х клеток
                    await this.AgentDig.digTarget(block.position)
                }
            }
        }
    }


    this.checkInventoryItemExist = (item) => this.AgentInventory.isItemExist(item.name, item.count)
}

module.exports = {
    DigJob: DigJob
}