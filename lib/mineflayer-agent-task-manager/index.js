const fs = require('fs');

/**
 * @constructor
 */
function Task()
{
  this.isRun = false;
  this.isCompleted = false;
  /** добыча, создание, строительство, ремонт */
  this.type = null;
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
    return this.taskList[this.taskList.length - 1];
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
  const AgentTask = null;
  this.taskCollection = new TaskCollection()

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

  this.run = async () => {
      await setInterval(async () => {

        console.log('setInterval')
        let task = that.taskCollection.lastTask();
        if (task.isRun) {
          return;
        }

        task.isRun = true;
        console.log('Выполняю задачу, ' + task.toString())
        await that.AgentTask.run(task, (result) => {
          if (result.type === 'error') {
            console.log('Не удалось выполнить задачу')
            console.log(result);
            return
          }
          task.isCompleted = true;
          console.log('Выполнил задачу успешно')
        })
      }, 10000)
  }
}

module.exports = {
  AgentTaskManagerBuilder: (AgentTask) => {
    const agentTaskManager = new AgentTaskManager()
    agentTaskManager.AgentTask = AgentTask
    return agentTaskManager
  }
}
