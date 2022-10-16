const {CollectionRecipeBuilder} = require("./CollectionRecipeBuilder");

function AgentRecipeInfo () {
  this.mcData = null
  this.bot = null
  this.collectionRecipeBuilder = null

  this.init = () => {
    this.collectionRecipeBuilder = new CollectionRecipeBuilder(this.mcData)
  }

  this.findRecipe = (name, craftingTable) => this.findAllRecipe(name, craftingTable).first()

  this.findAllRecipe = (name, craftingTable) => {
    const item = this.mcData.itemsByName[name]
    const recipes = item ? new this.bot.recipesAll(item.id, 1, craftingTable) : [];

    return this.collectionRecipeBuilder.create(recipes)
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
