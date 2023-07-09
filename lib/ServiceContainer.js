const {AgentInventory} = require("./mineflayer-agent-inventory");
const {Agent} = require("../src/mineflayer-agent");
const {AgentToolsInfo} = require("./mineflayer-agent-toolsinfo");
const {AgentItemInfo} = require("./mineflayer-agent-iteminfo");
const {AgentTaskManager} = require("../src/mineflayer-agent-task-manager");
const {AgentTask} = require("../src/mineflayer-agent-task");
const {JobContainer} = require("../job/JobContainer");
const {AgentTaskChecker} = require("../src/mineflayer-agent-task-checker");
const {AgentBlockInfo} = require("./mineflayer-agent-blockinfo");
const {AgentRecipeInfo} = require("./mineflayer-agent-recipeinfo");
const {AgentFinder} = require("./mineflayer-agent-finder");
const {AgentDig} = require("./mineflayer-agent-dig");
const {AgentCraft} = require("./mineflayer-agent-craft");
const {DigJob} = require("../job/DigJob");

function ServiceContainer()
{
    this.container = {}

    this.has = function (name) {
        return !!this.container[name]
    }

    this.set = (name, value) => {
        this.container[name] = value;
    }

    this.get = (name) => {
        switch (name) {
            case 'bot': return this.has(name)
                ? this.container.bot
                : this.container.bot = (() => {
                    return require('../index').createBot(
                        this.get('bot.config')
                    )
                })()
            case 'bot.config': return this.has(name)
                ? this.container['bot.config']
                : this.container['bot.config'] = (() => {
                    return {
                        host: this.get('config.host'), // optional
                        port:  this.get('config.port'), // optional
                        username:  this.get('config.username'), // E-mail и пароль используются для
                        version:  this.get('config.version') // При установленном значении false версия будет выбрана автоматически, используйте пример выше чтобы выбрать нужную версию
                    }
                })()
            case 'Agent': return this.has(name)
                ? this.container.Agent
                : this.container.Agent = (() => {
                    const agent = new Agent(
                        this.get('bot'),
                        this.get('mcData'),
                        this.get('AgentInventory'),
                        this.get('AgentTaskManager'),
                        this.get('AgentTask')
                    )
                    agent.connection();
                    return agent;
                })()
            case 'mcData': return this.has(name)
                ? this.container.mcData
                : this.container.mcData = (() => {
                    const version = this.get('config.version')
                    return require('minecraft-data')(version)
                })()
            case 'AgentInventory': return this.has(name)
                ? this.container.AgentInventory
                : this.container.AgentInventory = (() => {
                    const agentInventory = new AgentInventory(
                        this.get('bot'),
                        this.get('AgentToolsInfo'),
                        this.get('AgentItemInfo')
                    )
                    agentInventory.init()
                    return agentInventory
                })()
            case 'AgentToolsInfo': return this.has(name)
                ? this.container.AgentToolsInfo
                : this.container.AgentToolsInfo = new AgentToolsInfo(
                    this.get('mcData')
                )
            case 'AgentItemInfo': return this.has(name)
                ? this.container.AgentItemInfo
                : this.container.AgentItemInfo = (() => {
                    let agentItemInfo = new AgentItemInfo(
                        this.get('mcData')
                    )
                    agentItemInfo.init()
                    return agentItemInfo
                })()
            case 'AgentTaskManager': return this.has(name)
                ? this.container.AgentTaskManager
                : this.container.AgentTaskManager = new AgentTaskManager(
                    this.get('AgentTask'),
                    this.get('AgentTaskChecker')
                )
            case 'AgentTaskChecker': return this.has(name)
                ? this.container.AgentTaskChecker
                : this.container.AgentTaskChecker = new AgentTaskChecker(
                    this.get('JobContainer')
                )
            case 'AgentTask': return this.has(name)
                ? this.container.AgentTask
                : this.container.AgentTask = new AgentTask(
                    this.get('JobContainer')
                )
            case 'JobContainer': return this.has(name)
                ? this.container.JobContainer
                : this.container.JobContainer = new JobContainer(this)
            case 'AgentBlockInfo': return this.has(name)
                ? this.container.AgentBlockInfo
                : this.container.AgentBlockInfo = new AgentBlockInfo(
                    this.get('bot'),
                    this.get('mcData')
                )
            case 'AgentRecipeInfo': return this.has(name)
                ? this.container.AgentRecipeInfo
                : this.container.AgentRecipeInfo = (() => {
                    const agentRecipeInfo = new AgentRecipeInfo(
                        this.get('bot'),
                        this.get('mcData'),
                        this.get('AgentItemInfo'),
                    )
                    agentRecipeInfo.init()
                    return agentRecipeInfo
                })()
            case 'AgentFinder': return this.has(name)
                ? this.container.AgentFinder
                : this.container.AgentFinder = (() => {
                    const agentFinder = new AgentFinder(
                        this.get('bot'),
                        this.get('mcData')
                    )
                    agentFinder.init()
                    return agentFinder
                })()
            case 'AgentDig': return this.has(name)
                ? this.container.AgentDig
                : this.container.AgentDig = new AgentDig(
                    this.get('bot'),
                    this.get('AgentFinder')
                )
            case 'AgentCraft': return this.has(name)
                ? this.container.AgentCraft
                : this.container.AgentCraft = new AgentCraft(
                    this.get('bot'),
                    this.get('AgentRecipeInfo'),
                    this.get('AgentFinder')
                )
        }

        return !!this.container[name] ? this.container[name] : null
    }
}


module.exports = {
    ServiceContainer: ServiceContainer
}