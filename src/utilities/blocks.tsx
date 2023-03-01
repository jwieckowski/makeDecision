import { BlockType } from "../redux/types"

export const getNotConnectedBlocks = (blocks: [] | BlockType[], connections: [] | string[][]) => {
    return blocks.filter(block => connections.filter(c => c.includes(block._id.toString())).length === 0)
}

export const getBlocksOfType = (blocks: [] | BlockType[], type: string) => {
    return blocks.filter(b => b.type.toLowerCase() === type)
}