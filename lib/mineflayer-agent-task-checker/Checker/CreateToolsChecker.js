function CreateToolsChecker(AgentInventory) {
    this.AgentInventory = AgentInventory;
    /**
     * для начала нужно проверить в инвентаре
     * после в сундуках дома
     * после в бочках мусора
     * в случае если не найдены компоненты то нужно создать задачу на добычу или же на создание нового предмета
     * @param task
     */
    this.check = async (task) => {

        const item = task.parts[0]
        if (this.checkInventoryItemExist(item)) {
            return {success: false, isCompleted: true}
        }
        return {success: true}
    }

    this.checkInventoryItemExist = (item) => this.AgentInventory.isItemExist(item.name, item.count)
}

module.exports = {
    CreateToolsChecker: CreateToolsChecker
}