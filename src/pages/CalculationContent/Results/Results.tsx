import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Divider, Typography } from '@mui/material';

// REDUX
import { useAppSelector } from '@/state';

// COMPONENTS
import Filters from './Filters';
import Loader from '@/components/Loader';
import AccordionResults from '@/components/AccordionResult';

export default function Results() {
  const { filteredResults, matrixId, loading, results } = useAppSelector((state) => state.calculation);
  // const { matrixFilter } = useAppSelector((state) => state.filters);
  // const [filteredMatrixId, setFilteredMatrixId] = useState<number[]>(matrixId);

  const { t } = useTranslation();

  // useEffect(() => {
  //   if (matrixFilter !== '') setFilteredMatrixId([matrixId[+matrixFilter]]);
  //   else setFilteredMatrixId(matrixId);
  // }, [filteredResults]);

  return loading ? (
    <Container>
      <Loader />
    </Container>
  ) : results.length > 0 ? (
    <Container id="resultsContainer">
      <Divider textAlign="center" sx={{ pb: 2 }}>
        <Typography variant="h5">{t('results:results')}</Typography>
      </Divider>

      <Filters />
      <Stack gap={2} mt={5}>
        {results
          .filter((node) => node.node_type === 'matrix')
          .map((node, idx) => {
            return <AccordionResults key={node.id} matrixId={node.id} defaultExpanded={idx === 0} />;
          })}
      </Stack>
    </Container>
  ) : null;
}
