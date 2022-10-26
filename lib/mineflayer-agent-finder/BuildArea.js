const vec3 = require("vec3");

function BuildArea(mcData) {
    this.begin = new vec3(0, 0, 0)
    this.end = new vec3(0, 0, 0)

    this.getCenter = () => null
    this.getHeight = () => this.end.y - this.begin.y

    this.toString = () => {
        const beginString = `{${this.begin.x};${this.begin.y};${this.begin.z}}`
        const endString = `{${this.end.x};${this.end.y};${this.end.z}}`
        return `BuildArea begin:${beginString}, end:${endString}, height:${this.getHeight()}`
    }
}


module.exports = {
    BuildArea: BuildArea
}