import actions from '../actionTypes/menu'

export interface MenuState {
    open: boolean
    methodsOpen: boolean
}

export interface MenuOpen {
    type: typeof actions.MENU_OPEN
}

export interface MenuClose {
    type: typeof actions.MENU_CLOSE
}

export interface MethodsMenuOpen {
    type: typeof actions.MENU_METHODS_OPEN
}

export interface MethodsMenuClose {
    type: typeof actions.MENU_METHODS_CLOSE
}


