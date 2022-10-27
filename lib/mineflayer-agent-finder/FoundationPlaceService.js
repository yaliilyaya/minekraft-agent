const vec3 = require("vec3");

/**
 * Осуществляет поиск подходящей зоны для строительства по foundationCollection
 * @constructor
 */
function FoundationPlaceService() {
    /**
     * Поиск пригодной области необходимо делать от центра
     * желательно отступить от центра пол зоны поиска, чтобы центр поиска здания совпадал с центром зоны поиска
     * поиск нужно осуществлять по квадратам с отдолением от центра
     * для упрощения перебора вероятнее всего нужно составить массив с позициями начала проверки
     * @param searchArea
     * @param buildArea
     * @param foundationCollection
     */
    this.findPlace = (searchArea, buildArea, foundationCollection) => {
        const center = searchArea.getCenter()



    }
}


module.exports = {
    FoundationPlaceService: FoundationPlaceService
}