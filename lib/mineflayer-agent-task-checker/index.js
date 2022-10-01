

function AgentTaskChecker ()
{
  this.check = () => {

  }
}

module.exports = {
  AgentTaskCheckerBuilder: (AgentTask) => {
    const agentTaskChecker = new AgentTaskChecker()

    return agentTaskChecker
  }
}
