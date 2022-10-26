function foundation(mcData) {
    mcData.blocksArray.forEach(block => block.info = !!block.info ? block.info : {}  )
    // деревья
    mcData.blocksByName.oak_wood.info.foundation = false
    mcData.blocksByName.oak_wood.info.foundation = false
    mcData.blocksByName.stripped_oak_wood.info.foundation = false
    mcData.blocksByName.spruce_wood.info.foundation = false
    mcData.blocksByName.stripped_spruce_wood.info.foundation = false
    mcData.blocksByName.birch_wood.info.foundation = false
    mcData.blocksByName.stripped_birch_wood.info.foundation = false
    mcData.blocksByName.jungle_wood.info.foundation = false
    mcData.blocksByName.stripped_jungle_wood.info.foundation = false
    mcData.blocksByName.acacia_wood.info.foundation = false
    mcData.blocksByName.stripped_acacia_wood.info.foundation = false
    mcData.blocksByName.dark_oak_wood.info.foundation = false
    mcData.blocksByName.stripped_dark_oak_wood.info.foundation = false
    mcData.blocksByName.oak_log.info.foundation = false
    mcData.blocksByName.dark_oak_log.info.foundation = false
    mcData.blocksByName.birch_log.info.foundation = false
    mcData.blocksByName.spruce_log.info.foundation = false
    mcData.blocksByName.jungle_log.info.foundation = false
    mcData.blocksByName.acacia_log.info.foundation = false
    mcData.blocksByName.stripped_oak_log.info.foundation = false
    mcData.blocksByName.stripped_spruce_log.info.foundation = false
    mcData.blocksByName.stripped_birch_log.info.foundation = false
    mcData.blocksByName.stripped_jungle_log.info.foundation = false
    mcData.blocksByName.stripped_acacia_log.info.foundation = false
    mcData.blocksByName.stripped_dark_oak_log.info.foundation = false
    //листва деревьев
    mcData.blocksByName.oak_leaves.info.foundation = false

    mcData.blocksByName.grass.info.foundation = false
    mcData.blocksByName.oxeye_daisy.info.foundation = false

    mcData.blocksByName.trapped_chest.info.foundation = false
    mcData.blocksByName.trapped_chest.info.badBuildingBlock = true
    mcData.blocksByName.crafting_table.info.foundation = false
    mcData.blocksByName.crafting_table.info.badBuildingBlock = true
}



module.exports = {
    foundation: foundation
}