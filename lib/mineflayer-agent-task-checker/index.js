const {AgentTaskDigChecker} = require("./AgentTaskDigChecker");

function AgentTaskChecker () {
  this.AgentInventory = null
  this.AgentTaskDigChecker = null;
  this.init = () => {
    this.AgentTaskDigChecker = new AgentTaskDigChecker(this.AgentInventory)
  }

  /** проверяет следующее:
   * - наличие ингридиентов для изготовления
   * - проверка инвентаря и сундуков вслучае если нужно добыть материял (а также бочки для мусора)
   */
  this.check = (task) => {
    switch (task.type) {
      case 'dig': {
        return this.AgentTaskDigChecker.check(task)
      }
      case 'crateItem': {
        return this.checkCrateItem(task)
      }
      case 'createTools': {
        return this.checkCreateTools(task)
      }
    }
  }


  this.checkDig = (task) => {

  }
  /**
   * TODO:: сейчас не приоритетно. все ингридиенты должны храняиться в инвентаре
   * для начала нужно проверить в инвентаре
   * после в сундуках дома
   * после в бочках мусора
   * в случае если не найдены компоненты то нужно создать задачу на добычу или же на создание нового предмета
   * @param task
   */
  this.checkCrateItem = (task) => {

    return { success: true }
  }
  /**
   * для начала нужно проверить в инвентаре
   * после в сундуках дома
   * после в бочках мусора
   * в случае если не найдены компоненты то нужно создать задачу на добычу или же на создание нового предмета
   * @param task
   */
  this.checkCreateTools = (task) => {
    return { success: true }
  }
}

module.exports = {
  AgentTaskCheckerBuilder: (AgentInventory) => {
    const agentTaskChecker = new AgentTaskChecker()
    agentTaskChecker.AgentInventory = AgentInventory

    agentTaskChecker.init()
    return agentTaskChecker
  }
}
