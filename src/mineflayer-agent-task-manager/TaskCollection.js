const {Task} = require('./Task')

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
        task.type = 'takeItem'
        task.parts = [
            {
                name: taskData.info.name,
                count: taskData.info.count
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
        return task
    }

    /**
     * Нужно добыть элемент или блок
     * @param taskData
     * @returns {Task}
     */
    this.crateDigItem = (taskData) => {
        const task = this.createTask()
        task.type = 'digItem'
        task.parts = [
            {
                name: taskData.info.name,
                count: taskData.info.count
            }
        ]
        return task
    }

    this.crateBuildCraftingTable = function (taskData) {
        const task = this.createTask()
        task.type = 'buildCraftingTable'
        return task;
    }
}

module.exports = {
    TaskCollection: TaskCollection
}