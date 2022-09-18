const Enumerable = require('node-enumerable')
const {Vec3} = require("vec3");

function AgentFinder () {
  this.bot = null
  this.mcData = null;

  this.filterDigBlock = (blocks, botPosition) => {

    const floorBlock = new Vec3(
        Math.floor(botPosition.x),
        Math.floor(botPosition.y),
        Math.floor(botPosition.z)
    );

    return blocks.filter((block) => {
      return !(
          floorBlock.x === block.x
          && floorBlock.y <= block.y + 2
          && floorBlock.z === block.z
      )
    })
  }

  this.findBlocksIdByIdInRange = (blockIds, range = [128], startPosition = null) => {
    const botPosition = this.bot.entity.position;
    for (const maxDistance of Enumerable.from(range)) {
      console.log(`find block ${blockIds} in range ${maxDistance}`)
      let blocks = this.bot.findBlocks({
        matching: blockIds,
        maxDistance,
        count: 100,
        point: startPosition
      })
      blocks = this.filterDigBlock(blocks, botPosition);
      if (blocks.length > 0) {
        return blocks
      }
    }

    return []
  }

  this.findFirstBlock = (blocks, startPosition) => {
    const botPosition = this.bot.entity.position;

    blocks.sort((a, b) => {
      const aDepth = Math.round(botPosition.y - a.y);
      const aDist = a.distanceTo(botPosition) + (aDepth > 0 ? 5 : 0);

      const bDepth = Math.round(botPosition.y - b.y);
      const bDist = b.distanceTo(botPosition) +  (bDepth > 0 ? 5 : 0);

      return aDist - bDist
    })

    return blocks ? blocks.shift() : undefined
  }
}

module.exports = {
  AgentFinderBuilder: (bot) => {
    const agentFinder = new AgentFinder()
    agentFinder.bot = bot
    return agentFinder
  }
}
