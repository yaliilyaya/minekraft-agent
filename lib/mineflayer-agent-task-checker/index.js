
function AgentTaskChecker () {
  this.AgentInventory = null
  /** проверяет следующее:
   * - наличие ингридиентов для изготовления
   * - проверка инвентаря и сундуков вслучае если нужно добыть материял (а также бочки для мусора)
   */
  this.check = (task) => {
    switch (task.type) {
      case 'dig': {
        return this.checkDig(task)
      }
      case 'crateItem': {
        return this.checkCrateItem(task)
      }
      case 'createTools': {
        return this.checkCreateTools(task)
      }
    }
  }
  /**
   * для начала нужно проверить в инвентаре
   * после в сундуках дома
   * после в бочках мусора
   * в случае если не найдены компоненты то можно начать добычу
   * @param task
   */
  this.checkDig = (task) => {
    const itemName = task.parts[0].name;
    let items = this.AgentInventory.findAllItemByName(itemName);

    console.log(items)


    return { success: true }
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
    return agentTaskChecker
  }
}
