// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { ResultsNode, FiltersProps } from '@/types';
import { t } from 'i18next';

export const getMatrixFilterItems = (results: ResultsNode[]) => {
  return [
    { value: 'all', label: t('results:all') },
    ...results
      .filter((node) => node.node_type === 'matrix')
      .map((node) => ({ value: `${node.id}`, label: `ID ${node.id}` })),
  ];
};

// const getWeightsFilterItems = (results: ResultsNode[], filters: FiltersProps) => {
//   let weights = results.filter((node) => node.node_type === 'weights');
//   if (filters.matrix !== '') {
//     weights = weights.filter((node) => node.data.filter((item) => item.matrix_id === +filters.matrix).length > 0);
//   }

//   return [{ value: '', label: '' }, ...weights.map((node) => ({ value: node.method, label: node.method }))];
// };
// const getMethodFilterItems = (results: ResultsNode[], filters: FiltersProps) => {
//   let method = results.filter((node) => node.node_type === 'method');
//   if (filters.matrix !== '') {
//     method = method.filter((node) => node.data.filter((item) => item.matrix_id === +filters.matrix).length > 0);
//   }
//   if (filters.weights !== '') {
//     method = method.filter((node) => node.data.filter((item) => item?.weights_method === filters.weights).length > 0);
//   }

//   return [{ value: '', label: '' }, ...method.map((node) => ({ value: node.method, label: node.method }))];
// };

// const getCorrelationFilterItems = (results: ResultsNode[], filters: FiltersProps) => {
//   let correlation = results.filter((node) => node.node_type === 'correlation');
//   if (filters.matrix !== '') {
//     correlation = correlation.filter(
//       (node) => node.data.filter((item) => item.matrix_id === +filters.matrix).length > 0,
//     );
//   }

//   return [{ value: '', label: '' }, ...correlation.map((node) => ({ value: node.method, label: node.method }))];
// };

export const filterResults = (results: ResultsNode[], filters: FiltersProps) => {
  if (results.length === 0) return [];

  let filtered = results;

  if (filters.matrix !== 'all') {
    filtered = [
      ...filtered.filter((node) => node.id === +filters.matrix),
      ...filtered.filter((node) => node.data.filter((item) => item?.matrix_id === +filters.matrix).length > 0),
    ];
  }

  return filtered;
};
