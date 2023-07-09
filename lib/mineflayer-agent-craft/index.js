function AgentCraft (bot, AgentRecipeInfo, AgentFinder) {
  this.bot = bot;
  this.AgentFinder = AgentFinder;
  this.AgentRecipeInfo = AgentRecipeInfo;

  /**
   * @deprecated use AgentRecipeInfo
   * @param name
   * @returns {Promise<*>}
   */
  this.findRecipe = async (name) => this.AgentRecipeInfo.findRecipe(name, true)

  /**
   * @deprecated use AgentRecipeInfo.findAllRecipe
   * @param name
   * @returns {Promise<*>}
   */
  this.findAllRecipe = async (name) => this.AgentRecipeInfo.findAllRecipe(name)

  this.craft = async (recipe, amount) => {
    let craftingTable = null
    if (recipe.requiresTable ) {
      craftingTable = await this.AgentFinder.findCraftingTable();
    }
    try {
      if (craftingTable) {
        console.log(`начинаю создание ${recipe.result.item.name} на верстаке`)
      } else {
        console.log(`начинаю создание ${recipe.result.item.name} в инвентаре`)
      }

      await this.bot.craft(recipe, amount, craftingTable)
      console.log(`Успешно создал ${recipe.result.item.name} в количестве ${amount}`)
    } catch (err) {
      console.log(`Не смог создать ${recipe.result.item.name}`)
      console.log(err)
      return false
    }

    return true
  }

  this.craftItemByName = async (name, amount) => {
    this.recipe = await this.findRecipe(name)
    await this.craft(this.recipe, amount)
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
  AgentCraft:AgentCraft
}
