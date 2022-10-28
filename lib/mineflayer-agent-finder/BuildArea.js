const vec3 = require("vec3");
const Enumerable = require("node-enumerable");

function BuildArea() {
    this.begin = new vec3(0, 0, 0)
    this.end = new vec3(0, 0, 0)

    this.getCenter = () => {
        const center = this.getScale().clone().scale(0.5)
        return this.begin.clone().plus(center)
    }

    this.getHeight = () => this.end.y - this.begin.y
    this.getWidth = () => this.end.x - this.begin.x
    this.getLength = () => this.end.z - this.begin.z
    this.getScale = () => this.end.clone().minus(this.begin)

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

    this.getPositionArea = () => {
        let list = []
        const xList = Enumerable.range(0, this.end.x - this.begin.x)

        for (let xPosition of xList) {
            const zList = Enumerable.range(0, this.end.z - this.begin.z)
            for (let zPosition of zList) {
                const vector = new vec3(
                    xPosition + this.begin.x,
                    this.begin.y,
                    zPosition + this.begin.z)

                list.push(vector)
            }
        }

        return list
    }

    this.plus = (position) => {
        this.begin.add(position)
        this.end.add(position)

        return this
    }
    /**
     * Осуществляет проверку вхождения X,Z
     * @param position
     * @returns {boolean}
     */
    this.equalsInPlace = (position) => {

        return this.begin.x <= position.x && position.x < this.end.x
            && this.begin.z <= position.z && position.z < this.end.z
    }
}


module.exports = {
    BuildArea: BuildArea
}