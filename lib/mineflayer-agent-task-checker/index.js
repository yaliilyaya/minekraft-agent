const {DigChecker} = require("./Checker/DigChecker");
const {CrateItemChecker} = require("./Checker/CrateItemChecker");
const {CreateToolsChecker} = require("./Checker/CreateToolsChecker");

function AgentTaskChecker () {
  this.AgentInventory = null
  this.AgentRecipeInfo = null;

  this.DigChecker = null;
  this.CrateItemChecker = null;
  this.CreateToolsChecker = null;

  this.init = () => {
    this.DigChecker = new DigChecker(this.AgentInventory)
    this.CrateItemChecker = new CrateItemChecker(this.AgentInventory, this.AgentRecipeInfo)
    this.CreateToolsChecker = new CreateToolsChecker(this.AgentInventory)
  }

  /** проверяет следующее:
   * - наличие ингридиентов для изготовления
   * - проверка инвентаря и сундуков вслучае если нужно добыть материял (а также бочки для мусора)
   */
  this.check = (task) => {
    switch (task.type) {
      case 'dig': {
        return this.DigChecker.check(task)
      }
      case 'crateItem': {
        return this.CrateItemChecker.check(task)
      }
      case 'createTools': {
        return this.CreateToolsChecker.check(task)
      }
    }
  }
}

module.exports = {
  AgentTaskCheckerBuilder: (AgentInventory, AgentRecipeInfo) => {
    const agentTaskChecker = new AgentTaskChecker()
    agentTaskChecker.AgentInventory = AgentInventory
    agentTaskChecker.AgentRecipeInfo = AgentRecipeInfo

    agentTaskChecker.init()
    return agentTaskChecker
  }
}
