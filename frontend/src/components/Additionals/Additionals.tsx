import React from 'react'
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../../redux';
import { Box, Typography, Button } from '@mui/material'
import { addMethodParameters } from '../../redux/slices/calculationSlice'

import { getAdditionalParameters } from '../../utilities/filtering';
import { setModalOpen } from '../../redux/slices/blocksSlice';

import Extension from './Extension'
import Metrics from './Metrics'
import InputMatrix from './InputMatrix';
import CriteriaTypes from './CriteriaTypes';
import UploadFile from './UploadFile';
import CriteriaAlternatives from './CriteriaAlternatives';
import InputWeights from './InputWeights';

// TODO add preference function for promethee
// methods: normalization, distance, defuzzification
export default function Additionals() {
  const dispatch = useAppDispatch()
  
  const {extensions} = useSelector((state: RootState) => state.calculation.calculationBody)
  const { allMethods, methodItem, loading, error } = useSelector((state: RootState) => ({ ...state.dictionary }));
  const { activeBlock, connections, blocks } = useSelector((state: RootState) => ({ ...state.blocks }));
  const { methodParameters } = useSelector((state: RootState) => ({ ...state.calculation }));

  const checkBlockType = (type: string) => {
    return activeBlock?.type.toLowerCase() === type
  }
  const checkBlockName = (type: string) => {
    return activeBlock?.name.toLowerCase() === type
  }

  const getBlockInputConnections = () => {
    return connections.filter(c => +c[1] === activeBlock?.id)
  }

  const getWeightsConnectedBlocksExtensions = () => {
    const matrices = blocks.filter(b => b.type.toLowerCase() === 'matrix')

    let connectedMatrix = connections.filter(c => activeBlock?.id === +c[1]).map(c => c[0])
    let indexes: [] | number[] = []
    connectedMatrix.forEach(cm => {
      matrices.forEach((m, idx) => {
        if (+cm === m._id)
        indexes = [...indexes, idx]
      })
    })
    return extensions.map((e, idx) => {
      return { extension: e, index: idx }
    }).filter(e => indexes.includes(e.index as never))
  }

  const getMethodsConnectedBlocksExtensions = () => {
    const matrices = blocks.filter(b => b.type.toLowerCase() === 'matrix')

    let indexes: [] | number[] = []
    matrices.forEach((m, idx) => {
      
      let weightsID: [] | string[] = []
      // save weights id
      connections.forEach(c => {
        if (c[0] === m._id.toString()) {
          weightsID = [...weightsID, c[1]]
        }
      })

      // check weights to method connection
      weightsID.forEach(w => {
        connections.forEach(c => {
          if (c[0] === w && c[1] === activeBlock?.id.toString()) {
            indexes = indexes.includes(idx as never) ? indexes : [...indexes, idx] 
          } 
        })
      })
    })

    return extensions.map((e, idx) => {
      return { extension: e, index: idx }
    }).filter(e => indexes.includes(e.index as never))
  }

  function addParameters() {
    console.log('tu')
    // type AdditionalType = {
    //     [key: string] : string
    // }

    // const additionalTypes: AdditionalType = {
    //     'normalization': normalization,
    //     'distance': distance,
    //     'defuzzification': defuzzification
    // }

    // const additional: AdditionalType = {}
    // getAdditionalParameters().length !== 0 && getAdditionalParameters()[0].data.map(param => {
    //     additional[param.parameter] = additionalTypes[param.method]
    // })

    // const body = {
    //     'method': methodItem?.name,
    //     'extension': extension,
    //     'additional': additional
    // }
    // dispatch(addMethodParameters(body))
  }

  return (
    <Box sx={{width: '100%', margin: 'auto', border: '1px solid black', borderRadius: 2, p: 2}}>
        <Box>
          <Typography textAlign='center' variant='h6'>
            {activeBlock?.name.toUpperCase()}
          </Typography>
          <Typography textAlign='center' variant='body1'>
            {activeBlock?.type.toUpperCase()}
          </Typography>
        </Box>
        {/* MATRIX TYPE */}
        { checkBlockType('matrix') && <Extension/>}  
        { (checkBlockType('matrix') && (checkBlockName('input') || checkBlockName('random'))) && <CriteriaAlternatives/>}
        { (checkBlockType('matrix') && checkBlockName('input')) && <InputMatrix extension='crisp'/>}
        { (checkBlockType('matrix') && (checkBlockName('input') || checkBlockName('random'))) && <CriteriaTypes/>}
        { (checkBlockType('matrix') && (checkBlockName('input') || checkBlockName('random'))) && 
          <Box sx={{width: '100%', display: 'flex', justifyContent:'end'}}>
            <Button onClick={() => dispatch(setModalOpen(false))}>
              <Typography color='black'>
                Zapisz
              </Typography>
            </Button>
          </Box>
        } 
        { (checkBlockType('matrix') && checkBlockName('file')) && <UploadFile/>}
        
        {/* WEIGHTS TYPE */}
        { (checkBlockType('weights') && checkBlockName('input')) && 
          getWeightsConnectedBlocksExtensions().map(extension => {
            return (
              <Box>
                <Typography>Matrix: {extension.index}</Typography>
                <Typography>Extension: {extension.extension}</Typography>
                <InputWeights extension={extension.extension}/>
              </Box>
            )
          })
        }
        { (checkBlockType('weights') && checkBlockName('input')) && 
          <Box sx={{width: '100%', display: 'flex', justifyContent:'end'}}>
            <Button onClick={() => dispatch(setModalOpen(false))}>
              <Typography color='black'>
                Zapisz
              </Typography>
            </Button>
          </Box>
        } 

        {/* METHOD TYPE */}
        { checkBlockType('method') &&
          getMethodsConnectedBlocksExtensions().map(b => {
            return (
              <Box>
                <Typography>Matrix: {b.index}</Typography>
                <Typography>Extension: {b.extension}</Typography>

                {getAdditionalParameters(activeBlock?.additional, b.extension)[0]?.data.map(item => {
                  return (
                    <Metrics extension={b.extension} method={item.method} parameter={item.parameter}/>
                    )
                  })
                }
              </Box>
            )
          })
        }
        {
          checkBlockType('method') && 
          <Typography onClick={addParameters} textAlign='center' sx={{mt: 2}}>
            Add parameters
          </Typography>
        }
    </Box>
  )
}
