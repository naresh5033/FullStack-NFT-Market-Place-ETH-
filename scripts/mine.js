const { moveBlocks } = require("../utils/move-blocks")

// This script we wana move our block, so we can bide some time for the event to get update on DB 
const BLOCKS = 5

async function mine() {
    await moveBlocks(BLOCKS)
}

mine()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
