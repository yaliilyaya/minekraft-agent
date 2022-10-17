const {RecipeCollectionBuilder} = require("./RecipeCollectionBuilder");

function AgentRecipeInfo () {
  this.mcData = null
  this.bot = null
  this.recipeCollectionBuilder = null

  this.init = () => {
    this.recipeCollectionBuilder = new RecipeCollectionBuilder(this.mcData)
  }

  this.findRecipe = (name, craftingTable) => this.findAllRecipe(name, craftingTable).first()

  this.findAllRecipe = (name, craftingTable) => {
    const item = this.mcData.itemsByName[name]
    const recipes = item ? new this.bot.recipesAll(item.id, 1, craftingTable) : [];

    return this.recipeCollectionBuilder.create(recipes)
  }
}

module.exports = {
  AgentRecipeInfoBuilder: (bot, mcData) => {
    let agentRecipeInfo = new AgentRecipeInfo()
    agentRecipeInfo.mcData = mcData
    agentRecipeInfo.bot = bot
    agentRecipeInfo.init()

    return agentRecipeInfo
  }
}
