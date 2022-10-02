const {ItemCollection} = require("./ItemCollection");

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
        const itemName = task.parts[0].name;
        const itemCount = task.parts[0].count;
        let items = this.AgentInventory.findAllItemByName(itemName);

        const itemCollection = new ItemCollection(items);
        const itemExists = itemCollection.sumByNames().isExitCount(itemCount)

        if (itemExists) {
            return {success: false, isCompleted: true}
        }
        return {success: true}
    }
}

module.exports = {
    AgentTaskDigChecker: AgentTaskDigChecker
}