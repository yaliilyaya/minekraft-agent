const {itemInfo} = require("./itemInfo");

function McDataBuilder () {
  //TODO:: нужно оптимизировать эту хрень
  this.create = (mcData) => {
    const items = Object.entries(itemInfo)
    items.forEach(item => {
      const name = item[0]
      const itemMcData = mcData.itemsByName[name]
      Object.entries(item[1]).forEach(data => itemMcData[data[0]] = data[1])
    })
  }
}



module.exports = {
  McDataBuilder: McDataBuilder
}
