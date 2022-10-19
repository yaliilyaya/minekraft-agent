const {RecipeCollectionBuilder} = require("./RecipeCollectionBuilder");

function AgentRecipeInfo () {
  this.mcData = null
  this.bot = null
  this.recipeCollectionBuilder = null
  this.AgentItemInfo = null

  this.init = () => {
    this.recipeCollectionBuilder = new RecipeCollectionBuilder(this.mcData)
  }

  this.findRecipe = (name) => this.findAllRecipe(name).first()

  this.findAllRecipe = (name) => {

    const ids = this.AgentItemInfo.findAllIdsByName(name)
    const dataRecipes = ids.map(id => this.bot.recipesAll(id, 1, true))

    let recipes = [];
    dataRecipes.forEach(recipeGroup => recipes = recipes.concat(recipeGroup))

    return this.recipeCollectionBuilder.create(recipes)
  }
}

module.exports = {
  AgentRecipeInfoBuilder: (bot, mcData, AgentItemInfo) => {
    let agentRecipeInfo = new AgentRecipeInfo()
    agentRecipeInfo.AgentItemInfo = AgentItemInfo
    agentRecipeInfo.mcData = mcData
    agentRecipeInfo.bot = bot
    agentRecipeInfo.init()

    return agentRecipeInfo
  }
}
