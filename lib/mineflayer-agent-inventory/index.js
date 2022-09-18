const { Movements, goals } = require('mineflayer-pathfinder')

function AgentInventory () {

}

module.exports = {
  AgentInventoryBuilder: () => {
    const agentFinder = new AgentInventory()

    return agentFinder
  }
}
