function CollectionRecipe(recipes) {
  this.recipes = recipes
  this.recipeItems = null
  this.items = null

  this.first = () => this.recipes.length ? this.recipes : null
  this.isEmpty = () => this.recipes.length <= 0

  this.applyFilterItemsRecipes = () => {
    this.recipeItems = this.recipes.map((recipe) => {
      return recipe.delta.filter(recipe => recipe.count < 0)
    })
  }

  this.findItemRecipeIds = () => {
    const listIds = this.recipes.map((recipe) => {
      return recipe.delta.filter(recipe => recipe.count <= 0)
          .map(recipe => recipe.id)
    })
    let ids = []
    listIds.forEach(item => ids = ids.concat(item))
    return ids.filter(function(elem, pos) {
      return ids.indexOf(elem) === pos;
    })
  }

}

function AgentRecipeInfo () {
  this.mcData = null
  this.bot = null

  this.findRecipe = (name, craftingTable) => this.findAllRecipe(name, craftingTable).first()

  this.findAllRecipe = (name, craftingTable) => {
    const item = this.mcData.itemsByName[name]
    const recipes = item ? new this.bot.recipesAll(item.id, 1, craftingTable) : [];
    const collectionRecipe = new CollectionRecipe(recipes)
    const ids = collectionRecipe.findItemRecipeIds()
    collectionRecipe.items = ids.map(id => this.mcData.items[id])

    return collectionRecipe
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
