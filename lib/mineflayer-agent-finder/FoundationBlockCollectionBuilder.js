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
            const firstBlock = this.Movements.getBlock(position, 0, 0, 0)
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

        let FoundationBlock = new FoundationBlock();
        const column = this.world.getColumn(firstBlock.position.x, firstBlock.position.z)
        //Ищем блок с основанием
        const direction = firstBlock.foundation ? 1 : -1

        let foundation = firstBlock.foundation
            ? this.findFoundationInColumnUp(column, firstBlock.position.y)
            : this.findFoundationInColumnDown(column, firstBlock.position.y)

        // нужно проверить высоту строительства здания height

        FoundationBlock.block = foundation;
        FoundationBlock.blockid = foundation.id
        FoundationBlock.isBad = !this.checkFoundation(foundation, column, height)

        return FoundationBlock
    }

    this.findFoundationInColumnUp = function (column, yPosition, ) {
        const direction = 1
        // while
        yPosition = yPosition + direction
        const nextBlock = column.sections[yPosition]

        return undefined;
    }

    this.findFoundationInColumnDown = function (column, yPosition, ) {
        const direction = -1
        // while
        yPosition = yPosition + direction
        const nextBlock = column.sections[yPosition]


        return undefined;
    }

    this.checkFoundation = function (foundation, column, height) {

        const yList = Enumerable.range(foundation.position.y, foundation.position.y + height)
        for (let yPosition of yList) {
            const nextBlock = column.sections[yPosition]
            if (nextBlock.foundation) {
                return false
            }
        }

        return true
    }
}

module.exports = {
    FoundationBlockCollectionBuilder: FoundationBlockCollectionBuilder
}