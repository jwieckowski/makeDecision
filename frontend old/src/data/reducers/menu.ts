import actions from '../../common/actionTypes/menu'
import { AnyAction, Reducer } from 'redux'
import { MenuState } from '../../common/types/menu'

const initialState: MenuState = {
    open: false,
    methodsOpen: false
}

const menu: Reducer<MenuState> = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case actions.MENU_OPEN: 
            return {
                ...state,
                open: true
            };
        case actions.MENU_CLOSE:
            return {
                ...state,
                open: false
            }
        case actions.MENU_METHODS_OPEN: 
            return {
                ...state,
                methodsOpen: true
            };
        case actions.MENU_METHODS_CLOSE:
            return {
                ...state,
                methodsOpen: false
            }
        default:
            return {
                ...state
            }
    }
}

export default menu