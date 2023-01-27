import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { fetchAllMethods, setMethodItem } from '../../redux/slices/dictionarySlice'
import { getResults, getRanking, getCorrelations } from '../../redux/slices/calculationSlice';
import { RootState, useAppDispatch } from '../../redux';

import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, Typography, FormControl, InputLabel, MenuItem } from '@mui/material'

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';

import Matrix from '../../components/Matrix';
import Weights from '../../components/Weights';
import CriteriaTypes from '../../components/CriteriaTypes';

import { AllMethodsItem } from '../../redux/types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 15 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function HomePage() {
  // const { allMethods, methods, weights, ranking, correlations, normalizations, distances, defuzzifications, methodItem, loading, error } = useSelector((state: RootState) => ({ ...state.dictionary }));
  const { allMethods, methodItem, loading, error } = useSelector((state: RootState) => ({ ...state.dictionary }));
  const { results, rankingResults, correlationResults } = useSelector((state: RootState) => ({ ...state.calculation }));
  const dispatch = useAppDispatch()

  const [extension, setExtension] = useState<string>('crisp')
  const [mcda, setMCDA] = useState<string[]>([])
  const [weightsMethod, setWeightsMethod] = useState<string>('')
  const [rankingOrder, setRankingOrder] = useState<string>('')
  const [correlationMethods, setCorrelationMethods] = useState<string[]>([])
  const [userWeights, setUserWeights] = useState<boolean>(false)
  const [weightsExtension, setWeightsExtension] = useState<string>('crisp')

  //  helpers
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

  useEffect(() => {
    if (allMethods.length === 0) dispatch(fetchAllMethods())
  }, [])


  // console.log(results)
  // console.log(rankingResults)
  // console.log(correlationResults)

  const handleExtensionChange = (event: SelectChangeEvent) => {
    setExtension(event.target.value as string);
    setMCDA([])
  };

  const handleMCDAChange = (event: SelectChangeEvent<typeof mcda>) => {
    const {
      target: { value },
    } = event;
    setMCDA(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    dispatch(setMethodItem(getSingleItemByName(getMethodData(allMethods, 'Method'), 'CODAS')))
  };

  const handleCorrelationsChange = (event: SelectChangeEvent<typeof mcda>) => {
    const {
      target: { value },
    } = event;
    setCorrelationMethods(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleWeightsMethodChange = (event: SelectChangeEvent) => {
    setWeightsMethod(event.target.value as string);
  }

  function sendData (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault()

    let matrix: number[][] | number[][][] = [[]]
    
    if (extension === 'crisp') {
      matrix = [
        [78, 56, 1],
        [4, 45, 97],
        [18, 2, 63],
        [9, 14, 92],
        [85, 9, 29]
    ]
    } else if (extension === 'fuzzy') {
      matrix = [
        [[5, 7, 9], [5, 7, 9], [7, 9, 9]],
        [[1, 3, 5], [3, 5, 7], [3, 5, 7]],
        [[1, 1, 3], [1, 3, 5], [1, 3, 5]],
        [[7, 9, 9], [7, 9, 9], [7, 9, 9]]
      ]
    }

    const body = {
      'matrix': matrix,
      'types': [1, -1, 1],
      'mcda_methods': mcda,
      'extension': extension,
      'weights_method': weightsMethod,
      'correlation_methods': ['ws_rank_similarity'],
      'ranking_order': 'Ascending',
      'params': [
        {
        "method": "ARAS",
        "extension": "fuzzy",
        "additional": {
            "normalization": "max_normalization"
            }
        }
      ]
    }

    // dispatch(getResults(body))
  }

  function sendRanking (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault()

    const matrix = results.map(res => res.preference)
    const body = {
      matrix: matrix,
      order: ['Ascending', 'Ascending', 'Ascending', 'Ascending', 'Ascending']
    }

    dispatch(getRanking(body))
  }

  function sendCorrelation (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault()

    const matrix = results.map(res => res.preference)
    const body = {
      matrix: matrix,
      correlationMethods: correlationMethods
    }

    dispatch(getCorrelations(body))
  }

  return (
    <Box>
      Home Page
      <br></br>

      <Box sx={{width: '80%', margin: 'auto'}}>

        <Box sx={{margin: '10px 0'}}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Extension</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={extension}
              label="Extension"
              onChange={handleExtensionChange}
            >
              <MenuItem value={'crisp'}>Crisp</MenuItem>
              <MenuItem value={'fuzzy'}>Fuzzy</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{margin: '10px 0'}}>
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-checkbox-label">MCDA</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={mcda}
              onChange={handleMCDAChange}
              input={<OutlinedInput label="MCDA method" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {allMethods.length > 0 && getMethodData(allMethods, 'Method').data.map(method => {
                if (method.extensions.includes(extension as never)) {
                    return (
                      <MenuItem key={method.name} value={method.name}>
                        <Checkbox checked={mcda.indexOf(method.name) > -1} />
                        <ListItemText primary={method.name} />
                      </MenuItem>
                    )
                  }
                }
              )}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{margin: '10px 0'}}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Weights method</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={weightsMethod}
              label="Weights method"
              onChange={handleWeightsMethodChange}
              >
              {allMethods.length > 0 && getMethodData(allMethods, 'Weights').data.map(method => {
                if (method.extensions.includes(extension as never)) {
                  return (
                    <MenuItem key={method.name} value={method.name}>{method.name}</MenuItem>
                  )
                }
              })}
            </Select>
          </FormControl>
        </Box>

        <Box onClick={(e) => sendData(e)}>
          Send Data
        </Box>
      </Box>

      {results.length > 0 &&
        <Box>
          <Typography>Results</Typography>
          {
            results.map(result => {
              return (
                <Box>
                  <Typography>{`${result.extension} ${result.method}`}</Typography>
                  <Typography>{`${result.preference.map((p: number) => p.toFixed(3)).join(', ')}`}</Typography>
                </Box>
              )
            })
          }
        </Box>
      }

      {
        results.length > 0 && 
          <Box sx={{margin: '10px 0'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Ranking method</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={rankingOrder}
                label="Ranking method"
                onChange={(e) => setRankingOrder(e.target.value)}
                >
                {allMethods.length > 0 && getMethodData(allMethods, 'Ranking').data.map(rank => {
                    return (
                      <MenuItem key={rank.name} value={rank.name}>{rank.name}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
            <Box onClick={(e) => sendRanking(e)}>
              Calculate Rankings
            </Box>
            {rankingResults.length > 0 && 
              <Box>
                {rankingResults.map(result => {
                    return (
                      <Box>
                        <Typography>{`${result.ranking.join(', ')}`}</Typography>
                      </Box>
                    )
                  })
                }
              </Box>
            }
          </Box>
      }
      {
        results.length > 0 && 
          <Box sx={{margin: '10px 0'}}>
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">Correlation methods</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={correlationMethods}
                onChange={handleCorrelationsChange}
                input={<OutlinedInput label="Correlation methods" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {allMethods.length > 0 && getMethodData(allMethods, 'Correlation').data.map(corr => {
                    return (
                      <MenuItem key={corr.name} value={corr.name}>
                        <Checkbox checked={correlationMethods.indexOf(corr.name) > -1} />
                        <ListItemText primary={corr.name} />
                      </MenuItem>
                    )
                  }
                )}
              </Select>
            </FormControl>
            <Box onClick={(e) => sendCorrelation(e)}>
              Calculate Correlation
            </Box>
            {correlationResults.length > 0 && 
              <Box>
                {correlationResults.map(corrResults => {
                    return (
                      <>
                        <Typography>{corrResults.method}</Typography>
                        {
                          corrResults.correlation.map((corr: number[]) => {
                              return (
                                <Box>
                                  <Typography>{`${corr.map((p: number) => p.toFixed(3)).join(', ')}`}</Typography>
                                </Box>
                            )
                          })
                        }
                      </>
                    )
                  })
                }
              </Box>
            }
          </Box>
      }
      {/* <Box sx={{style:'60%', margin: 'auto'}}>
        <Additionals extension={extension} />
      </Box> */}
      <Matrix extension={extension} />
      <CriteriaTypes />
      <Box sx={{width: '100%', display: 'flex', justifyContent:'center', mb: 4}}>
        <FormGroup>
          <FormControlLabel control={<Checkbox  checked={userWeights} onChange={(e) => setUserWeights(e.target.checked)} />} label="User weights" />
        </FormGroup>
        {(extension === 'fuzzy' && userWeights) && 
          <FormGroup>
            <FormControlLabel control={<Switch checked={weightsExtension === 'crisp'} onChange={(e) => setWeightsExtension(e.target.checked ? 'crisp' : 'fuzzy')} />} label={weightsExtension === 'crisp' ? "Crisp weights" : 'Fuzzy weights'} />
          </FormGroup>
        }

      </Box>
      {userWeights && <Weights extension={weightsExtension} />}
    </Box>
  );
}
