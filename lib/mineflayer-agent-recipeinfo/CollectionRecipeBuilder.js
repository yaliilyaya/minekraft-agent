const {CollectionRecipe} = require("./CollectionRecipe");
const hash = require('object-hash');

function CollectionRecipeBuilder(mcData) {
    this.mcData = mcData

    this.create = (recipes) => {
        const collectionRecipe = new CollectionRecipe(recipes)

        this.setRecipeItem(collectionRecipe)
        this.setItemInRecipeItem(collectionRecipe)
        this.setGroupItemInRecipes(collectionRecipe)
        this.setGroupRecipes(collectionRecipe)

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
    this.setGroupRecipes = (collectionRecipe) => {

        let groupRecipes = {}

        collectionRecipe.recipes.forEach((recipe) => {
            const exist = !!groupRecipes[recipe.hash]
            if (!exist) {
                groupRecipes[recipe.hash] = {
                    recipes: [recipe],
                    list: recipe.itemGroup
                }
            } else {
                groupRecipes[recipe.hash].recipes.push(recipe)
            }
        })

        collectionRecipe.groupRecipes = Object.entries(groupRecipes).map(item => item[1])
    }
}

module.exports = {
    CollectionRecipeBuilder: CollectionRecipeBuilder
}