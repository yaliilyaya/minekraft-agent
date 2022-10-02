function AgentCraft () {
  this.bot = null;
  this.AgentBlockInfo = null;

  this.craftItemByName = async (name, amount) => {
    let craftingTable = null
    let recipe = this.AgentBlockInfo.findRecipe(craftingTable, name);
    if (!recipe) {
      craftingTable = await this.AgentBlockInfo.findCraftingTable();
      recipe = this.AgentBlockInfo.findRecipe(craftingTable, name);
    }

    if (!recipe) {
      console.log(`I cannot make ${name}`)
      return
    }

    try {
      console.log(`I can make ${name}`)
      await this.bot.craft(recipe, amount, craftingTable)
      console.log(`did the recipe for ${name} ${amount} times`)
    } catch (err) {
      console.log(`error making ${name}`)
    }
  }

  this.craftItemInInventory = async (name, amount) => {

    const recipe = this.AgentBlockInfo.findRecipe(null, name);

    if (recipe) {
      console.log(`I can make ${name}`)
      try {
        await this.bot.craft(recipe, amount, null)
        console.log(`did the recipe for ${name} ${amount} times`)
      } catch (err) {
        console.log(`error making ${name}`)
      }
    } else {
      console.log(`I cannot make ${name}`)
    }
  }

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
