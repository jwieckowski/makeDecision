import React, {useEffect, useMemo} from 'react'
import {Grid, Box, Button} from '@mui/material'
import Xarrow, {Xwrapper} from 'react-xarrows';
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../../redux';
import { 
  setBlocks, 
  addClickedBlock, 
  deleteClickedBlock, 
  setClickedBlocks, 
  addConnection, 
  deleteConnection,
  setConnections, 
  setActiveBlock,
  setClickedBlockId,
  setModalOpen,
  setModalType,
  setConnectionToDelete
} from '../../../redux/slices/blocksSlice';
import { 
  getResults,
  addBodyMatrix,
  addBodyExtension,
  addBodyTypes,
  addBodyMethod,
  addBodyMethodCorrelations,
  addBodyMethodRankings,
  addBodyRankingCorrelations,
  clearBody,
  resetBody,
  resetResults
} from '../../../redux/slices/calculationSlice';

import {MethodType, MethodCorrelationType, MethodRankingType, RankingCorrelationType} from '../../../redux/types'

import { getMethodData, getSingleItemByName, getFilteredMethods } from '../../../utilities/filtering';
import { getNotConnectedBlocks } from '../../../utilities/blocks';
import { BlockType } from '../../../redux/types';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import DraggableBox from '../DraggableBox'

export default function DragStory() {
  // const { allMethods, methodItem, correlationItem, decisionMatrixItem, rankingItem, visualizationItem, weightItem } = useSelector((state: RootState) => state.dictionary)
  const { allMethods} = useSelector((state: RootState) => state.dictionary)
  const { blocks, clickedBlocks, connections, draggedItem, activeBlock} = useSelector((state: RootState) => state.blocks)
  const { results, calculationBody} = useSelector((state: RootState) => state.calculation)
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar();

  const crispMethods = useMemo(() => getFilteredMethods(getMethodData(allMethods, 'method'), 'crisp'), [])
  const fuzzyMethods = useMemo(() => getFilteredMethods(getMethodData(allMethods, 'method'), 'fuzzy'), [])
  const HIDE_DURATION = 4000

  // console.log(results)

  const handleClick = (e: React.MouseEvent<HTMLElement>, id: string, type: string, method: string) => {
    // e.preventDefault()
    if (draggedItem !== null) return
    if (clickedBlocks.includes(id as never)) return
    dispatch(addClickedBlock(id))
    dispatch(setClickedBlockId(+id))

    allMethods.map(methods => {
      if (methods.key.toLowerCase().includes(type.toLowerCase())) {
        dispatch(setActiveBlock({
          ...methods.data.filter(item => item.name.toLowerCase() === method.toLowerCase())[0],
          id: +id
        }
        ))
      }
    })
  }

  const handleClearClick = () => {
    dispatch(setClickedBlocks([]))
    dispatch(setActiveBlock(null))
    dispatch(setConnections([]))
    dispatch(setBlocks([]))
    dispatch(resetResults())
    dispatch(resetBody())
  }
  
  const handleCalculateClick = () => {
    dispatch(clearBody())

    // console.log(getNotConnectedBlocks(blocks, connections))
    
    let matrixIndexes: [] | number[] = []

    // first step to check connections from matrix to weights
    const matrices = blocks.filter(block => block.type.includes('matrix'))
    if (matrices.length === 0) {
      enqueueSnackbar('No input data given', {variant: 'error', 'autoHideDuration': HIDE_DURATION});
      return
    }

    // for each matrix in structure do calculations
    matrices.forEach((matrix, matrixIdx) => {
      const m = [
        [78, 56, 1],
        [4, 45, 97],
        [18, 2, 63],
        [9, 14, 92],
        [85, 9, 29]
      ]
      
      
      let weightsItems: [] | BlockType[] = []
      let mcdaItems: [] | BlockType[][] = []
      
      // add weights methods connected with given matrix
      connections.forEach(connection => {
        if (connection[0] === matrix._id.toString()) {
          weightsItems = [...weightsItems, blocks.filter(block => block._id === +connection[1])[0]]
        }
      })
      
      if (weightsItems.length === 0) {
        matrixIndexes = [...matrixIndexes, matrixIdx]
        return
      }
      
      dispatch(addBodyMatrix(m))
      dispatch(addBodyTypes([-1, 1, 1]))


      // check mcda connections with weights
      weightsItems.map(w => {
        let mcdaTempItems: [] | BlockType[] = []
        connections.map(connection => {
          if (connection[0] === w._id.toString()) {
            mcdaTempItems = [...mcdaTempItems, blocks.filter(block => block._id === +connection[1])[0]]
          }

        })
        // if no connection from weight then insert empty object
        if (!connections.map(c => c[0]).includes(w._id.toString())) {
          // mcdaTempItems = [...mcdaTempItems, { _id: -1, type: '', method: '', inputConnections: [], outputConnections: []}]
          mcdaTempItems = []
        }
        if (mcdaTempItems.length > 0) {
          mcdaItems = [...mcdaItems, [...mcdaTempItems]]
        }
      })

      if (mcdaItems.length === 0) return

      let methodItem: MethodType[] = []
      weightsItems.map((item, index) => {
        mcdaItems[index].map(mcda => {
          methodItem = [...methodItem, {
            method: mcda.method,
            weights: item.method
          }]
        })
      })
      if (methodItem.length > 0) {
        dispatch(addBodyMethod(methodItem))
      }
      
      const rankingBlocks = blocks.filter(block => block.type === 'ranking')
      const correlationBlocks = blocks.filter(block => block.type === 'correlation')

      // correlations connections -> (method -> correlation)
      let methodCorrelationItem: [] | MethodCorrelationType[] = []
      correlationBlocks.map(block => {
        const blockConnections = connections.filter(c => c[1] === block._id.toString() && mcdaItems.filter(items => items.filter(i => i._id === +c[0]).length > 0))
        let methodCorrelation: MethodCorrelationType = {
          correlation: block.method,
          data: []
        }
        blockConnections.map(c => {
          weightsItems.map((item, index) => {
            mcdaItems[index].map(mcda => {
              if (mcda._id === +c[0]) {
                methodCorrelation.data = [...methodCorrelation.data, {
                  method: mcda.method,
                  weights: item.method
                }]
              }
            })
          })
        })
        if (methodCorrelation.data.length > 1) {
          methodCorrelationItem = [...methodCorrelationItem, methodCorrelation]
        }
      })
      if (methodCorrelationItem.length > 0) {
        dispatch(addBodyMethodCorrelations(methodCorrelationItem))
      }

      // ranking connections -> (method -> ranking)
      let methodRankingItem: [] | MethodRankingType[] = []
      let rankingCorrelationItem: [] | RankingCorrelationType[] = []
      rankingBlocks.map(block => {
        const blockConnections = connections.filter(c => c[1] === block._id.toString() && mcdaItems.filter(items => items.filter(i => i._id === +c[0]).length > 0))
        let methodRanking: MethodRankingType = {data: []}
        blockConnections.map(c => {
          weightsItems.map((item, index) => {
            mcdaItems[index].map(mcda => {
              if (mcda._id === +c[0]) {
                const data = getSingleItemByName(getMethodData(allMethods, 'Method'), blocks.filter(block => block._id === +c[0])[0].method)
                methodRanking.data = [...methodRanking.data, {
                  method: mcda.method, 
                  weights: item.method,
                  order: data?.order ? data.order : ''
                }]
              }
            })
          })
        })
        if (methodRanking.data.length > 0 ) {
          methodRankingItem = [...methodRankingItem, methodRanking]
        }
        
        // correlations connections -> (ranking -> correlation)
        const rankCorrConnections = connections.filter(c => c[0] === block._id.toString() && correlationBlocks.map(b => b._id).includes(+c[1]))
        rankCorrConnections.map(c => {
          const blockConnections = connections.filter(c => c[1] === block._id.toString() && mcdaItems.filter(items => items.filter(i => i._id === +c[0]).length > 0))
          let rankingCorrelation: RankingCorrelationType = {
            correlation: blocks.filter(b => b._id === +c[1])[0].method,
            data: []
          }
          blockConnections.map(conn => {
            weightsItems.map((item, index) => {
              mcdaItems[index].map(mcda => {
                if (mcda._id === +conn[0]) {
                  const data = getSingleItemByName(getMethodData(allMethods, 'Method'), blocks.filter(block => block._id === +conn[0])[0].method)
                  rankingCorrelation.data = [...rankingCorrelation.data, {
                    method: mcda.method,
                    weights: item.method,
                    order: data?.order ? data.order : ''
                  }]
                }
              })
            })
          })
          if (rankingCorrelation.data.length > 0) {
            rankingCorrelationItem = [...rankingCorrelationItem, rankingCorrelation]
          }
        })
      })
      if (methodRankingItem.length > 0) {
        dispatch(addBodyMethodRankings(methodRankingItem))
      }
      if (rankingCorrelationItem.length > 0) {
        dispatch(addBodyRankingCorrelations(rankingCorrelationItem))
      }
    })
    
    const body = {
      ...calculationBody,
      extensions: calculationBody.extensions.filter((e, idx) => !matrixIndexes.includes(idx as never))
    }
    dispatch(getResults(body))
  }

  const handleArrowClick = (c: string[]) => {
    dispatch(setModalType('connection'))
    dispatch(setModalOpen(true))
    dispatch(setConnectionToDelete(c))
  }

  const getBlocks = (type: string) => {
    return blocks.filter(b => b.type.toLowerCase() === type)
  }

  const checkForWrongDataMethodConnection = () => {
    getBlocks('matrix').forEach((matrix, idx) => {
      let weightsID: [] | string[] = []
      // save weights id
      connections.forEach(c => {
        if (c[0] === matrix._id.toString()) {
          weightsID = [...weightsID, c[1]]
        }
      })

      // check weights to method connection
      weightsID.forEach(w => {
        connections.forEach(c => {
          if (c[0] === w) {
            const methodBlock = blocks.filter(b => b._id === +c[1])[0]
            if (calculationBody.extensions[idx] === 'fuzzy') {
              if (!fuzzyMethods.map(m => m.name.toLowerCase()).includes(methodBlock.method.toLowerCase())) {
                // window.alert(`Metoda ${methodBlock.method.toUpperCase()} nie może byc połączona z danymi w formie fuzzy. Połączenie zostanie usunięte`)
                enqueueSnackbar(`Metoda ${methodBlock.method.toUpperCase()} nie może byc połączona z danymi w formie fuzzy. Połączenie zostanie usunięte`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
                dispatch(deleteConnection(c))
              }
            }
          } 
        })
      })
    })
  }

  useEffect(() => {
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
                  // window.alert('Metodę można połączyć tylko z jednym rankingiem')
                  enqueueSnackbar('Metodę można połączyć tylko z jednym rankingiem', {variant: 'error', 'autoHideDuration': HIDE_DURATION});
                  
                }
              } else if (outputBlock.type === 'correlation') {
                const requiredData = getSingleItemByName(getMethodData(allMethods, 'correlation'), outputBlock.method).requiredData
                // method->correlation
                if (requiredData.includes('preferences' as never)) {
                  if (inputBlock.type !== 'method') {
                    // window.alert('Ta metoda korelacji służy do obliczenia podobieństw preferencji, nie rankingów')
                    enqueueSnackbar('Ta metoda korelacji służy do obliczenia podobieństw preferencji, nie rankingów', {variant: 'error', 'autoHideDuration': HIDE_DURATION});
                  } else {
                    dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]))
                  }
                }
                // ranking-> correlation
                if (requiredData.includes('ranking' as never)) {
                  if (inputBlock.type !== 'ranking') {
                    // window.alert('Ta metoda korelacji służy do obliczenia podobieństw rankingów, nie preferencji')
                    enqueueSnackbar('Ta metoda korelacji służy do obliczenia podobieństw rankingów, nie preferencji', {variant: 'error', 'autoHideDuration': HIDE_DURATION});
                  } else {
                    dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]))
                  }
                }
              } else {
                dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]))
              }
            } else {
              // window.alert('Nie można połączyć bloczków')
              enqueueSnackbar('Nie można połączyc bloczków', {variant: 'error', 'autoHideDuration': HIDE_DURATION});
            }
        }
        dispatch(setClickedBlocks([]))
    }

    if (calculationBody.extensions.length === 0) return
    checkForWrongDataMethodConnection()

  }, [clickedBlocks])
  
  useEffect(() => {
    const currentBlocks = blocks.map(b => b._id)

    clickedBlocks.map(b => {
        if (!currentBlocks.includes(+b)) {
            dispatch(deleteClickedBlock(b))
        }
    })
    connections.forEach(c => {
      let blockId = null
      if (!currentBlocks.includes(+c[0])) blockId = c[0]
      else if (!currentBlocks.includes(+c[1])) blockId = c[1]

      if (blockId !== null) {
        dispatch(deleteConnection(c))
      } 
    })
      
    if (!currentBlocks.includes(activeBlock?.id as never)) {
      dispatch(setActiveBlock(null))
    }
  }, [blocks])

  useEffect(() => {
    if (calculationBody.extensions.length === 0) return

    checkForWrongDataMethodConnection()
  }, [calculationBody.extensions])

  return (
    <Grid
      style={{width: '100%', height: '100%'}}
    >
      <Box
        sx={{width: '90%', margin: '1% 5%', display: 'flex', justifyContent: 'end', alignItems: 'center'}}
      >
        <Button sx={{margin: '0 1%'}} variant='contained' onClick={handleClearClick}>
          <HighlightOffIcon />
          Clear
        </Button>
        <Button variant='contained' onClick={handleCalculateClick}>
          <PlayCircleOutlineIcon />
          Calculate
        </Button>
      </Box>
      <Grid
        container
        position='relative'
        direction='column'
        justifyContent='start'
        alignItems='center'
        flexDirection='row'
        style={{width: '90%', margin: '1% 5%', height: '100%', border: '3px solid black', backgroundColor: '#EEE'}}
      >
        <Xwrapper>
          {blocks.map(block => {
            return (
              <DraggableBox
                  key={block._id}
                  id={block._id.toString()}
                  type={block.type}
                  method={block.method}
                  handleClick={handleClick}
              />
            )
          })}
          {
          connections.map(c => {
              return (
                <Xarrow 
                  start={c[0]} 
                  end={c[1]}
                  // strokeWidth={8}
                  headSize={8}
                  passProps= {{cursor: "pointer", onClick: () => handleArrowClick(c)}}
                />
              )
            })
          }
        </Xwrapper>  
      </Grid>
      
    </Grid>
  )
}
