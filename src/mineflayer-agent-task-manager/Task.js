/**
 * @constructor
 */
function Task () {
    this.isCompleted = false
    /** добыча, создание, строительство, ремонт */
    this.type = null
    // TODO:: Для облегчения реализации таски будут содержать только одну часть
    this.parts = []
    /** есть блоки а есть элементы */
    this.addPart = (blockName, count) => {
        // this.parts.push({
        //   'blockIds': [12321312, 12312321],
        //   'itemIds': [12321312, 12312321],
        //   'itemNames': ['adsdsadsa', 'asdasdas'],
        //   'blockNames': ['adsdsadsa', 'asdasdas'],
        //   'buildTemplate': "sfdsdfsdfsd",
        //   'count': count,
        // })
    }

    this.toString = () => {
        const list = this.parts.map((part) => {
            return `${part.name} - ${part.count}`
        })
        return `Задача нужно ${this.type}: ` + list.join(', ')
    }
}
module.exports = {
    Task: Task
}
