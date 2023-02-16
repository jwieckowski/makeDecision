import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { fetchAllMethods} from '../../redux/slices/dictionarySlice'
import { RootState, useAppDispatch } from '../../redux';

import {Box} from '@mui/material'
import MarkdownText from '../../components/MarkdownText';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';


export default function HomePage() {
  const { allMethods } = useSelector((state: RootState) => ({ ...state.dictionary }));
  const dispatch = useAppDispatch()

  const [userWeights, setUserWeights] = useState<boolean>(false)
  const [weightsExtension, setWeightsExtension] = useState<string>('crisp')

  useEffect(() => {
    if (allMethods.length === 0) dispatch(fetchAllMethods())
  }, [])

  const texts: string[] = [
    `The **lift** coefficient ($C_L$) is a dimensionless coefficient.`,
    `$$\\frac{1}{2} \\rho v^2 S C_L$$`,
    `Hello`,
    `$$ \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot \\vec{j} = 0 \\,.$$`
  ]

  return (
    <Box>
      Home Page
      <Box>
        {texts.map((text, idx) => {
          return (
            <MarkdownText text={text} key={idx}/> 
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
