function CollectionRecipe(recipes) {
  this.recipes = recipes

  this.first = () => this.recipes.length ? this.recipes : null
  this.isEmpty = () => this.recipes.length <= 0
}

function AgentRecipeInfo () {
  this.mcData = null
  this.bot = null

  this.findRecipe = (name, craftingTable) => this.findAllRecipe(name, craftingTable).first()

  this.findAllRecipe = (name, craftingTable) => {
    const item = this.mcData.itemsByName[name]
    const recipes = item ? new this.bot.recipesAll(item.id, 1, craftingTable) : [];
    return new CollectionRecipe(recipes)
  }
}

module.exports = {
  AgentRecipeInfoBuilder: (bot, mcData) => {
    let agentRecipeInfo = new AgentRecipeInfo()
    agentRecipeInfo.mcData = mcData
    agentRecipeInfo.bot = bot

    return agentRecipeInfo
  }
}
