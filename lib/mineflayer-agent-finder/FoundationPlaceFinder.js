const { Movements } = require('mineflayer-pathfinder')
const {foundation} = require("./foundation");

function FoundationPlaceFinder(bot, mcData) {
    this.bot = bot
    this.mcData = mcData
    //TODO:: есть проблема в получении заранее инфы о блоке ибо функция getBlock
    this.Movements =  new Movements(this.bot)

    this.init = () => {
        foundation(this.mcData)
    }

}


module.exports = {
    FoundationPlaceFinder: FoundationPlaceFinder
}