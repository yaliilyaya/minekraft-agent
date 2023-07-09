const {RecipeCollectionBuilder} = require("./RecipeCollectionBuilder");

function AgentRecipeInfo (bot, mcData, AgentItemInfo) {
  this.bot = bot
  this.mcData = mcData
  this.recipeCollectionBuilder = null
  this.AgentItemInfo = AgentItemInfo

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
  AgentRecipeInfo: AgentRecipeInfo
}
