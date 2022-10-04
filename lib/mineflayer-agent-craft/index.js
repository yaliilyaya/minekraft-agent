function AgentCraft () {
  this.bot = null;
  this.AgentFinder = null;
  this.AgentRecipeInfo = null;

  this.findRecipe = async (name, useCraftingTable) => {
    let recipe = this.AgentRecipeInfo.findRecipe(null, name)

    if (useCraftingTable && !recipe) {
      let craftingTable = await this.AgentFinder.findCraftingTable()
      recipe = this.AgentRecipeInfo.findRecipe(craftingTable, name)
    }

    return recipe
  }

  this.findAllRecipe = async (name, useCraftingTable) => {
    let recipe = this.AgentRecipeInfo.findAllRecipe(name, null)

    if (useCraftingTable && recipe.isEmpty()) {
      let craftingTable = await this.AgentFinder.findCraftingTable()
      return this.AgentRecipeInfo.findAllRecipe(name, craftingTable)
    }

    return recipe
  }

  this.craft = async (recipe, amount, useCraftingTable, name = null) => {
    let craftingTable = null
    if (useCraftingTable && recipe.requiresTable ) {
      craftingTable = await this.AgentFinder.findCraftingTable();
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
    const useCraftingTable = true
    this.recipe = await this.findRecipe(name, useCraftingTable)
    await this.craft(this.recipe, amount, useCraftingTable, name)
  }

  this.craftItemInInventory = async (name, amount) => {

    const recipe = this.AgentRecipeInfo.findRecipe(null, name);

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

    const craftingTable = this.AgentFinder.findCraftingTable();
    if (!craftingTable) {
      console.log('not fond craftingTable');
      return
    }

    const recipe = this.AgentRecipeInfo.findRecipe(craftingTable, name);

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
  AgentCraftBuilder: (bot, AgentRecipeInfo, AgentFinder) => {
    const agentCraft = new AgentCraft()
    agentCraft.bot = bot;
    agentCraft.AgentRecipeInfo = AgentRecipeInfo;
    agentCraft.AgentFinder = AgentFinder;
    return agentCraft;
  }
}
