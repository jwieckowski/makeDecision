import actions from '../../common/actionTypes/search'
import { AnyAction, Reducer } from 'redux'
import { SearchState } from '../../common/types/search'

const initialState: SearchState = {
    query: ''
}

const search: Reducer<SearchState> = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case actions.QUERY_CHANGE: 
            return {
                ...state,
                query: action.payload.query
            };
        default:
            return {
                ...state
            }
    }
}

export default search