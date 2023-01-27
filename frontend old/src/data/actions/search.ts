import actions from '../../common/actionTypes/search'
import {
    QueryItem,
    QueryChange
} from '../../common/types/search'


export const queryChange = (
    payload: QueryItem
): QueryChange => {
    return {
        type: actions.QUERY_CHANGE,
        payload
    } 
}