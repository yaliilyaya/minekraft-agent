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

const itemInfo = {
  oak_log: {
    digLevel: -1
  },
  dark_oak_log: {
    digLevel: -1
  },
  birch_log: {
    digLevel: -1
  },
  spruce_log: {
    digLevel: -1
  },
  jungle_log: {
    digLevel: -1
  },
  acacia_log: {
    digLevel: -1
  }
}

module.exports = {
  McDataBuilder: McDataBuilder
}
