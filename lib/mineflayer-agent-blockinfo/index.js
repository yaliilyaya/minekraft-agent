const { Movements, goals } = require('mineflayer-pathfinder')

function AgentBlockInfo () {
  this.mcData = null;

  /**
   * TODO:: нужен поиск по группе предметов
   * @param name
   * @returns {*}
   */
  this.findBlockIdByName = (name) => {
    if (!name || this.mcData.blocksByName[name] === undefined) {
      console.log(`not found ${name}`)
      return
    }

    return this.mcData.blocksByName[name].id
  }

}

module.exports = {
  AgentBlockInfoBuilder: () => {
    return new AgentBlockInfo()
  }
}
