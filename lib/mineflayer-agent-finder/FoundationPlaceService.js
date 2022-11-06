const vec3 = require("vec3");

/**
 * Осуществляет поиск подходящей зоны для строительства по foundationCollection
 * @constructor
 */
function FoundationPlaceService() {


    /**
     * Поиск пригодной области необходимо делать от центра
     * поиск нужно осуществлять по квадратам с отдолением от центра
     * для упрощения перебора вероятнее всего нужно составить массив с позициями начала проверки
     * @param searchArea
     * @param buildArea
     * @param foundationCollection
     */
    this.findPlace = (searchArea, buildArea, foundationCollection) => {
        const searchPositions = this.extractSearchPositions(searchArea, buildArea)

        // console.log(searchArea.toString())
        // console.log(buildArea.toString())

        for (let position of searchPositions) {
            const sliceArea = buildArea.clone()
            sliceArea.plus(position)

            const foundationPlace = foundationCollection.getSlicePlace(sliceArea)
            // выбираем самый первый результат, чтобы он был ближе к агенту
            if (foundationPlace.getHeight() <= 3 && !foundationPlace.hasBadBlock()) {
                console.log(
                    sliceArea.getCenter(),
                    sliceArea.toString(),
                    foundationPlace.getHeight()
                )
                return foundationPlace
            }
        }

        return null
    }

    this.extractSearchPositions = function (searchArea, buildArea) {
        const center = searchArea.getCenter()

        const area = searchArea.clone()
        area.end.x -= buildArea.end.x
        area.end.z -= buildArea.end.z

        const positions = area.getPositionArea()
        //TODO:: раскоментировать. нужно для поиска
        positions.sort((a, b) => a.distanceTo(center) - b.distanceTo(center))
        return positions
    }
}


module.exports = {
    FoundationPlaceService: FoundationPlaceService
}