import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack } from '@mui/material';

// ICONS
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import { setMatrixFilter, setMethodFilter, setCorrelationFilter, clearFilters } from '@/state/slices/filteringSlice';
import { setFilteredResults } from '@/state/slices/calculationSlice';

// COMPONENTS
import Button from '@/components/Button';
import Select from '@/components/Select';

// UTILS
import { generateResultsFile } from '@/utils/files';
import {
  getResultsMatrixItems,
  getResultsMethodItems,
  getResultsCorrelationItems,
  filterResults,
} from '@/utils/filtering';

export default function Filters() {
  const { results, matrixId } = useAppSelector((state) => state.calculation);
  const { matrixFilter, methodFilter, correlationFilter } = useAppSelector((state) => state.filters);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const getMatrixFilterItems = () => {
    return [{ value: '', label: t('results:matrix') }, ...getResultsMatrixItems(matrixId, t('results:matrix'))];
  };

  const getMethodFilterItems = () => {
    if (!results?.method) return [{ value: '', label: t('results:method') }];
    return [
      { value: '', label: t('results:method') },
      ...getResultsMethodItems(results?.method, matrixFilter === '' ? null : +matrixFilter),
    ];
  };

  const getCorrelationFilterItems = () => {
    if (!results?.methodCorrelations || !results?.rankingCorrelations)
      return [{ value: '', label: t('results:method') }];
    return [
      { value: '', label: t('results:correlation') },
      ...getResultsCorrelationItems(
        results?.methodCorrelations,
        results?.rankingCorrelations,
        matrixFilter === '' ? null : +matrixFilter,
      ),
    ];
  };

  const handleResultsFiltering = () => {
    if (results === null) return;
    dispatch(setFilteredResults(filterResults(results, matrixFilter, methodFilter, correlationFilter)));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setFilteredResults(results));
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}
    >
      <Stack direction="row" gap={2}>
        <Select
          items={getMatrixFilterItems()}
          value={matrixFilter}
          onChange={(e) => {
            dispatch(setMatrixFilter(e.target.value));
          }}
          label={t('results:matrix')}
          minWidth={120}
        />
        <Select
          items={getMethodFilterItems()}
          value={methodFilter}
          onChange={(e) => {
            dispatch(setMethodFilter(e.target.value));
          }}
          label={t('results:method')}
          minWidth={120}
        />
        <Select
          items={getCorrelationFilterItems()}
          value={correlationFilter}
          onChange={(e) => {
            dispatch(setCorrelationFilter(e.target.value));
          }}
          label={t('results:correlation')}
          minWidth={120}
        />
      </Stack>
      <Stack direction="row" gap={2} sx={{ height: '40px' }}>
        <Button
          text={t('results:clear')}
          startIcon={<HighlightOffIcon />}
          onClick={() => handleClearFilters()}
          disabled={results === null}
          variant="contained"
        />
        <Button
          text={t('results:filter')}
          startIcon={<FilterAltIcon />}
          onClick={() => handleResultsFiltering()}
          disabled={results === null}
          variant="contained"
        />
        <Button
          text={t('results:results')}
          startIcon={<DownloadIcon />}
          onClick={() => (results !== null ? generateResultsFile(results) : {})}
          disabled={results === null}
          variant="contained"
        />
      </Stack>
    </Container>
  );
}
