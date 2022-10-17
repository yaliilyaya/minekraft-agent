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
        if (this.checkInventoryItemExist(task)) {
            return {success: false, isCompleted: true}
        }
        return {success: true}
    }

    this.checkInventoryItemExist = (task) => {
        return this.AgentInventory.isItemExist(
            task.parts[0].name,
            task.parts[0].count
        );
    }
}

module.exports = {
    CreateToolsChecker: CreateToolsChecker
}