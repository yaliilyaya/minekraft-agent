function ItemCollection(items) {
    this.items = items
    this.sumGroup = []

    this.sumByNames = () => {

        this.items.forEach(item => this.sumGroup[item.name] = 0)
        this.items.forEach(item => this.sumGroup[item.name] += item.count)

        return this
    }
    this.isExitCount = (count) => {
        for (let name in this.sumGroup) {
            if (this.sumGroup[name] >= count) {
                return true
            }
        }
        return false
    }
}

module.exports = {
    ItemCollection: ItemCollection
}