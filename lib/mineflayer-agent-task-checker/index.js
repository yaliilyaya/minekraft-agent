const {DigChecker} = require("./Checker/DigChecker");
const {CrateItemChecker} = require("./Checker/CrateItemChecker");
const {CreateToolsChecker} = require("./Checker/CreateToolsChecker");

function AgentTaskChecker () {
  this.AgentInventory = null
  this.AgentCraft = null;
  this.AgentItemInfo = null;

  this.DigChecker = null;
  this.CrateItemChecker = null;
  this.CreateToolsChecker = null;

  this.init = () => {
    this.DigChecker = new DigChecker(this.AgentInventory)
    this.CrateItemChecker = new CrateItemChecker(this.AgentInventory, this.AgentCraft, this.AgentItemInfo)
    this.CreateToolsChecker = new CreateToolsChecker(this.AgentInventory)
  }

  /** проверяет следующее:
   * - наличие ингридиентов для изготовления
   * - проверка инвентаря и сундуков вслучае если нужно добыть материял (а также бочки для мусора)
   */
  this.check = async (task) => {
    switch (task.type) {
      case 'dig': {
        return await this.DigChecker.check(task)
      }
      case 'crateItem': {
        return await this.CrateItemChecker.check(task)
      }
      case 'createTools': {
        return await this.CreateToolsChecker.check(task)
      }
    }
  }
}

module.exports = {
  AgentTaskCheckerBuilder: (AgentInventory, AgentCraft, AgentItemInfo) => {
    const agentTaskChecker = new AgentTaskChecker()
    agentTaskChecker.AgentInventory = AgentInventory
    agentTaskChecker.AgentCraft = AgentCraft
    agentTaskChecker.AgentItemInfo = AgentItemInfo

    agentTaskChecker.init()
    return agentTaskChecker
  }
}
