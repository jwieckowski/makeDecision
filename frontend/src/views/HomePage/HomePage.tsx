import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { fetchAllMethods} from '../../redux/slices/dictionarySlice'
import { getHomeDescriptions } from '../../redux/slices/descriptionSlice'
import { RootState, useAppDispatch } from '../../redux';
import { useSnackbar } from 'notistack'
import {Box, Typography} from '@mui/material'
import Loader from '../../components/Loader';
import ErrorContent from '../../components/ErrorContent';
import { HIDE_DURATION } from '../../common/const';

export default function HomePage() {
  const { allMethods } = useSelector((state: RootState) => ({ ...state.dictionary }));
  const { home, loading, error } = useSelector((state: RootState) => ({ ...state.description }));
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (allMethods.length === 0) dispatch(fetchAllMethods())
    if (home.length === 0) dispatch(getHomeDescriptions())
  }, [])

  useEffect(() => {
    if (error === null) return
    enqueueSnackbar(error, {variant: 'error', 'autoHideDuration': HIDE_DURATION});
  }, [error])

  let content = <Loader />
  if (!loading) {
    if (!error) {
      content = 
        <Box sx={{width: '100%',  mt: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
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
      } else {
        content = <ErrorContent cb={getHomeDescriptions}/>
    }
  }
    
    return (
    <Box sx={{width: '100%'}}>
        {content}
    </Box>
  );
}
