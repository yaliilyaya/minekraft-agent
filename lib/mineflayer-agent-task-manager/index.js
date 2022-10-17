const fs = require('fs')

/**
 * @constructor
 */
function Task () {
  this.isCompleted = false
  /** добыча, создание, строительство, ремонт */
  this.type = null
  // TODO:: Для облегчения реализации таски будут содержать только одну часть
  this.parts = []
  /** есть блоки а есть элементы */
  this.addPart = (blockName, count) => {
    // this.parts.push({
    //   'blockIds': [12321312, 12312321],
    //   'itemIds': [12321312, 12312321],
    //   'itemNames': ['adsdsadsa', 'asdasdas'],
    //   'blockNames': ['adsdsadsa', 'asdasdas'],
    //   'buildTemplate': "sfdsdfsdfsd",
    //   'count': count,
    // })
  }

  this.toString = () => {
    const list = this.parts.map((part) => {
      return `${part.name} - ${part.count}`
    })
    return `Задача нужно ${this.type}: ` + list.join(', ')
  }
}

function TaskCollection () {
  this.taskList = []

  this.createTask = () => {
    return new Task()
  }

  this.addTask = ($task) => {
    this.taskList.push($task)
  }

  this.lastTask = () => {
    const list = this.taskList.filter((task) => {
      return !task.isCompleted
    })
    return list.length > 0 ? list[list.length - 1] : null
  }

  this.loadFromJson = (json) => {
    const taskList = JSON.parse(json)

    this.taskList = taskList.map((taskData) => {
      const task = new Task()
      task.type = taskData.type
      task.parts = taskData.parts

      return task
    })
  }

  this.toString = () => {
    return 'Все задачи: \n' +
          this.taskList.map((task) => { return task.toString() })
            .join('\n')
  }
  /**
   * Взять что то из сундука или бочки
   * @param taskData
   * @returns {Task}
   */
  this.crateTakeTask = (taskData) => {
    const task = this.createTask()
    task.type = taskData.type
    task.parts = [
      {
        name: taskData.parts[0].name,
        count: taskData.parts[0].count,
        position: taskData.parts[0].position
      }
    ]

    return task
  }

  /**
   * Нужно создать элемент
   * @param taskData
   * @returns {Task}
   */
  this.crateCreateTask = (taskData) => {
    const task = this.createTask()
    task.type = 'crateItem'
    task.parts = [
      {
        name: taskData.info.name,
        count: taskData.info.count
      }
    ]
    // console.log(taskData)
    // console.log(task)
    return task
  }
}

/**
 * Журнал задач содержит задачи по порядку и отвечает за их актуальность
 * каждая таска содержит части для их выполнения
 *
 * @constructor
 */
function AgentTaskManager () {
  const that = this
  this.AgentTask = null
  this.AgentTaskChecker = null
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
      console.log('Проверка провалилась')
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
        // this.task.isCompleted = true //TODO:: удалить когда заработает функционал
        this.task = null

        return
      }
      // TODO:: очищаем весь список задач и возвращаемся к целям, загружаем задачи заного
      return
    }

    console.log('Выполняю задачу, ' + this.task.toString())
    // TODO:: Запускать задания нужно по частям
    // TODO:: необходимо делать проверку перед запуском задачи. есть ли инструмент в инвентаре, строил ли станок и т.д
    await that.AgentTask.run(this.task, this.callbackRunResult)
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
      case 'take':
        // сейчас не приоритетно. все ингридиенты должны храняиться в инвентаре
        return this.taskCollection.crateTakeTask(taskData)
      case 'crateItem':
        // сейчас не приоритетно. все ингридиенты должны храняиться в инвентаре
        return this.taskCollection.crateCreateTask(taskData)
    }
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
