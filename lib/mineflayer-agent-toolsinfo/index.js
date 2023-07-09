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

const groupToolsInfo = {
  hoe: [
    'netherite_hoe',
    'diamond_hoe',
    'iron_hoe',
    'stone_hoe',
    'wooden_hoe',
    'golden_hoe'
  ],
  shovel: [
    'netherite_shovel',
    'diamond_shovel',
    'iron_shovel',
    'stone_shovel',
    'wooden_shovel',
    'golden_shovel'
  ],
  pickaxe: [
    'netherite_pickaxe',
    'diamond_pickaxe',
    'iron_pickaxe',
    'stone_pickaxe',
    'wooden_pickaxe',
    'golden_pickaxe'
  ],
  axe: [
    'netherite_axe',
    'diamond_axe',
    'iron_axe',
    'stone_axe',
    'wooden_axe',
    'golden_axe'
  ]
}

const toolsByBlock = {
  dirt: 'shovel',
  grass_block: 'shovel',
  stone: 'pickaxe',
  grass: 'hoe',
  log: 'axe',
  oak_log: 'axe'
}

module.exports = {
  AgentToolsInfo: AgentToolsInfo
}
