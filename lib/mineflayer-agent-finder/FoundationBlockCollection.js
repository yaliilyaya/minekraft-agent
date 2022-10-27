function FoundationBlockCollection() {
    this.foundationBlocks = []

    this.getSlicePlace = (sliceArea) => {
        return this.foundationBlocks.filter(
            foundationBlocks => sliceArea.equalsInPlace(foundationBlocks.block.position)
        )
    }
}

module.exports = {
    FoundationBlockCollection: FoundationBlockCollection
}