function AgentTaskDigChecker(AgentInventory) {
    this.AgentInventory = AgentInventory;
    /**
     * для начала нужно проверить в инвентаре
     * после в сундуках дома
     * после в бочках мусора
     * в случае если не найдены компоненты то можно начать добычу
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
    AgentTaskDigChecker: AgentTaskDigChecker
}