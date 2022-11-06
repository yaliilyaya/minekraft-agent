const {DigChecker} = require("./Checker/DigChecker");
const {CrateItemChecker} = require("./Checker/CrateItemChecker");
const {CreateToolsChecker} = require("./Checker/CreateToolsChecker");
const {TakeItemChecker} = require("./Checker/TakeItemChecker");
const {BuildCraftingTableChecker} = require("./Checker/BuildCraftingTableChecker");

function AgentTaskChecker () {
  this.AgentInventory = null
  this.AgentCraft = null;
  this.AgentItemInfo = null;
  this.AgentFinder = null;

  this.DigChecker = null;
  this.CrateItemChecker = null;
  this.CreateToolsChecker = null;
  this.TakeItemChecker = null;

  this.init = () => {
    this.DigChecker = new DigChecker(this.AgentInventory)
    this.CrateItemChecker = new CrateItemChecker(this.AgentInventory, this.AgentCraft, this.AgentFinder)
    this.CreateToolsChecker = new CreateToolsChecker(this.AgentInventory)
    this.TakeItemChecker = new TakeItemChecker(this.AgentInventory, this.AgentItemInfo)
    this.BuildCraftingTableChecker = new BuildCraftingTableChecker(this.AgentInventory, this.AgentFinder)
  }

  /** проверяет следующее:
   * - наличие ингридиентов для изготовления
   * - проверка инвентаря и сундуков вслучае если нужно добыть материял (а также бочки для мусора)
   */
  this.check = async (task) => {
    switch (task.type) {
      case 'digItem': {
        return await this.DigChecker.check(task)
      }
      case 'buildCraftingTable': {
        return await this.BuildCraftingTableChecker.check(task)
      }
      case 'crateItem': {
        return await this.CrateItemChecker.check(task)
      }
      case 'createTools': {
        return await this.CreateToolsChecker.check(task)
      }
      case 'takeItem': {
        return await this.TakeItemChecker.check(task)
      }
    }
  }
}

module.exports = {
  AgentTaskCheckerBuilder: (AgentInventory, AgentCraft, AgentItemInfo, AgentFinder) => {
    const agentTaskChecker = new AgentTaskChecker()
    agentTaskChecker.AgentInventory = AgentInventory
    agentTaskChecker.AgentCraft = AgentCraft
    agentTaskChecker.AgentItemInfo = AgentItemInfo
    agentTaskChecker.AgentFinder = AgentFinder

    agentTaskChecker.init()
    return agentTaskChecker
  }
}
