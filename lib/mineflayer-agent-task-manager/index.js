/**
 * Нужно решить будут ли таски специализированные или же разделённые на специфические части
 * @constructor
 */
function Task()
{
  this.isCompleted = false;
  /** добыча, создание, строительство, ремонт */
  this.type = null;
  this.parts = [];
  /** есть блоки а есть элементы */
  this.addPart = (blockName, count) => {
    this.parts.push({
      'blockIds': [12321312, 12312321],
      'itemIds': [12321312, 12312321],
      'itemNames': ['adsdsadsa', 'asdasdas'],
      'blockNames': ['adsdsadsa', 'asdasdas'],
      'buildTemplate': "sfdsdfsdfsd",
      'count': count,
    })
  }

}

/**
 * Журнал задач содержит задачи по порядку и отвечает за их актуальность
 * каждая таска содержит части для их выполнения
 *
 * @constructor
 */
function AgentTaskManager ()
{
  this.taskList = [];

  this.createTask = () => {
    return new Task();
  }

  this.addTask = ($task) => {
    this.taskList.push($task);
  }

  this.lastTask = () => {
    return this.taskList[this.taskList.length - 1];
  }
}

module.exports = {
  AgentTaskManagerBuilder: () => {
    const agentTaskManager = new AgentTaskManager()
    return agentTaskManager
  }
}
