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
