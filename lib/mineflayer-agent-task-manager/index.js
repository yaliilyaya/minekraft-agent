function AgentTaskManager () {

}

module.exports = {
  AgentTaskManagerBuilder: () => {
    const agentTaskManager = new AgentTaskManager()
    return agentTaskManager
  }
}
