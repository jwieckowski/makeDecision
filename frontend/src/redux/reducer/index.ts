import { combineReducers } from 'redux'

import blocks from '../../data/reducers/blocks'
import menu from '../../data/reducers/menu'

const rootReducer = combineReducers({
    blocks,
    menu
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer