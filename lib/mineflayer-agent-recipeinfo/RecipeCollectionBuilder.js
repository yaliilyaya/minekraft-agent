const hash = require('object-hash');
const {RecipeCollection} = require("./RecipeCollection");

function RecipeCollectionBuilder(mcData) {
    this.mcData = mcData

    this.create = (recipes) => {
        const collectionRecipe = new RecipeCollection(recipes)

        this.setRecipeItem(collectionRecipe)
        this.setItemInRecipeItem(collectionRecipe)
        this.setGroupItemInRecipes(collectionRecipe)
        this.setAbstractRecipes(collectionRecipe)

        return collectionRecipe
    }

    this.setRecipeItem = (collectionRecipe) => {
        const ids = collectionRecipe.findItemRecipeIds()
        collectionRecipe.items = ids.map(id => this.mcData.items[id]);
    }

    this.setItemInRecipeItem = function (collectionRecipe) {

        let itemsById = {}
        collectionRecipe.items.forEach(item => itemsById[item.id] = item)

        collectionRecipe.recipes.forEach(recipe => {
            recipe.delta.forEach(recipeItem => recipeItem.item = itemsById[recipeItem.id])
        })
    }

    this.extractGroup = (list) => {
        let recipeGroup = {}
        list.filter(recipe => recipe.count <= 0)
            .forEach(recipeItem => {
                const name = !!recipeItem.item.group
                    ? recipeItem.item.group
                    : recipeItem.item.name

                recipeGroup[name] = recipeItem.count * -1
            })

        return recipeGroup
    }

    /**
     * выбираем рецепты по группе
     * @param collectionRecipe
     */
    this.setGroupItemInRecipes = (collectionRecipe) => {
        collectionRecipe.recipes.forEach(recipe => {
            recipe.itemGroup = this.extractGroup(recipe.delta)
            recipe.hash = hash(recipe.itemGroup)
        })
    }

    /**
     * Грурпрует схожие рецепты которые схожи по ингриджиентам
     * @param collectionRecipe
     */
    this.setAbstractRecipes = (collectionRecipe) => {

        let abstractRecipes = {}

        collectionRecipe.recipes.forEach((recipe) => {
            const exist = !!abstractRecipes[recipe.hash]
            if (!exist) {
                abstractRecipes[recipe.hash] = {
                    recipes: [recipe],
                    list: recipe.itemGroup
                }
            } else {
                abstractRecipes[recipe.hash].recipes.push(recipe)
            }
        })

        collectionRecipe.abstractRecipes = Object.entries(abstractRecipes).map(item => item[1])
    }
}

module.exports = {
    RecipeCollectionBuilder: RecipeCollectionBuilder
}