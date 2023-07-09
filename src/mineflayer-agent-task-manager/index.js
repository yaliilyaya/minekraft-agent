const fs = require('fs')
const {TaskCollection} = require('./TaskCollection')

/**
 * Журнал задач содержит задачи по порядку и отвечает за их актуальность
 * каждая таска содержит части для их выполнения
 *
 * @constructor
 */
function AgentTaskManager(AgentTask, AgentTaskChecker)
{
  const that = this
  this.AgentTask = AgentTask
  this.AgentTaskChecker = AgentTaskChecker
  this.taskCollection = new TaskCollection()
  this.task = null
  this.loopTime = 2000

  this.load = () => {
    const fileName = [__dirname, 'task_list.json'].join('/')
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      that.taskCollection.loadFromJson(data)
      console.log(that.taskCollection.toString())
    })
  }

  this.run = async () => await setInterval(this.runLoop, this.loopTime)

  this.runLoop = async () => {
    // console.log('runLoop')
    if (this.task != null) {
      return
    }
    this.task = that.taskCollection.lastTask()
    if (this.task === null) {
      return
    }
    // что является успешным и негативным результатом
    // проверка успешна если всё есть для создания предметов в инвентаре
    // -- если есть нужные ингридиенты в сундуках нужно его взять - take и переложить в инвентарь
    // проверка успешна если в инвентаре или в хранилище нет предметов которые нужно добыть
    // -- в случае если предмет уже был добыт ранее необходимо завершить задачу
    const result = await this.AgentTaskChecker.check(this.task)
    if (!result.success) {
      console.log(`Проверка провалилась - ` + this.task.toString())
      console.log(result)
      if (result.isCompleted) {
        console.log("Задача была досрочно завершена - " +  this.task.toString())
        this.task.isCompleted = true
        this.task = null
        return
      }
      if (!!result.taskList) {
        const taskList = result.taskList.map(task => this.createNextTask(task))
        taskList.forEach(task => this.taskCollection.addTask(task))

        this.task = null

        console.log(this.taskCollection.toString())

        return
      }
      // TODO:: очищаем весь список задач и возвращаемся к целям, загружаем задачи заного
      return
    }
    const data = {}
    console.log('Выполняю задачу, ' + this.task.toString())
    // TODO:: Запускать задания нужно по частям
    // TODO:: необходимо делать проверку перед запуском задачи. есть ли инструмент в инвентаре, строил ли станок и т.д
    await that.AgentTask.run(this.task, data, this.callbackRunResult)
  }

  this.callbackRunResult = (result) => {
    if (result.type === 'error') {
      console.log('Не удалось выполнить задачу')
      console.log(result)
      return
    }
    this.task.isCompleted = true
    this.task = null
    console.log('Выполнил задачу успешно')
  }

  this.createNextTask = (taskData) => {
    switch (taskData.type) {
      case 'takeItem':
        // сейчас не приоритетно. все ингридиенты должны храняиться в инвентаре
        return this.taskCollection.crateTakeTask(taskData)
      case 'crateItem':
        return this.taskCollection.crateCreateTask(taskData)
      case 'digItem':
        return this.taskCollection.crateDigItem(taskData)
      case 'buildCraftingTable':
        return this.taskCollection.crateBuildCraftingTable(taskData)
    }
  }
}

module.exports = {
  AgentTaskManager: AgentTaskManager
}
