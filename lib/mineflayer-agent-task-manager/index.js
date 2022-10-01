const fs = require('fs');

/**
 * @constructor
 */
function Task()
{
  this.isCompleted = false;
  /** добыча, создание, строительство, ремонт */
  this.type = null;
  //TODO:: Для облегчения реализации таски будут содержать только одну часть
  this.parts = [];
  /** есть блоки а есть элементы */
  this.addPart = (blockName, count) =>
  {
    // this.parts.push({
    //   'blockIds': [12321312, 12312321],
    //   'itemIds': [12321312, 12312321],
    //   'itemNames': ['adsdsadsa', 'asdasdas'],
    //   'blockNames': ['adsdsadsa', 'asdasdas'],
    //   'buildTemplate': "sfdsdfsdfsd",
    //   'count': count,
    // })
  }

  this.toString = () =>
  {
    const list = this.parts.map((part) => {
      return `${part.name} - ${part.count}`
    })
    return `Задача нужно ${this.type}: ` + list.join(', ')
  }
}

function TaskCollection()
{
  this.taskList = [];

  this.createTask = () =>
  {
    return new Task();
  }

  this.addTask = ($task) =>
  {
    this.taskList.push($task);
  }

  this.lastTask = () =>
  {
    let list = this.taskList.filter((task) => {
      return !task.isCompleted;
    })
    return list.length > 0 ? list[list.length - 1] : null;
  }

  this.loadFromJson = (json) =>
  {
    const taskList = JSON.parse(json);

    this.taskList = taskList.map((taskData) => {
      let task = new Task();
      task.type = taskData.type;
      task.parts = taskData.parts;

      return task;
    })
  }

  this.toString = () =>
  {
      return 'Все задачи: \n'
          + this.taskList.map((task) => { return task.toString() })
              .join('\n')
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
  const that = this;
  this.AgentTask = null;
  this.AgentTaskChecker = null;
  this.taskCollection = new TaskCollection()
  this.task = null
  this.loopTime = 2000;

  this.load = () => {
    const fileName = __dirname + '/task_list.json';
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      that.taskCollection.loadFromJson(data);
      console.log(that.taskCollection.toString());
    });
  }

  this.run = async () => await setInterval(this.runLoop, this.loopTime)

  this.runLoop = async () => {
    // console.log('setInterval')
    if (this.task) {
      return
    }
    this.task = that.taskCollection.lastTask();
    //что является успешным и негативным результатом
    // проверка успешна если всё есть для создания предметов в инвентаре
    // -- если есть нужные ингридиенты в сундуках нужно его взять - take и переложить в инвентарь
    // проверка успешна если в инвентаре или в хранилище нет предметов которые нужно добыть
    // -- в случае если предмет уже был добыт ранее необходимо завершить задачу
    const result = this.AgentTaskChecker.check(this.task);
    if (!result.success) {
      //TODO:: нужно либо выбросить исключение о невозможности исполнить задачу.
      // либо создать новые таски
      return;
    }

    console.log('Выполняю задачу, ' + this.task.toString())
    //TODO:: Запускать задания нужно по частям
    //TODO:: необходимо делать проверку перед запуском задачи. есть ли инструмент в инвентаре, строил ли станок и т.д
    await that.AgentTask.run(this.task, this.callbackRunResult)
  }

  this.callbackRunResult = (result) => {
    if (result.type === 'error') {
      console.log('Не удалось выполнить задачу')
      console.log(result);
      return
    }
    this.task.isCompleted = true;
    console.log('Выполнил задачу успешно')
  }
}

module.exports = {
  AgentTaskManagerBuilder: (AgentTask, AgentTaskChecker) => {
    const agentTaskManager = new AgentTaskManager()
    agentTaskManager.AgentTask = AgentTask
    agentTaskManager.AgentTaskChecker = AgentTaskChecker
    return agentTaskManager
  }
}
