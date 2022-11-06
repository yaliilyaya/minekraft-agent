function TakeItemChecker(AgentInventory, AgentItemInfo) {
    this.AgentInventory = AgentInventory;
    this.AgentItemInfo = AgentItemInfo;


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

        console.log(`в инвентаре не найден ${item.name} нужно начать добычу или создание ${item.count}`)

        return this.AgentItemInfo.canDigItemByName(item.name)
            ? this.resultDigTask(item)
            : this.resultCreateTask(item)
    }

    this.checkInventoryItemExist = (item) => this.AgentInventory.isItemExist(item.name, item.count)

    this.resultDigTask = function (item) {
        return {
            success: false,
            taskList: [
                {
                    type: 'digItem',
                    info: {
                        name: item.name,
                        count: item.count
                    },
                }
            ]
        };
    }

    this.resultCreateTask = function (item) {
        return {
            success: false,
            taskList: [
                {
                    type: 'crateItem',
                    info: {
                        name: item.name,
                        count: item.count
                    },
                }
            ]
        }
    }

    this.resultDigTask = function (item) {
        return {
            success: false,
            taskList: [
                {
                    type: 'digItem',
                    info: {
                        name: item.name,
                        count: item.count
                    },
                }
            ]
        };
    }


}

module.exports = {
    TakeItemChecker: TakeItemChecker
}