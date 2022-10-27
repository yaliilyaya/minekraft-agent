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

        for (let position of searchPositions) {
            const sliceArea = buildArea.clone()
            sliceArea.plus(position)

            console.log(sliceArea.getCenter(), sliceArea.toString())
            const foundationPlace = foundationCollection.getSlicePlace(sliceArea)

        }
        console.log(searchArea.toString())
        console.log(buildArea.toString())
        console.log(searchPositions)
        return null
    }

    this.extractSearchPositions = function (searchArea, buildArea) {
        const center = searchArea.getCenter()

        const area = searchArea.clone()
        area.end.x -= buildArea.end.x
        area.end.z -= buildArea.end.z

        const positions = area.getPositionArea()

        positions.sort((a, b) => a.distanceTo(center) - b.distanceTo(center))
        return positions
    }
}


module.exports = {
    FoundationPlaceService: FoundationPlaceService
}