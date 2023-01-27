import { combineReducers } from 'redux'

import blocks from '../../data/reducers/blocks'
import menu from '../../data/reducers/menu'
import search from '../../data/reducers/search'

const rootReducer = combineReducers({
    blocks,
    menu,
    search
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer