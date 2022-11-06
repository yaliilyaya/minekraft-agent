function RecipeCollection(recipes) {
    let that = this
    this.recipes = recipes
    this.items = []
    this.abstractRecipes = []

    this.first = () => this.recipes.length ? this.recipes[0] : null
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

    this.findHashes = () => {
        const listHashes = this.recipes.map((recipe) => {
            return recipe.hash
        })
        let hashes = []
        listHashes.forEach(item => hashes = hashes.concat(item))
        return hashes.filter((elem, pos) => hashes.indexOf(elem) === pos)
    }

    this.findFirstRecipeItemNames = () => {
        let items = this.first().itemGroup

        return Object.entries(items).map((item) => {
            return {
                name:item[0],
                count:item[1]
            }
        })
    }
}

module.exports = {
    RecipeCollection: RecipeCollection
}