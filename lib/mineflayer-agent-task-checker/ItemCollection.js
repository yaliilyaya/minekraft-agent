function ItemCollection(items) {
    this.items = items
    this.sumGroup = []

    this.sumByNames = () => {
        for (const item of this.items) {
            this.sumGroup[item.name] = 0
        }

        for (const item of items) {
            this.sumGroup[item.name] += item.count
        }
        return this
    }
    this.isExitCount = (count) => {
        for (let name in this.sumGroup) {
            if (this.sumGroup[name] > count) {
                return true
            }
        }
        return false
    }
}

module.exports = {
    ItemCollection: ItemCollection
}