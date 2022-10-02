function CreateToolsChecker(AgentInventory) {
    this.AgentInventory = AgentInventory;
    /**
     * для начала нужно проверить в инвентаре
     * после в сундуках дома
     * после в бочках мусора
     * в случае если не найдены компоненты то нужно создать задачу на добычу или же на создание нового предмета
     * @param task
     */
    this.check = (task) => {
        const itemExists = this.AgentInventory.isItemExist(
            task.parts[0].name,
            task.parts[0].count
        );
        if (itemExists) {
            return {success: false, isCompleted: true}
        }
        return {success: true}
    }
}

module.exports = {
    CreateToolsChecker: CreateToolsChecker
}