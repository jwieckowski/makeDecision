import { useMemo } from 'react';
import { RootState, useAppDispatch } from '../redux';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack'

import { 
  getFilteredMethods, 
  getMethodData,
  getSingleItemByName
} from '../utilities/filtering';
import { getBlocksOfType } from '../utilities/blocks';
import { 
  addConnection,
  deleteConnection,
  setClickedBlocks
} from '../redux/slices/blocksSlice';

import { HIDE_DURATION } from '../common/const';

export default function useBlocksConnection() {
  const { allMethods} = useSelector((state: RootState) => state.dictionary)
  const { blocks, clickedBlocks, connections } = useSelector((state: RootState) => state.blocks)
  const fuzzyMethods = useMemo(() => allMethods.length > 0 ? getFilteredMethods(getMethodData(allMethods, 'method'), 'fuzzy') : [], [])
  
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar();

  const addBlockConnection = () => {
    if (clickedBlocks.length === 2) {
      if (connections.filter(c => c[0] === clickedBlocks[0] && c[1] === clickedBlocks[1]).length === 0) {
        const inputBlock = blocks.filter(b => b._id === +clickedBlocks[0])[0]
        const outputBlock = blocks.filter(b => b._id === +clickedBlocks[1])[0]

        if (inputBlock === undefined || outputBlock === undefined) return
        
        if (outputBlock.inputConnections.includes(inputBlock.type as never)) {
          // check for only one ranking connection
          if (outputBlock.type === 'ranking') {
            const outConnections = connections.filter(c => c[0] === inputBlock._id.toString()).map(c => c[1])
            const rankingBlocks = blocks.filter(block => block.type === 'ranking')
            
            if (outConnections.filter(c => rankingBlocks.map(b => b._id).includes(+c)).length === 0) {
              dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]))
            } else {
              enqueueSnackbar('Metodę można połączyć tylko z jednym rankingiem', {variant: 'error', 'autoHideDuration': HIDE_DURATION});
              
            }
          } else if (outputBlock.type === 'correlation') {
            const requiredData = getSingleItemByName(getMethodData(allMethods, 'correlation'), outputBlock.method).requiredData
            // method->correlation
            if (requiredData.includes('preferences' as never)) {
              if (inputBlock.type !== 'method') {
                enqueueSnackbar('Ta metoda korelacji służy do obliczenia podobieństw preferencji, nie rankingów', {variant: 'error', 'autoHideDuration': HIDE_DURATION});
              } else {
                dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]))
              }
            }
            // ranking-> correlation
            if (requiredData.includes('ranking' as never)) {
              if (inputBlock.type !== 'ranking') {
                enqueueSnackbar('Ta metoda korelacji służy do obliczenia podobieństw rankingów, nie preferencji', {variant: 'error', 'autoHideDuration': HIDE_DURATION});
              } else {
                dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]))
              }
            }
          } else {
            dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]))
          }
        } else {
          enqueueSnackbar('Nie można połączyc bloczków', {variant: 'error', 'autoHideDuration': HIDE_DURATION});
        }
      }
      dispatch(setClickedBlocks([clickedBlocks[1]]))
    }
  }

  const checkForWrongExtensionMethodConnection = (connections: [] | string[][]) => {
    getBlocksOfType(blocks, 'matrix').forEach((matrix, idx) => {
      let weightsID: [] | string[] = []
      // save weights id
      connections.forEach(c => {
        if (c[0] === matrix._id.toString()) {
          weightsID = [...weightsID, c[1]]
        }
      })

      weightsID.forEach(w => {
        connections.forEach(c => {
          if (c[0] === w) {
            const methodBlock = blocks.filter(b => b._id === +c[1])[0]
            if (matrix.data.extension === 'fuzzy') {
              if (!fuzzyMethods.map(m => m.name.toLowerCase()).includes(methodBlock.method.toLowerCase())) {
                enqueueSnackbar(`Metoda ${methodBlock.method.toUpperCase()} nie może byc połączona z danymi w formie fuzzy. Połączenie zostanie usunięte`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
                dispatch(deleteConnection(c))
              }
            }
          } 
        })
      })
    })
  }

  return { 
    addBlockConnection, 
    checkForWrongExtensionMethodConnection
  }
}