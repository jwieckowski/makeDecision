import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../../redux';
import { Box, Typography, FormControl, InputLabel, MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { addMethodParameters } from '../../redux/slices/calculationSlice'

import { AllMethodsItem } from '../../redux/types'

type ParamType = {
    extension: string
}

// TODO add preference function for promethee
// methods: normalization, distance, defuzzification
export default function Additionals({extension} : ParamType) {
  const dispatch = useAppDispatch()
  
  const { allMethods, methodItem, loading, error } = useSelector((state: RootState) => ({ ...state.dictionary }));
  const { methodParameters } = useSelector((state: RootState) => ({ ...state.calculation }));
  
  const filterMethodsType = (data: [] | AllMethodsItem[], type: string) => {
    return data.filter(d => d.type === type)
  }

  const getMethodData = (data: [] | AllMethodsItem[], key: string) => {
    return data.filter(d => d.key.toLowerCase() === key.toLowerCase())[0]
  }

  const getSingleItemByID = (data: AllMethodsItem, id: number) => {
    return data.data.filter(d => d.id === id)
  }

  const getSingleItemByName = (data: AllMethodsItem, name: string) => {
    return data.data.filter(d => d.name.toLowerCase() === name.toLowerCase())[0]
  }

  const [normalization, setNormalization] = useState<string>('')
  const [distance, setDistance] = useState<string>('')
  const [defuzzification, setDefuzzification] = useState<string>('')

  useEffect(() => {
    setNormalization('')
    setDistance('')
    setDefuzzification('')
  }, [extension])

  const handleNormalizationChange = (event: SelectChangeEvent) => {
    setNormalization(event.target.value as string);
  };

  const handleDistanceChange = (event: SelectChangeEvent) => {
    setDistance(event.target.value as string);
  };

  const handleDefuzzificationChange = (event: SelectChangeEvent) => {
    setDefuzzification(event.target.value as string);
  };

  function getFilteredMethods(array: AllMethodsItem) {
    return array.data.filter(a => a.extensions.includes(extension as never))
  }
  function getAdditionalParameters() {
    if (methodItem === null) return []
    return methodItem?.additional.filter(a => a.extension === extension)
  }

  function addParameters() {

    type AdditionalType = {
        [key: string] : string
    }

    const additionalTypes: AdditionalType = {
        'normalization': normalization,
        'distance': distance,
        'defuzzification': defuzzification
    }

    const additional: AdditionalType = {}
    getAdditionalParameters().length !== 0 && getAdditionalParameters()[0].data.map(param => {
        additional[param.parameter] = additionalTypes[param.method]
    })

    const body = {
        'method': methodItem?.name,
        'extension': extension,
        'additional': additional
    }
    dispatch(addMethodParameters(body))
  }
  
  const NormalizationParameter = () => {
    return (
        getFilteredMethods(getMethodData(allMethods, 'Normalization')).length !== 0 ?
            <Box>
                <FormControl fullWidth sx={{mt: 2}}>
                    <InputLabel id="demo-simple-select-label">Normalization</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={normalization}
                        label="Normalization"
                        onChange={handleNormalizationChange}
                    >
                        {getFilteredMethods(getMethodData(allMethods, 'Normalization')).map(normalization => {
                            return (
                                <MenuItem value={normalization.functionName}>{normalization.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Box>
        : <></>
    ) 
  }

  const DistanceParameter = () => {
    return (
        getFilteredMethods(getMethodData(allMethods, 'Distance')).length !== 0 ?
            <Box>
                <FormControl fullWidth sx={{mt: 2}}>
                    <InputLabel id="demo-simple-select-label">Distance</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={distance}
                        label="Distance"
                        onChange={handleDistanceChange}
                    >
                        {getFilteredMethods(getMethodData(allMethods, 'Distance')).map(distance => {
                            return (
                                <MenuItem value={distance?.functionName}>{distance?.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Box>
        : <></>
    )
  }

  const DefuzzificationParameter = () => {
    return (
        getFilteredMethods(getMethodData(allMethods, 'Defuzzification')).length !== 0 ? 
            <Box>
                <FormControl fullWidth sx={{mt: 2}}>
                    <InputLabel id="demo-simple-select-label">Defuzzification</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={defuzzification}
                        label="Defuzzification"
                        onChange={handleDefuzzificationChange}
                    >
                        {getFilteredMethods(getMethodData(allMethods, 'Defuzzification')).map(defuzzification => {
                            return (
                                <MenuItem value={defuzzification?.functionName}>{defuzzification?.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Box>
            : <></>
    )
  }

  type Parameters = {
    [key: string] : JSX.Element
  }
  const parameters: Parameters = {
    'normalization': <NormalizationParameter/>,
    'distance': <DistanceParameter />,
    'defuzzification': <DefuzzificationParameter />
  }

  return (
    <Box sx={{width: '100%', margin: 'auto', border: '1px solid black', borderRadius: 2, p: 4}}>
        <Typography variant='h5' textAlign='center'>
            {methodItem?.name}
        </Typography>
        <Typography variant='body1' textAlign='center'>
            {methodItem?.abbreviation}
        </Typography>
        {
            getAdditionalParameters()?.length !== 0 && 
                <Box>
                    {getAdditionalParameters()[0].data.map(param => {
                        return (
                            <>
                                {parameters[param.method]}
                            </>

                        )
                    })}
                </Box>
        }
        <Typography onClick={addParameters} textAlign='center' sx={{mt: 2}}>
          Add parameters
        </Typography>
    </Box>
  )
}
