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

    this.toString = () => {
         const list = this.foundationBlocks.map(fBlock => {
            const position = fBlock.block.position
            return `{${position.x}:${position.y}:${position.z}}`
        })

        return `Height: ${this.getHeight()}, list: ${list}`
    }
}

module.exports = {
    FoundationBlockCollection: FoundationBlockCollection
}