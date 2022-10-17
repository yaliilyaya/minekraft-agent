function CollectionRecipe(recipes) {
    let that = this
    this.recipes = recipes
    this.items = []
    this.groupRecipes = []

    this.first = () => this.recipes.length ? this.recipes : null
    this.isEmpty = () => this.recipes.length <= 0

    this.findItemRecipeIds = () => {
        const listIds = this.recipes.map((recipe) => {
            return recipe.delta//.filter(recipe => recipe.count <= 0)
                .map(recipe => recipe.id)
        })
        let ids = []
        listIds.forEach(item => ids = ids.concat(item))
        return ids.filter((elem, pos) => ids.indexOf(elem) === pos)
    }
}

module.exports = {
    CollectionRecipe: CollectionRecipe
}