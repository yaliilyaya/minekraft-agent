const Enumerable = require('node-enumerable')
const { Vec3 } = require('vec3')

function DigDirtStrategy() {
  this.apply = (finderResult) => {
    finderResult.range = [8, 10, 20, 50, 100, 500, 1000];
    finderResult.find()
        .sortByBotPosition();
  }
}

function DigDefaultStrategy() {
  this.apply = (finderResult) => {
    finderResult.range = [8, 10, 20, 50, 100, 500, 1000];
    finderResult.startPosition = null;
    finderResult.find()
  }
}
/**
 * Выносим запрос в конфигурацтию конфигурация должна настраиваться относительно стратегии добычи или поиска
 * TODO:: исключать блоки из поиска если они контактируют с водой, и лавой. проблемы возникнут с песком, и др сыпусими материалами
 * @param resource
 * @constructor
 */
function BlockFinderResult(resource) {
  this.resource = resource;
  this.result = [];
  //TODO:: вообще нужно внедрить поиск по названиям и по группе блоков
  this.blockIds = [];
  this.range = [128];
  this.startPosition = null;
  this.botPosition = null;
  this.count = 100;

  this.find = () => {
    for (const maxDistance of Enumerable.from(this.range)) {
      console.log(`find block ${this.blockIds} in range ${maxDistance}`)
      this.result = this.resource({
        matching: this.blockIds,
        maxDistance,
        count: this.count,
        point: this.startPosition
      })
      //this.filterDigBlock()
      if (this.result.length > 0) {
        return this;
      }
    }
    this.result = []
    return this;
  }

  this.filterDigBlock = () => {
    const floorBlock = new Vec3(
        Math.floor(this.botPosition.x),
        Math.floor(this.botPosition.y),
        Math.floor(this.botPosition.z)
    )

    return this.result.filter((block) => {
      return !(
          floorBlock.x === block.x &&
          floorBlock.y <= block.y + 2 &&
          floorBlock.z === block.z
      )
    })
  }

  this.sortByBotPosition = () => {
    this.result.sort((a, b) => {
      const aDepth = Math.round(this.botPosition.y - a.y)
      const aDist = a.distanceTo(this.botPosition) + (aDepth > 0 ? 5 : 0)

      const bDepth = Math.round(this.botPosition.y - b.y)
      const bDist = b.distanceTo(this.botPosition) + (bDepth > 0 ? 5 : 0)

      return aDist - bDist
    })
    return this;
  }

  this.first = () => this.result ? this.result.shift() : null

}

function AgentFinder () {
  this.bot = null
  this.mcData = null

  this.findAllIdById = (blockIds) => {
    const botPosition = this.bot.entity.position
    let finderResult = new BlockFinderResult(this.bot.findBlocks);
    finderResult.botPosition = botPosition;
    finderResult.blockIds = blockIds;

    return finderResult
  }

  this.findStrategy = (blockName) => {
    switch (blockName)
    {
      case 'dirt': return new DigDirtStrategy();
    }
    return new DigDefaultStrategy();
  }
}

module.exports = {
  AgentFinderBuilder: (bot) => {
    const agentFinder = new AgentFinder()
    agentFinder.bot = bot
    return agentFinder
  }
}
