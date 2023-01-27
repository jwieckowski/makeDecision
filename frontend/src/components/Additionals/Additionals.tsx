import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../../redux';
import { Box, Typography, FormControl, InputLabel, MenuItem } from '@mui/material'
import { addMethodParameters } from '../../redux/slices/calculationSlice'

import { getAdditionalParameters } from '../../utilities/filtering';

import Extension from './Extension'
import Metrics from './Metrics'

// TODO add preference function for promethee
// methods: normalization, distance, defuzzification
export default function Additionals() {
  const dispatch = useAppDispatch()
  
  const { allMethods, methodItem, loading, error } = useSelector((state: RootState) => ({ ...state.dictionary }));
  const { methodParameters } = useSelector((state: RootState) => ({ ...state.calculation }));

  console.log(methodItem)
  console.log(getAdditionalParameters(methodItem, 'fuzzy'))
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
    <Box sx={{width: '100%', margin: 'auto', border: '1px solid black', borderRadius: 2, p: 4}}>
        <Box sx={{m: 1}}>
          <Typography textAlign='center' variant='h6'>
            {methodItem?.name.toUpperCase()}
          </Typography>
        </Box>
        <Extension/>
        { getAdditionalParameters(methodItem, 'fuzzy')[0].data.map(item => {
            return (
              <Metrics extension='fuzzy' method={item.method} parameter={item.parameter}/>
            )
          })
        }
        <Typography onClick={addParameters} textAlign='center' sx={{mt: 2}}>
          Add parameters
        </Typography>
    </Box>
  )
}
