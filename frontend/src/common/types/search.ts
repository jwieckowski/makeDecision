import actions from '../actionTypes/search'

export interface QueryItem {
    query: string
}

export interface SearchState {
    query: string
}

export interface QueryChange {
    type: typeof actions.QUERY_CHANGE,
    payload: QueryItem
}


