
function AgentTaskChecker (JobContainer) {
  this.JobContainer = JobContainer

  /** проверяет следующее:
   * - наличие ингридиентов для изготовления
   * - проверка инвентаря и сундуков вслучае если нужно добыть материял (а также бочки для мусора)
   */
  this.check = async (task) => {

    const job = this.JobContainer.get(task.type)
    //TODO:: Обработать исключение, если не найден job
    return await job.check(task);
  }
}

module.exports = {
  AgentTaskChecker: AgentTaskChecker,
}
