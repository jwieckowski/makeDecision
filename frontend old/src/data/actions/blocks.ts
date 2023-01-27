import actions from '../../common/actionTypes/blocks'
import {
    AddBlock,
    DeleteBlock,
    UpdateBlockPosition,
    AddBlockItem,
    BlockItem,
    UpdateBlockPositionItem
} from '../../common/types/blocks'


export const addBlock = (
    payload: AddBlockItem
): AddBlock => {
    return {
        type: actions.BLOCK_ADD,
        payload
    }
}

export const deleteBlock = (
    payload: BlockItem
): DeleteBlock => {
    return {
        type: actions.BLOCK_DELETE,
        payload
    }
}

export const updateBlockPosition = (
    payload: UpdateBlockPositionItem
): UpdateBlockPosition => {
    return {
        type: actions.BLOCK_UPDATE_POSITION,
        payload
    }
}
