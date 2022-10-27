function FoundationBlockCollection() {
    this.foundationBlocks = []

    this.getSlicePlace = (sliceArea) => {
        return this.foundationBlocks.filter(
            foundationBlocks => sliceArea.equalsInPlace(foundationBlocks.block.position)
        )
    }
    this.push = (foundationBlock) => {
        this.foundationBlocks.push(foundationBlock)
    }
}

module.exports = {
    FoundationBlockCollection: FoundationBlockCollection
}