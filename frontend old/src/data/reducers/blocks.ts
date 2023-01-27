import actions from '../../common/actionTypes/blocks'
import { AnyAction, Reducer } from 'redux'
import { BlockState } from '../../common/types/blocks'

const initialState: BlockState = {
    blocks: []
}

const blocks: Reducer<BlockState> = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case actions.BLOCK_ADD:
            return {
                ...state,
                blocks: [...state.blocks, {
                    ...action.payload,
                    _id: state.blocks.length === 0 ? 1 : Math.max(...state.blocks.map(block => block._id))+1
                    }
                ]
            }
        case actions.BLOCK_DELETE:
            return {
                ...state,
                blocks: state.blocks.filter(block => action.payload._id !== block._id)
            }
        case actions.BLOCK_UPDATE_POSITION:
            return {
                ...state,
                blocks: state.blocks.map(block => {
                    if (block._id !== action.payload._id) return block

                    return {
                        ...block,
                        position: action.payload.position
                    }
                })
            }
        default:
            return {
                ...state
            }
    }
}

export default blocks