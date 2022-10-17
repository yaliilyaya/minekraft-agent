function DigChecker(AgentInventory) {
    this.AgentInventory = AgentInventory;
    /**
     * для начала нужно проверить в инвентаре
     * после в сундуках дома
     * после в бочках мусора
     * в случае если не найдены компоненты то можно начать добычу
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
    DigChecker: DigChecker
}