import actions from '../actionTypes/blocks'

export interface PositionItem {
    x: number,
    y: number
}

export interface BlockItem {
    _id: number,
    position: PositionItem
    type: string,
    method: string,
}

export interface AddBlockItem {
    position: PositionItem
    type: string,
    method: string,
}

export interface BlockState {
    blocks: BlockItem[]
}

export interface UpdateBlockPositionItem {
    _id: number,
    position: PositionItem
}

export interface AddBlock {
    type: typeof actions.BLOCK_ADD,
    payload: AddBlockItem
}
export interface DeleteBlock {
    type: typeof actions.BLOCK_DELETE,
    payload: BlockItem
}

export interface UpdateBlockPosition {
    type: typeof actions.BLOCK_UPDATE_POSITION,
    payload: UpdateBlockPositionItem
}


