function BuildCraftingTableChecker(AgentInventory, AgentItemInfo) {
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

        const item = {name: 'crafting_table', count: 1}
        if (!this.checkInventoryItemExist(item)) {
            console.log(`Не нашли верстак в инвентаре, нужно его создать`)
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

        console.log(`Верстак есть в инвентаре, можно ставить его на землю`)

        return {success: true}
    }

    this.checkInventoryItemExist = (item) => this.AgentInventory.isItemExist(item.name, item.count)
}

module.exports = {
    BuildCraftingTableChecker: BuildCraftingTableChecker
}