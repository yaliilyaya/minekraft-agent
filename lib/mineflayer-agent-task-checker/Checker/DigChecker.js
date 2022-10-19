function DigChecker(AgentInventory) {
    this.AgentInventory = AgentInventory;

    /**
     * для начала нужно проверить в инвентаре
     * в случае если не найдены компоненты то можно начать добычу
     * @param task
     */
    this.check = async (task) => {

        const item = task.parts[0]
        if (this.checkInventoryItemExist(item)) {
            return {success: false, isCompleted: true}
        }
        console.log(`в инвентаре не найден ${item.name} нужно начать добычу ${item.count}`)
        return {success: true}
    }

    this.checkInventoryItemExist = (item) => this.AgentInventory.isItemExist(item.name, item.count)
}

module.exports = {
    DigChecker: DigChecker
}