const { Movements } = require('mineflayer-pathfinder')
const {foundation} = require("./foundation");
const {BuildArea} = require("./BuildArea");
const vec3 = require("vec3");
const {FoundationBlockCollectionBuilder} = require("./FoundationBlockCollectionBuilder");
const {SearchAreaBuilder} = require("./SearchAreaBuilder");
const {FoundationPlaceService} = require("./FoundationPlaceService");

function FoundationPlaceFinder(bot, mcData) {
    this.bot = bot
    this.mcData = mcData
    //TODO:: есть проблема в получении заранее инфы о блоке ибо функция getBlock
    this.Movements =  new Movements(this.bot)
    this.FoundationBlockCollectionBuilder = null
    this.FoundationPlaceService = null

    this.init = () => {
        foundation(this.mcData)
        this.SearchAreaBuilder = new SearchAreaBuilder()
        this.FoundationPlaceService = new FoundationPlaceService()
        this.FoundationBlockCollectionBuilder = new FoundationBlockCollectionBuilder(
            this.Movements,
            this.bot.world,
            this.mcData,
            this.bot
        )
    }

    /**
     * Определить облясть поиска - область поиска определяется по высоте позиции агента
     * а так же 3 области ширины здания от позиции агента в разные стороны
     * нужно найти все блоки по поисковой площади в высоту одного блока
     * для каждого блока необходимо определить FoundationBlock
     * и заполнить его нужной информацией
     * FoundationBlock ищеться по следующим правилам: для каждого поискового блока по площади
     * мы определяем воздух это или нет (так же нужно учесть что дерево и лисва также не является блоком основани)
     * если блок воздух то ищем основкние в низ (склон идёт вниз)
     * если блок не воздух то ищем в верх (склон идёт вверх)
     * не обрабатываем пещеры, если встречаются блоки воды то их нужно пометить как плохой блок
     * на плохих боках нельзя строить
     * по итогу должны получиться масив FoundationBlock которые нужно будет проанализировать по высоте
     * и необходимо найти будет поверхность для выравнивания
     * на этом этапе необходимо визуализировать полученный массив с блоками в prismarine-schematic
     * @param position
     * @param buildArea
     */
    this.findFoundationPlace = function (position, buildArea)
    {
        const searchArea = this.SearchAreaBuilder.create(position, buildArea)

        console.log(`buildArea - ${buildArea.toString()}`)
        console.log(`searchArea - ${searchArea.toString()}`)

        const foundationCollection = this.FoundationBlockCollectionBuilder.create(searchArea)

        const place = this.FoundationPlaceService.findPlace(searchArea, buildArea, foundationCollection)

        return place
    }
}


module.exports = {
    FoundationPlaceFinder: FoundationPlaceFinder
}