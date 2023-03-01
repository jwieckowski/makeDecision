import React, {useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import {Box, Typography} from '@mui/material'
import { RootState, useAppDispatch } from '../../redux';
import Loader from '../../components/Loader';
import ErrorContent from '../../components/ErrorContent';
import { getAboutFile, getAboutDescription } from '../../redux/slices/aboutSlice';
import { useSnackbar } from 'notistack'
import { HIDE_DURATION} from '../../common/const';

import ImageItem from '../../components/ImageItem';


export default function AboutPage() {
  const { about, file, loading, error } = useSelector((state: RootState) => ({ ...state.about }));
  const dataFetchedRef = useRef(false);
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    if (about.length === 0) dispatch(getAboutDescription())
    if (file === null) dispatch(getAboutFile())
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
          {about.map(item => {
            return (
              <Box sx={{width: '60%', my: 2}}>
                <Typography variant='h5' textAlign='center'>
                  {item.format}
                </Typography>
                {file !== null && 
                  <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <ImageItem src={file[item.imgIndex]} alt='text' key={`${item.format} file with example data`} />
                  </Box>
                }
                {item.description.map(d => {
                  return <Typography key={d.id} variant='body1' sx={{my: 2}} align='justify'>
                    {d.text}
                  </Typography>
                })}
              </Box>
            )
          })}
        </Box>
      } else {
        content = <ErrorContent/>
    }
  }
    
  return (
    <Box sx={{width: '100%'}}>
        {content}
    </Box>
  );
}
