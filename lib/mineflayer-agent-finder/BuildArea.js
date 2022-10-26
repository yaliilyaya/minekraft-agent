const vec3 = require("vec3");

function BuildArea() {
    this.begin = new vec3(0, 0, 0)
    this.end = new vec3(0, 0, 0)

    this.getCenter = () => null
    this.getHeight = () => this.end.y - this.begin.y
    this.getWidth = () => this.end.x - this.begin.x
    this.getLength = () => this.end.z - this.begin.z
    this.getScale = () => new vec3(this.getWidth(), this.getHeight(), this.getLength())

    this.clone = () => {
        const buildArea = new BuildArea()
        buildArea.begin = this.begin.clone()
        buildArea.end = this.end.clone()

        return buildArea
    }
    this.toString = () => {
        const beginString = `{${this.begin.x};${this.begin.y};${this.begin.z}}`
        const endString = `{${this.end.x};${this.end.y};${this.end.z}}`
        return `BuildArea begin:${beginString}, end:${endString}, scale:${this.getScale()}`
    }
}


module.exports = {
    BuildArea: BuildArea
}