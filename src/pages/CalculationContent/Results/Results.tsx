// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useTranslation } from 'react-i18next';
import { Container, Stack, Divider, Typography } from '@mui/material';

// REDUX
import { useAppSelector } from '@/state';

// COMPONENTS
import Filters from './Filters';
import Loader from '@/components/Loader';
import AccordionResults from '@/components/AccordionResult';

export default function Results() {
  const { filteredResults, resultsLoading } = useAppSelector((state) => state.calculation);

  const { t } = useTranslation();

  if (!resultsLoading && filteredResults.length === 0) return null;

  console.log(filteredResults);

  return (
    <Container id="resultsContainer">
      {resultsLoading ? (
        <Container sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <Loader size={200} />
        </Container>
      ) : (
        <>
          <Divider textAlign="center" sx={{ pb: 2 }}>
            <Typography variant="h5">{t('results:results')}</Typography>
          </Divider>

          <Filters />
          <Stack gap={2} mt={5}>
            {filteredResults
              .filter((node) => node.node_type === 'matrix')
              .map((node, idx) => {
                return <AccordionResults key={node.id} matrixId={node.id} defaultExpanded={idx === 0} />;
              })}
            {filteredResults.filter((node) => node.node_type === 'matrix').length === 0 ? (
              <AccordionResults
                key={filteredResults[0].id}
                matrixId={filteredResults[0].data[0]?.matrix_id}
                defaultExpanded={true}
              />
            ) : null}
          </Stack>
        </>
      )}
    </Container>
  );
}
