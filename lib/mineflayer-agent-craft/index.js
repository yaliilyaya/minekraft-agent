const { Movements, goals } = require('mineflayer-pathfinder')

function AgentCraft () {
  this.bot = null;
  this.AgentBlockInfo = null;

  this.craftItemInCraftingTable = async (name, amount) => {

    const craftingTable = this.AgentBlockInfo.findCraftingTable();
    if (!craftingTable) {
      console.log('not fond craftingTable');
      return
    }

    const recipe = this.AgentBlockInfo.findRecipe(craftingTable, name);

    if (recipe) {
      console.log(`I can make ${name}`)
      try {
        await this.bot.craft(recipe, amount, craftingTable)
        console.log(`did the recipe for ${name} ${amount} times`)
      } catch (err) {
        console.log(`error making ${name}`)
      }
    } else {
      console.log(`I cannot make ${name}`)
    }
  }
}

module.exports = {
  AgentCraftBuilder: (bot, AgentBlockInfo) => {
    const agentCraft = new AgentCraft()
    agentCraft.bot = bot;
    agentCraft.AgentBlockInfo = AgentBlockInfo;
    return agentCraft;
  }
}
