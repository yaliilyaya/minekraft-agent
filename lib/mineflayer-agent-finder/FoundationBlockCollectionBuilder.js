const {FoundationBlockCollection} = require("./FoundationBlockCollection");
const Enumerable = require("node-enumerable");
const vec3 = require("vec3");
const {FoundationBlock} = require("./FoundationBlock");
const {Vec3} = require("vec3");

function FoundationBlockCollectionBuilder(Movements, world, mcData, bot) {
    this.Movements = Movements
    this.world = world
    this.mcData = mcData
    this.bot = bot

    /**
     *
     * @param {import('./BuildArea').BuildArea} searchArea
     */
    this.create = (searchArea) => {
        let collection = new FoundationBlockCollection()
        const height = searchArea.begin.y

        this.iterableArea(searchArea, (position) => {

            const firstBlock = this.getBlockByPosition(position)
            const foundationBlock = this.findFoundationBlock(firstBlock, height)
            // console.log(firstBlock.name, firstBlock.position, foundationBlock.block.name, foundationBlock.block.position)
            collection.push(foundationBlock)
            return true
        })

        return collection
    }

    this.iterableArea = function (searchArea, mapCallback) {
        const xList = Enumerable.range(0, searchArea.end.x - searchArea.begin.x)

        for (let xPosition of xList) {
            const zList = Enumerable.range(0, searchArea.end.z - searchArea.begin.z)
            for (let zPosition of zList) {
                const isNext = mapCallback(new vec3(
                    xPosition + searchArea.begin.x,
                    searchArea.begin.y,
                    zPosition + searchArea.begin.z))

                if (!isNext) {
                    return
                }
            }
        }
    }

    this.findFoundationBlock = function (firstBlock, height) {

        let foundationBlock = new FoundationBlock();
        this.bot.waitForChunksToLoad()

        let foundation = firstBlock.info.foundation
            ? this.findFoundationInColumnUp(firstBlock)
            : this.findFoundationInColumnDown(firstBlock)
        // нужно проверить высоту строительства здания height

        foundationBlock.block = foundation;
        foundationBlock.blockid = foundation.type
        foundationBlock.isBad = !this.checkFoundation(foundation, foundation, height)

        return foundationBlock
    }
    /**
     * возвращаем блок с основанием, а не своздухом
     * @param block
     * @returns {*|null}
     */
    this.findFoundationInColumnUp = function (block) {
        // console.log('findFoundationInColumnUp', block.name, block.position)

        const direction = 1
        let prevBlock = block
        let nextBlock = block


        while (nextBlock && nextBlock.info.foundation) {
            const position = nextBlock.position.clone()
            position.y += direction
            prevBlock = nextBlock
            // запрещаем
            if (position.y > 255) {
                console.log('findFoundationInColumnUp error')
                return null
            }
            nextBlock = this.getBlockByPosition(position)

        }

        // console.log(prevBlock.name, prevBlock.info.foundation, prevBlock.position)
        // console.log(nextBlock.name, nextBlock.info.foundation, nextBlock.position)
        return prevBlock
    }
    /**
     * возвращаем блок с основанием, а не своздухом
     * @param block
     * @returns {null|*}
     */
    this.findFoundationInColumnDown = function (block) {
        // console.log('findFoundationInColumnDown', block.name, block.position)

        const direction = -1

        let prevBlock = block
        let nextBlock = block

        while (nextBlock && nextBlock.info.foundation === false) {
            const position = nextBlock.position.clone()
            position.y += direction
            prevBlock = nextBlock

            // запрещаем
            if (position.y < 0) {
                console.log('findFoundationInColumnDown error')
                return null
            }
            nextBlock = this.getBlockByPosition(position)
        }

        // console.log(prevBlock.name, prevBlock.info.foundation, prevBlock.position)
        // console.log(nextBlock.name, nextBlock.info.foundation, nextBlock.position)

        return nextBlock
    }

    this.checkFoundation = function (foundation, column, height) {

        return true
        const yList = Enumerable.range(foundation.position.y, foundation.position.y + height)
        for (let yPosition of yList) {
            const nextBlock = this.getBlockByColumn(column, yPosition)
            if (nextBlock.foundation) {
                return false
            }
        }

        return true
    }

    this.getBlockByColumn = function (column, yPosition) {
        //TODO:: нужна аптимизация
        let block = column.sections[yPosition]
        if (block.foundation === undefined) {
            block = this.Movements.getBlockByColumn(block.position, 0, 0, 0)
            return this.injectFoundationInfo(block)
        }

        return block
    }

    this.getBlockByPosition = function (position) {
        position = position.clone()
        const block = this.Movements.getBlock(position, 0, 0, 0)
        return this.injectFoundationInfo(block)
    }

    this.injectFoundationInfo = (block) => {

        const mcBlock = this.mcData.blocksByName[block.name]
        const info = mcBlock.info
        block.info = info !== undefined ? info : {}
        if (block.info.foundation !== undefined) {
            info.badBuildingBlock = !!info.badBuildingBlock
            return block
        }
        //block.replaceable заменяемые блоки , воздух, вода лава и тд. тп.
        //block.canFall песок или гравий
        //TODO:: могут падать из за багов генерации
        //block.openable калитки сундуки и тд. тп
        block.info.foundation = block.canFall || block.openable || !block.replaceable
        //сундуки не открываемые =(
        block.info.badBuildingBlock = !(!block.liquid || !block.openable)
        //сохраняем на будущее
        mcBlock.info = block.info

        return block
    }
}

module.exports = {
    FoundationBlockCollectionBuilder: FoundationBlockCollectionBuilder
}