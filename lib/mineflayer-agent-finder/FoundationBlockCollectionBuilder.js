const {FoundationBlockCollection} = require("./FoundationBlockCollection");
const Enumerable = require("node-enumerable");
const vec3 = require("vec3");
const {FoundationBlock} = require("./FoundationBlock");

function FoundationBlockCollectionBuilder(Movements, world, mcData) {
    this.Movements = Movements
    this.world = world
    this.mcData = mcData

    /**
     *
     * @param {import('./BuildArea').BuildArea} searchArea
     */
    this.create = (searchArea) => {
        let collection = new FoundationBlockCollection()
        const height = searchArea.begin.y

        this.iterableArea(searchArea, (position) => {


            const firstBlock = this.getBlockByPosition(position)
            console.log(firstBlock.name, firstBlock.info.foundation, firstBlock.info.badBuildingBlock)


            console.log(position, firstBlock)
            const foundationBlock = this.findFoundationBlock(firstBlock, height)
            //
            // collection.blocks.push(foundationBlock)
        })

        return collection
    }

    this.iterableArea = function (searchArea, mapCallback) {
        const xList = Enumerable.range(0, searchArea.end.x - searchArea.begin.x)

        for (let xPosition of xList) {
            const zList = Enumerable.range(0, searchArea.end.z - searchArea.begin.z)
            for (let zPosition of zList) {
                mapCallback(new vec3(
                    xPosition + searchArea.begin.x,
                    searchArea.begin.y,
                    zPosition + searchArea.begin.z))
            }
        }
    }

    this.findFoundationBlock = function (firstBlock, height) {

        return null

        let foundationBlock = new FoundationBlock();
        const column = this.world.getColumn(firstBlock.position.x, firstBlock.position.z)

        let foundation = firstBlock.foundation
            ? this.findFoundationInColumnUp(column, firstBlock.position.y)
            : this.findFoundationInColumnDown(column, firstBlock.position.y)

        // нужно проверить высоту строительства здания height

        foundationBlock.block = foundation;
        foundationBlock.blockid = foundation.id
        foundationBlock.isBad = !this.checkFoundation(foundation, column, height)

        return foundationBlock
    }

    this.findFoundationInColumnUp = function (column, yPosition) {
        const direction = 1
        let nextBlock = this.getBlockByColumn(column, yPosition)
        let prevBlock = nextBlock

        while (nextBlock && nextBlock.foundation) {
            yPosition = yPosition + direction
            prevBlock = nextBlock
            nextBlock = this.getBlockByColumn(column, yPosition)
        }

        return !nextBlock && nextBlock.foundation ? prevBlock : null;
    }

    this.findFoundationInColumnDown = function (column, yPosition) {
        const direction = -1
        let nextBlock = this.getBlockByColumn(column, yPosition)
        let prevBlock = nextBlock

        while (nextBlock && !nextBlock.foundation) {
            yPosition = yPosition + direction
            prevBlock = nextBlock
            nextBlock = this.getBlockByColumn(column, yPosition)
        }

        return !nextBlock && nextBlock.foundation ? prevBlock : null;
    }

    this.checkFoundation = function (foundation, column, height) {

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
        //TODO:: Начинаем искать на блок ниже чем агент
        position = position.clone()
        position.y -= 1
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