import actions from '../../common/actionTypes/menu'
import {
    MenuOpen,
    MenuClose,
    MethodsMenuOpen,
    MethodsMenuClose
} from '../../common/types/menu'


export const menuOpen = (): MenuOpen => ({
    type: actions.MENU_OPEN
}) 
    
export const menuClose = (): MenuClose => ({
    type: actions.MENU_CLOSE
})

export const methodsMenuOpen = (): MethodsMenuOpen => ({
    type: actions.MENU_METHODS_OPEN
})

export const methodsMenuClose = (): MethodsMenuClose => ({
    type: actions.MENU_METHODS_CLOSE
})
