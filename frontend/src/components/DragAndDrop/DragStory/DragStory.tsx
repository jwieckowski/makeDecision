import React, {useState, useEffect, useMemo, useRef} from 'react'
import {Grid, Box, Button, Typography, TextField, FormControl, InputLabel, MenuItem, IconButton } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
  clearBody,
  resetBody,
  resetResults
} from '../../../redux/slices/calculationSlice';

import {
  MethodType,
  MethodCorrelationType, 
  MethodRankingType, 
  RankingCorrelationType,
  CalculationBodyType
} from '../../../redux/types'
import { HIDE_DURATION, ZOOM_STEP } from '../../../common/const';

import { getMethodData, getSingleItemByName, getFilteredMethods } from '../../../utilities/filtering';
import { getNotConnectedBlocks } from '../../../utilities/blocks';
import { BlockType } from '../../../redux/types';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

import DraggableBox from '../DraggableBox'

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DragStory() {
  // const { allMethods, methodItem, correlationItem, decisionMatrixItem, rankingItem, visualizationItem, weightItem } = useSelector((state: RootState) => state.dictionary)
  const { allMethods} = useSelector((state: RootState) => state.dictionary)
  const { blocks, clickedBlocks, connections, draggedItem, activeBlock} = useSelector((state: RootState) => state.blocks)
  const { results, calculationBody, error} = useSelector((state: RootState) => state.calculation)
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar();
  const gridRef = useRef(null)
  
  const crispMethods = useMemo(() => allMethods.length > 0 ? getFilteredMethods(getMethodData(allMethods, 'method'), 'crisp') : [], [])
  const fuzzyMethods = useMemo(() => allMethods.length > 0 ? getFilteredMethods(getMethodData(allMethods, 'method'), 'fuzzy') : [], [])

  // xarrows settings
  const [size, setSize] = useState<number>(4)
  const [headSize, setHeadSize] = useState<number>(8)
  const [color, setColor] = useState<string>('CornflowerBlue')
  const [curveness, setCurveness] = useState<number>(0.8)
  const [path, setPath] = useState<any>('smooth')

  // grid area settings
  const [zoom, setZoom] = useState<number>(1)
  const [gridOn, setGridOn] = useState<boolean>(false)
  const [gridSize, setGridSize] = useState<number>(50)
  
  function handleSizeChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    e.preventDefault()
    setSize(+e.target.value)
  }
  
  function handleHeadSizeChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    e.preventDefault()
    setHeadSize(+e.target.value)
  }

  function handleCurvenessChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    e.preventDefault()
    setCurveness(+e.target.value)
  }

  const handleColorChange = (e: SelectChangeEvent) => {
    setColor(e.target.value)
  }

  const handlePathChange = (e: SelectChangeEvent) => {
    setPath(e.target.value)
  }

  const handleZoomClick = (value: number) => {
    setZoom(prev => prev + value)
  }

  const handleGridChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGridOn(e.target.checked)
  };
  
  function handleGridSizeChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    e.preventDefault()
    setGridSize(+e.target.value)
  }

  const printDocument = () => {
    const input = document.getElementById('blockArea');
    if (input === null) return

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          format: 'a3',
          unit: 'px',
        });
        pdf.addImage(imgData, 'PNG', 0, 0, 600, 0, undefined, undefined);
        pdf.save("graph.pdf");
      })
    ;
  }

  // console.log(results)

  useEffect(() => {
    if (error === null) return
    enqueueSnackbar(error, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
  }, [error])

  const handleClick = (e: React.MouseEvent<HTMLElement>, id: string, type: string, method: string) => {
    // e.preventDefault()
    e.stopPropagation()
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
  
  // Change to compose body in this function not in state
  const handleCalculateClick = () => {
    dispatch(clearBody())

    let body: CalculationBodyType = {
      matrixFiles: [],
      matrix: [],
      extensions: [],
      types: [],
      method: [],
      methodCorrelations: [],
      methodRankings: [],
      rankingCorrelations: []
    }

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

      // validate matrix
      if (matrix.method === 'file' && Array.isArray(matrix.data.matrixFile) && matrix.data.matrixFile.length === 0) {
        enqueueSnackbar(`Uploaded matrix file is empty`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
        return  
      }

      if (matrix.method === 'input') {
        //  no matrix defined
        if (matrix.data.matrix.length === 0) {
          enqueueSnackbar(`Input matrix was not defined`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
          return
        }
        
        // zero values in input matrix
        if (matrix.data.matrix.map((r: number[]) => r.some(item => item === 0) === true).some((r: boolean) => r === true) === true) 
        enqueueSnackbar(`Zero values in input matrix`, {variant: 'warning', 'autoHideDuration': HIDE_DURATION});
        
        // same values in column
        for (let i = 0; i < matrix.data.matrix[0].length; i++) {
          const colValue = [...matrix.data.matrix.map((r: number[]) => r[i])]
          const unique = Array.from(new Set(colValue))
          if (unique.length === 1) {
            enqueueSnackbar(`Same values in column ${i+1}`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
            return
          }
        }
      }
      
      // validate types
      if (['input', 'random'].includes(matrix.method)) {
        //  no types given
        if (matrix.data.types.length === 0) {
          enqueueSnackbar(`Criteria types were not given`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
          return
        }
        
        let size = matrix.method === 'random' ? matrix.data.randomMatrix[1] : matrix.data.matrix[0].length
        if (size !== matrix.data.types.length) {
          enqueueSnackbar(`Not all criteria types were given`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
          return  
        }
      }

      body.extensions = [...body.extensions, matrix.data.extension]
      if (matrix.method === 'input') body.matrix = [...body.matrix, matrix.data.matrix]
      else if (matrix.method === 'random') body.matrix = [...body.matrix, matrix.data.randomMatrix]
      else if (matrix.method === 'file') body.matrix = [...body.matrix, matrix.data.matrixFile]

      if (['input', 'random'].includes(matrix.method)) body.types = [...body.types, matrix.data.types.map(t => +t)]
      else body.types = [...body.types, []]

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

      //  validate weights
      weightsItems.forEach(weights => {
        if (weights.method === 'input' && matrix.data.extension === 'crisp') {

          const sum = weights.data.weights.map(w => +w).reduce((total, value) => Number(total) + Number(value), 0);
          console.log(sum)  
          if (weights.data.weights.some(w => +w === 0)) {
            enqueueSnackbar(`None of weights should equal 0`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
            return
          } 
          else if (weights.data.weights.some(w => +w < 0)) {
            enqueueSnackbar(`None of weights should equal less than 0`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
            return
          } 
          else if (Math.round(sum * 100) / 100 !== 1) {
            enqueueSnackbar(`Weights should sum up to 1`, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
            return
          } 
        }
      })
      

      let methodItem: MethodType[] = []
      weightsItems.map((item, index) => {
        mcdaItems[index].map(mcda => {
          methodItem = [...methodItem, {
            method: mcda.method,
            weights: item.method === 'input' ? item.data.weights.map(w => +w) :item.method
          }]
        })
      })
      if (methodItem.length > 0) {
        body.method = [...body.method, [...methodItem]]
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
        if (methodCorrelation.data.length > 0) {
          methodCorrelationItem = [...methodCorrelationItem, methodCorrelation]
        }
      })
      if (methodCorrelationItem.length > 0) {
        body.methodCorrelations = [...body.methodCorrelations, [...methodCorrelationItem]]
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
        body.methodRankings = [...body.methodRankings, [...methodRankingItem]]
      }
      if (rankingCorrelationItem.length > 0) {
        body.rankingCorrelations = [...body.rankingCorrelations, [...rankingCorrelationItem]]
      }
    })

    dispatch(getResults(body))
  }

  const handleGridClick = () => {
    dispatch(setClickedBlockId(null))
    dispatch(setClickedBlocks([]))
    dispatch(setActiveBlock(null))
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
      style={{width: '100%', height: '60vh'}}
    >
      <Box
        sx={{width: '90%', margin: '1% 5%', display: 'flex', justifyContent: 'end', alignItems: 'center'}}
      >
        <Button variant='contained' onClick={printDocument}>
          <SaveAltIcon />
          Save graph
        </Button>
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
        style={{
          width: '90%', 
          margin: '1% 5%', 
          height: '100%', 
          border: '3px solid black', 
          cursor: 'pointer',
          zoom: zoom,
          background: gridOn ? `conic-gradient(from 90deg at 1px 1px,#0000 90deg,grey 0) 0 0/${gridSize}px ${gridSize}px`: ''
        }}
        onClick={handleGridClick}
        id='blockArea'
        ref={gridRef}
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
                  zoom={zoom}
              />
            )
          })}
          {
          connections.map(c => {
              return (
                <Xarrow 
                  start={c[0]} 
                  end={c[1]}
                  strokeWidth={size}
                  headSize={headSize}
                  path={path}
                  curveness={curveness}
                  color={color}
                  passProps= {{cursor: "pointer", onClick: () => handleArrowClick(c)}}
                />
              )
            })
          }
        </Xwrapper>  
      </Grid>
      <Box sx={{width: '90%', margin: '0 5%', display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
        <Box sx={{mr: 1}}>
          <FormControlLabel 
            control={<Checkbox value={gridOn} onChange={handleGridChange}/>} 
            label="Grid"
            labelPlacement="start"
          />
        </Box>
        {
          gridOn && 
            <TextField
              style={{width: '80px', marginRight: 5}}
              key='size-grid' 
              value={gridSize}
              label='Size'
              type='number'
              onChange={(e) => handleGridSizeChange(e)}
              InputProps={{
                inputProps: { 
                  min: 10, max: 100, step: 1 
                }
              }}  
            />
        }
        <Typography variant='body2'>
          {Math.round(zoom*100)}%
        </Typography>
        <IconButton onClick={() => handleZoomClick(-ZOOM_STEP)}>
          <ZoomOutIcon />
        </IconButton>
        <IconButton onClick={() => handleZoomClick(ZOOM_STEP)}>
          <ZoomInIcon />
        </IconButton>
      </Box>
      <Box sx={{width: '90%', margin: '1% 5%'}}>
        <Box>
          <Typography variant='body2'>
            Arrows settings
          </Typography>
        </Box>
        <Box sx={{mt:2, display: 'flex', gap: 2}}>
          <TextField
            style={{width: '80px'}}
            key='size-arrow' 
            value={size}
            label='Size'
            type='number'
            onChange={(e) => handleSizeChange(e)}
            InputProps={{
              inputProps: { 
                min: 1, max: 12 
              }
            }}  
          />
          <TextField
            style={{width: '80px'}}
            key='headSize-arrow' 
            value={headSize}
            label='Head size'
            type='number'
            onChange={(e) => handleHeadSizeChange(e)}
            InputProps={{
              inputProps: { 
                min: 1, max: 12 
              }
            }}  
          />
          <TextField
            style={{width: '80px'}}
            key='curveness-arrow' 
            value={curveness}
            label='Curveness'
            type='number'
            onChange={(e) => handleCurvenessChange(e)}
            InputProps={{
              inputProps: { 
                min: 0.1, max: 2, step: 0.1 
              }
            }}  
          />
          <FormControl sx={{width: '120px'}}>
            <InputLabel id="color-input">Color</InputLabel>
            <Select
              labelId="color-input"
              id="color"
              value={color}
              label="color"
              onChange={handleColorChange}
            >
              <MenuItem value={'CornflowerBlue'}>
                <Typography variant='body2'>
                  Light Blue
                </Typography>
              </MenuItem>
              <MenuItem value={'red'}>
                <Typography variant='body2'>
                  Red
                </Typography>
              </MenuItem>
              <MenuItem value={'blue'}>
                <Typography variant='body2'>
                  Blue
                </Typography>
              </MenuItem>
              <MenuItem value={'green'}>
                <Typography variant='body2'>
                  Green
                </Typography>
              </MenuItem>
              <MenuItem value={'yellow'}>
                <Typography variant='body2'>
                  Yellow
                </Typography>
              </MenuItem>
              <MenuItem value={'black'}>
                <Typography variant='body2'>
                  Black
                </Typography>
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{width: '120px'}}>
            <InputLabel id="path-input">Path</InputLabel>
            <Select
              labelId="path-input"
              id="path"
              value={path}
              label="path"
              onChange={handlePathChange}
            >
              <MenuItem value={'smooth'}>
                <Typography variant='body2'>
                  Smooth
                </Typography>
              </MenuItem>
              <MenuItem value={'grid'}>
                <Typography variant='body2'>
                  Grid
                </Typography>
              </MenuItem>
              <MenuItem value={'straight'}>
                <Typography variant='body2'>
                  Straight
                </Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Grid>
  )
}
