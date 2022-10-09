function CollectionRecipe(recipes) {
  let that = this
  this.recipes = recipes
  this.recipeItems = null

  this.first = () => this.recipes.length ? this.recipes : null
  this.isEmpty = () => this.recipes.length <= 0

  this.applyFilterItemsRecipes = () => {
    this.recipeItems = this.recipes.map((recipe) => {
      return recipe.delta.filter(recipe => recipe.count < 0)
    })
    return this
  }

  this.findItemRecipeIds = () => {
    const listIds = this.recipes.map((recipe) => {
      return recipe.delta//.filter(recipe => recipe.count <= 0)
          .map(recipe => recipe.id)
    })
    let ids = []
    listIds.forEach(item => ids = ids.concat(item))
      return ids.filter((elem, pos) => ids.indexOf(elem) === pos)
  }

  this.setItems = (items) => {
    let itemsById = {}
    items.forEach(item => itemsById[item.id] = item)
    this.recipes.forEach(recipe => {
      recipe.delta.forEach(recipeItem => recipeItem.item = itemsById[recipeItem.id])
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
    const items =  ids.map(id => this.mcData.items[id])
    collectionRecipe.setItems(items)

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
