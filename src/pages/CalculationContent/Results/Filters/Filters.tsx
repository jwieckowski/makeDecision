import { useState, ChangeEvent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack } from '@mui/material';

// ICONS
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import { clearFilters } from '@/state/slices/filteringSlice';
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

type FiltersProps = {
  matrix: string;
  weights: string;
  method: string;
  correlation: string;
};

export default function Filters() {
  const { results } = useAppSelector((state) => state.calculation);

  const [filters, setFilters] = useState<FiltersProps>({
    matrix: '',
    weights: '',
    method: '',
    correlation: '',
  });

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleSelectChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const getMatrixFilterItems = () => {
    return [
      { value: '', label: '' },
      ...results
        .filter((node) => node.node_type === 'matrix')
        .map((node) => ({ value: `${node.id}`, label: `ID ${node.id}` })),
    ];
  };

  const getWeightsFilterItems = () => {
    let weights = results.filter((node) => node.node_type === 'weights');
    if (filters.matrix !== '') {
      weights = weights.filter((node) => node.data.filter((item) => item.matrix_id === +filters.matrix).length > 0);
    }

    return [{ value: '', label: '' }, ...weights.map((node) => ({ value: node.method, label: node.method }))];
  };
  const getMethodFilterItems = () => {
    let method = results.filter((node) => node.node_type === 'method');
    if (filters.matrix !== '') {
      method = method.filter((node) => node.data.filter((item) => item.matrix_id === +filters.matrix).length > 0);
    }
    if (filters.weights !== '') {
      method = method.filter((node) => node.data.filter((item) => item?.weights_method === filters.weights).length > 0);
    }

    return [{ value: '', label: '' }, ...method.map((node) => ({ value: node.method, label: node.method }))];
  };

  const getCorrelationFilterItems = () => {
    let correlation = results.filter((node) => node.node_type === 'correlation');
    if (filters.matrix !== '') {
      correlation = correlation.filter(
        (node) => node.data.filter((item) => item.matrix_id === +filters.matrix).length > 0,
      );
    }

    return [{ value: '', label: '' }, ...correlation.map((node) => ({ value: node.method, label: node.method }))];
  };

  const handleResultsFiltering = () => {
    // if (results === null) return;
    // dispatch(setFilteredResults(filterResults(results, matrixFilter, methodFilter, correlationFilter)));
    if (results.length === 0) return;
    dispatch(setFilteredResults(filterResults(results, filters)));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setFilteredResults(results));
  };

  useEffect(() => {
    setFilters((prev) => {
      return {
        ...prev,
        weights: getWeightsFilterItems()
          .map((item) => item.value)
          .includes(prev.weights)
          ? prev.weights
          : '',
        method: getMethodFilterItems()
          .map((item) => item.value)
          .includes(prev.method)
          ? prev.method
          : '',
      };
    });
  }, [filters]);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}
    >
      <Stack direction="row" gap={2}>
        <Select
          name="matrix"
          items={getMatrixFilterItems()}
          value={filters.matrix}
          onChange={handleSelectChange}
          label={t('results:matrix')}
          minWidth={120}
        />
        <Select
          name="weights"
          items={getWeightsFilterItems()}
          value={filters.weights}
          onChange={handleSelectChange}
          label={t('results:weights')}
          minWidth={120}
        />
        <Select
          name="method"
          items={getMethodFilterItems()}
          value={filters.method}
          onChange={handleSelectChange}
          label={t('results:method')}
          minWidth={120}
        />
        <Select
          name="correlation"
          items={getCorrelationFilterItems()}
          value={filters.correlation}
          onChange={handleSelectChange}
          label={t('results:correlation')}
          minWidth={120}
        />
      </Stack>
      <Stack direction="row" gap={2} sx={{ height: '40px', pl: 1 }}>
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
