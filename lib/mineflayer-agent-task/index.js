const Enumerable = require('node-enumerable')
const {BuildArea} = require("../mineflayer-agent-finder/BuildArea");
const vec3 = require("vec3");
const {Vec3} = require("vec3");

function AgentTask (JobContainer) {
  this.JobContainer = JobContainer

  this.run = async (task, data, callback) => {

    const job = this.JobContainer.get(task.type)
    //TODO:: Обработать исключение, если не найден job
    await job.run(task, callback);
  }
}

module.exports = {
  AgentTask: AgentTask
}
