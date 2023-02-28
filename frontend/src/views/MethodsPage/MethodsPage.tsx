import React, {useEffect, useRef} from 'react';
import {Box} from '@mui/material'

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux';
import { getMethodsDescriptions } from '../../redux/slices/descriptionSlice'

import Loader from '../../components/Loader';
import ErrorContent from '../../components/ErrorContent';

import DescriptionsMenu from '../../components/DescriptionsMenu';

export default function MethodsPage() {
  const { methods, loading, error } = useSelector((state: RootState) => ({ ...state.description }));
  const dataFetchedRef = useRef(false);
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    if (methods.length === 0) dispatch(getMethodsDescriptions())
  }, [])

  let content = <Loader />
  if (!loading) {
    if (!error) {
      content = <DescriptionsMenu />
      } else {
        content = <ErrorContent cb={getMethodsDescriptions}/>
    }
  }

  return (
    <Box>
      {content}
    </Box>
  );
}