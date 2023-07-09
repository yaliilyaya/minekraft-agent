const {BuildCraftingTableJob} = require("./BuildCraftingTableJob");
const {CreateItemJob} = require("./CreateItemJob");
const {DigJob} = require("./DigJob");
const {TakeItemJob} = require("./TakeItemJob");

function JobContainer(
    ServiceContainer
) {
    this.ServiceContainer = ServiceContainer

    this.container = {
        crateItem: null,
        buildCraftingTable: null,
        digItem: null,
    };


    this.has = function (name) {
        return !!this.container[name];
    }

    this.get = (name) => {
        switch (name) {
            case 'crateItem': return this.has(name)
                ? this.container.crateItem
                : this.container.crateItem = new CreateItemJob(
                    this.ServiceContainer.get('AgentInventory'),
                    this.ServiceContainer.get('AgentCraft'),
                    this.ServiceContainer.get('AgentFinder'),
                    this.ServiceContainer.get('AgentDig')
                )
            case 'buildCraftingTable': return this.has(name)
                ? this.container.buildCraftingTable
                : this.container.buildCraftingTable = new BuildCraftingTableJob(//bot, AgentInventory, AgentDig, AgentFinder, AgentToolsInfo
                    this.ServiceContainer.get('bot'),
                    this.ServiceContainer.get('AgentInventory'),
                    this.ServiceContainer.get('AgentDig'),
                    this.ServiceContainer.get('AgentFinder'),
                    this.ServiceContainer.get('AgentToolsInfo'),
                )
            case 'digItem': return this.has(name)
                ? this.container.digItem
                : this.container.digItem = new DigJob(
                    this.ServiceContainer.get('bot'),
                    this.ServiceContainer.get('AgentInventory'),
                    this.ServiceContainer.get('AgentBlockInfo'),
                    this.ServiceContainer.get('AgentDig'),
                    this.ServiceContainer.get('AgentFinder'),
                    this.ServiceContainer.get('AgentToolsInfo')
                )
            case 'takeItem': return this.has(name)
                ? this.container.takeItem
                : this.container.takeItem = new TakeItemJob(
                    this.ServiceContainer.get('AgentInventory'),
                    this.ServiceContainer.get('AgentItemInfo')
                )


        }
    }
}

module.exports = {
    JobContainer: JobContainer
}