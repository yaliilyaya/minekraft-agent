const vec3 = require("vec3");
const {BuildArea} = require("./BuildArea");

function SearchAreaBuilder() {
    this.searchAreaMultiplier = 3


    this.create = (position, buildArea) => {
        const positionInt = new vec3(
            Math.ceil(position.x),
            Math.ceil(position.y),
            Math.ceil(position.z)
        )

        const searchArea = new BuildArea()

        // увеличиваем зону поиска по площади
        searchArea.begin = buildArea.end.clone()
        searchArea.begin.scale(-1 * this.searchAreaMultiplier)
        searchArea.begin.y = -1

        searchArea.end = buildArea.end.clone()
        searchArea.end.scale(this.searchAreaMultiplier)
        searchArea.end.y = buildArea.getHeight() - 1

        // переносим зону на позицию игрока
        searchArea.begin.add(positionInt)
        searchArea.end.add(positionInt)

        return searchArea
    }
}


module.exports = {
    SearchAreaBuilder: SearchAreaBuilder
}