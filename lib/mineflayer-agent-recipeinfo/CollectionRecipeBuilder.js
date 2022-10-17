const {CollectionRecipe} = require("./CollectionRecipe");
const hash = require('object-hash');

function CollectionRecipeBuilder(mcData) {
    this.mcData = mcData

    this.create = (recipes) => {
        const collectionRecipe = new CollectionRecipe(recipes)

        this.setRecipeItem(collectionRecipe)
        this.setItemInRecipeItem(collectionRecipe)
        this.setRecipeGroup(collectionRecipe)

        console.log(collectionRecipe.groupRecipes)
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

    this.setRecipeGroup = (collectionRecipe) => {
        collectionRecipe.groupRecipes = collectionRecipe.recipes.map(recipe => {
            let recipeGroup = {
                recipe: recipe,
                list: this.extractGroup(recipe.delta)
            }
            recipeGroup.hash = hash(recipeGroup.list)
            return recipeGroup
        })
    }
}

module.exports = {
    CollectionRecipeBuilder: CollectionRecipeBuilder
}