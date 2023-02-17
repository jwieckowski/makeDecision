import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { fetchAllMethods} from '../../redux/slices/dictionarySlice'
import { getHomeDescriptions } from '../../redux/slices/descriptionSlice'
import { RootState, useAppDispatch } from '../../redux';

import {Box, Typography} from '@mui/material'

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';


export default function HomePage() {
  const { allMethods } = useSelector((state: RootState) => ({ ...state.dictionary }));
  const { home } = useSelector((state: RootState) => ({ ...state.description }));
  const dispatch = useAppDispatch()

  const [userWeights, setUserWeights] = useState<boolean>(false)
  const [weightsExtension, setWeightsExtension] = useState<string>('crisp')

  useEffect(() => {
    if (allMethods.length === 0) dispatch(fetchAllMethods())
    if (home.length === 0) dispatch(getHomeDescriptions())
  }, [])

  return (
    <Box>
      Home Page
      <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        {home.map(t => {
          return (
            <Box sx={{width: '60%', m: 2}}>
              <Typography key={t.id}>
                {t.text}
              </Typography>
            </Box>
          )
        })}
      </Box>
      {/* <Box sx={{width: '100%', display: 'flex', justifyContent:'center', mb: 4}}>
        <FormGroup>
          <FormControlLabel control={<Checkbox  checked={userWeights} onChange={(e) => setUserWeights(e.target.checked)} />} label="User weights" />
        </FormGroup>
        {(extension === 'fuzzy' && userWeights) && 
          <FormGroup>
            <FormControlLabel control={<Switch checked={weightsExtension === 'crisp'} onChange={(e) => setWeightsExtension(e.target.checked ? 'crisp' : 'fuzzy')} />} label={weightsExtension === 'crisp' ? "Crisp weights" : 'Fuzzy weights'} />
          </FormGroup>
        }

      </Box>
      {userWeights && <Weights extension={weightsExtension} />} */}
    </Box>
  );
}
