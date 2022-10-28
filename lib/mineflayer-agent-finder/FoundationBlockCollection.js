function FoundationBlockCollection() {
    this.foundationBlocks = []

    this.getSlicePlace = (sliceArea) => {
        const foundationBlocks = this.foundationBlocks.filter(
            foundationBlocks => sliceArea.equalsInPlace(foundationBlocks.block.position)
        )

        const foundationBlockCollection = new FoundationBlockCollection()
        foundationBlockCollection.foundationBlocks = foundationBlocks

        return foundationBlockCollection
    }

    this.push = (foundationBlock) => {
        this.foundationBlocks.push(foundationBlock)
    }

    this.getHeight = () => {
        const list = this.foundationBlocks.map(fBlock => fBlock.block.position.y)
        return Math.max(...list) - Math.min(...list)
    }

    this.hasBadBlock = () => this.foundationBlocks.some(fBlock => fBlock.block.info.badBuildingBlock)
}

module.exports = {
    FoundationBlockCollection: FoundationBlockCollection
}