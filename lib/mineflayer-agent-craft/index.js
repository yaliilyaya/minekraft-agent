function AgentCraft () {
  this.bot = null;
  this.AgentBlockInfo = null;

  this.findRecipe = async (name, useCraftingTable) => {
    let recipe = this.AgentBlockInfo.findRecipe(null, name);
    if (useCraftingTable && !recipe) {
      let craftingTable = await this.AgentBlockInfo.findCraftingTable();
      recipe = this.AgentBlockInfo.findRecipe(craftingTable, name);
    }

    return recipe
  }

  this.craft = async (recipe, amount, useCraftingTable) => {
    let craftingTable = null
    if (useCraftingTable && recipe.requiresTable ) {
      craftingTable = await this.AgentBlockInfo.findCraftingTable();
    }
    try {
      console.log(`I can make ${name}`)
      await this.bot.craft(recipe, amount, craftingTable)
      console.log(`did the recipe for ${name} ${amount} times`)
    } catch (err) {
      console.log(`error making ${name}`)
    }
  }

  this.craftItemByName = async (name, amount) => {
    this.recipe = await this.findRecipe(name, true)
    await this.craft(this.recipe, amount, true)
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
