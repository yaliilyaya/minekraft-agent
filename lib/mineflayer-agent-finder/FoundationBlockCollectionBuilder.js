const {FoundationBlockCollection} = require("./FoundationBlockCollection");
const Enumerable = require("node-enumerable");
const vec3 = require("vec3");
const {FoundationBlock} = require("./FoundationBlock");

function FoundationBlockCollectionBuilder(Movements, world) {
    this.Movements = Movements
    this.world = world

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

            collection.blocks.push(foundationBlock)
        })

        return collection
    }

    this.iterableArea = function (searchArea, mapCallback) {
        const xList = Enumerable.range(searchArea.begin.x, searchArea.end.x)
        const zList = Enumerable.range(searchArea.begin.z, searchArea.end.z)

        for (let xPosition of xList) {
            for (let zPosition of zList) {
                mapCallback(new vec3(xPosition, searchArea.begin.y, zPosition))
            }
        }
    }

    this.findFoundationBlock = function (firstBlock, height) {

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
        const block = this.Movements.getBlock(position, 0, 0, 0)
        return this.injectFoundationInfo(block)
    }

    this.injectFoundationInfo = (block) => {

        return block
    }
}

module.exports = {
    FoundationBlockCollectionBuilder: FoundationBlockCollectionBuilder
}