const vec3 = require("vec3");

function BuildArea(mcData) {
    this.begin = new vec3(0, 0, 0)
    this.end = new vec3(0, 0, 0)

    this.getCenter = () => null
    this.getHeight = () => 0
}


module.exports = {
    BuildArea: BuildArea
}