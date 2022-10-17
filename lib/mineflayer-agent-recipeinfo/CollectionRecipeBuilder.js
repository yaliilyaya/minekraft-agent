const {CollectionRecipe} = require("./CollectionRecipe");

function CollectionRecipeBuilder(mcData) {
    this.mcData = mcData


    this.create = (recipes) => {

        const collectionRecipe = new CollectionRecipe(recipes)

        this.setRecipeItem(collectionRecipe)
        this.setItemInRecipeItem(collectionRecipe)
        this.setRecipeGroup(collectionRecipe)

        return collectionRecipe
    }

    this.setRecipeItem = function (collectionRecipe) {
        const ids = collectionRecipe.findItemRecipeIds()
        collectionRecipe.items = ids.map(id => this.mcData.items[id]);

        console.log(collectionRecipe.items)
    }

    this.setItemInRecipeItem = function (collectionRecipe) {

        let itemsById = {}
        collectionRecipe.items.forEach(item => itemsById[item.id] = item)

        collectionRecipe.recipes.forEach(recipe => {
            recipe.delta.forEach(recipeItem => recipeItem.item = itemsById[recipeItem.id])
        })
    }

    this.setRecipeGroup = function (collectionRecipe) {
        collectionRecipe.groupRecipes = collectionRecipe.recipes.map(recipe => {
            let recipeGroup = {
                recipe: recipe,
                list: {}
            }
            recipe.delta.filter(recipe => recipe.count <= 0)
                .forEach(recipeItem => {
                    const name = !!recipeItem.item.group
                        ? recipeItem.item.group
                        : recipeItem.item.name

                    recipeGroup.list[name] = recipeItem.count * -1
                })

            return recipeGroup
        })

        console.log(collectionRecipe.groupRecipes)
    }
}

module.exports = {
    CollectionRecipeBuilder: CollectionRecipeBuilder
}