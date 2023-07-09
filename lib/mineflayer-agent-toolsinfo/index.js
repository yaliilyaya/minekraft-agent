const {groupToolsInfo} = require("./groupToolsInfo");
const {toolsByBlock} = require("./toolsByBlock");

function AgentToolsInfo (mcData) {
  this.mcData = mcData

  this.findToolsByName = (name) => {
    return groupToolsInfo[name] !== undefined
      ? groupToolsInfo[name]
      : [name]
  }
  this.findToolByBlock = (blockName) => {
    return toolsByBlock[blockName] !== undefined
      ? toolsByBlock[blockName]
      : null
  }
}

module.exports = {
  AgentToolsInfo: AgentToolsInfo
}
