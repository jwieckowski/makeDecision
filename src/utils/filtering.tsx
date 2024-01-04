import {
  AllMethodsItem,
  MethodKwargs,
  ResultsType,
  ResultsMethod,
  ResultsMethodCorrelations,
  ResultsRankingCorrelations,
  FilterItem,
  ResultsNode,
} from '@/types';

export const filterMethodsFunction = (data: [] | AllMethodsItem[], methodFunction: string) => {
  return data.filter((d) => d.function === methodFunction);
};

export const getMethodData = (data: [] | AllMethodsItem[], key: string) => {
  return data.filter((d) => d.key.toLowerCase() === key.toLowerCase())[0];
};

export const getSingleItemByID = (data: AllMethodsItem, id: number) => {
  return data.data.filter((d) => d.id === id);
};

export const getSingleItemByName = (data: AllMethodsItem, name: string) => {
  return data.data.filter((d) => d.name.toLowerCase() === name.toLowerCase())[0];
};

export const getFilteredMethods = (array: AllMethodsItem, extension: string) => {
  return array?.data.filter((a) => a.extensions.includes(extension as never));
};

export const getKwargs = (kwargs: MethodKwargs[] | null | undefined, extension: string) => {
  if (kwargs === null || kwargs === undefined) return [];
  return kwargs.filter((a) => a.extension === extension);
};

export const getKwargsFromDictionary = (data: AllMethodsItem[], method: string) => {
  const methods = data.filter((d) => d.type.toLowerCase() === 'method')[0];
  return methods.data.filter((m) => m.name.toLowerCase() === method.toLowerCase())[0].kwargs;
};

export const removeFirst = (src: string[], element: string) => {
  const index = src.indexOf(element);
  if (index === -1) return src;
  return [...src.slice(0, index), ...src.slice(index + 1)];
};

export const areResultsAvailable = (results: [] | ResultsType) => {
  if (Array.isArray(results)) return false;

  const l1 = results.method.length === 0;
  const l2 = results.methodCorrelations.length === 0;
  const l3 = results.methodRankings.length === 0;
  const l4 = results.rankingCorrelations.length === 0;

  return [l1, l2, l3, l4].some((l) => l === false);
};

export const getResultsMatrixItems = (ids: [] | number[], label: string) => {
  if (ids.length === 0) return [];
  return ids.map((id, idx) => {
    return {
      value: `${idx}`,
      label: `${label} ID ${id}`,
    };
  });
};

export const getResultsMethodItems = (results: ResultsMethod[][], matrixId: null | number) => {
  if (!results) return [];

  let items: FilterItem[] = [];
  if (matrixId) {
    // METHODS CONNECTED WITH GIVEN MATRIX ID
    results[matrixId]?.forEach((res) => {
      if (!items?.map((i) => i.label).includes(res.method))
        items = [
          ...items,
          {
            value: res.method,
            label: res.method,
          },
        ];
    });
    return results[matrixId] ? items : [];
  }
  // ALL METHODS CONNECTED WITH MATRIXES
  results.forEach((result) => {
    result.forEach((res) => {
      if (!items.map((item) => item.value).includes(res.method))
        items = [
          ...items,
          {
            value: res.method,
            label: res.method,
          },
        ];
    });
  });
  return items;
};

export const getResultsCorrelationItems = (
  methodCorrelations: ResultsMethodCorrelations[][],
  rankingCorrelations: ResultsRankingCorrelations[][],
  matrixId: null | number,
) => {
  if (methodCorrelations.length === 0 && rankingCorrelations.length === 0) return [];

  let items: FilterItem[] = [];
  if (matrixId) {
    // CORRELATIONS CONNECTED WITH GIVEN MATRIX ID
    if (methodCorrelations[matrixId]) {
      methodCorrelations[matrixId].forEach((res) => {
        if (!items?.map((i) => i.label).includes(res.correlation))
          items = [
            ...items,
            {
              value: res.correlation,
              label: res.correlation,
            },
          ];
      });
    }
    if (rankingCorrelations[matrixId]) {
      rankingCorrelations[matrixId].forEach((res) => {
        if (!items.map((i) => i.label).includes(res.correlation))
          items = [
            ...items,
            {
              value: res.correlation,
              label: res.correlation,
            },
          ];
      });
      return items;
    }
  }

  // ALL CORRELATIONS CONNECTED WITH MATRIXES
  methodCorrelations.forEach((result) => {
    result.forEach((res) => {
      if (!items?.map((i) => i.label).includes(res.correlation))
        items = [
          ...items,
          {
            value: res.correlation,
            label: res.correlation,
          },
        ];
    });
  });

  rankingCorrelations.forEach((result) => {
    result.forEach((res) => {
      if (!items.map((i) => i.label).includes(res.correlation))
        items = [
          ...items,
          {
            value: res.correlation,
            label: res.correlation,
          },
        ];
    });
  });
  return items;
};

// export const filterResults = (
//   results: ResultsType,
//   matrixFilter: string,
//   methodFilter: string,
//   correlationFilter: string,
// ) => {
//   if (results === null) return results;
//   const filteredResults = { ...results };

//   if (matrixFilter !== '') {
//     filteredResults.method = filteredResults.method.length > 0 ? [filteredResults?.method[+matrixFilter]] : [];
//     filteredResults.methodCorrelations =
//       filteredResults.methodCorrelations.length > 0 ? [filteredResults?.methodCorrelations[+matrixFilter]] : [];
//     filteredResults.methodRankings =
//       filteredResults.methodRankings.length > 0 ? [filteredResults?.methodRankings[+matrixFilter]] : [];
//     filteredResults.rankingCorrelations =
//       filteredResults.rankingCorrelations.length > 0 ? [filteredResults?.rankingCorrelations[+matrixFilter]] : [];
//   }

//   if (methodFilter !== '') {
//     filteredResults.method =
//       filteredResults.method.length > 0
//         ? [
//             ...filteredResults.method
//               .map((methods) => {
//                 return methods.filter((item) => item.method.toLowerCase() === methodFilter.toLowerCase());
//               })
//               .filter((m) => m.length !== 0),
//           ]
//         : [];
//     filteredResults.methodCorrelations =
//       filteredResults.methodCorrelations.length > 0
//         ? [
//             ...filteredResults.methodCorrelations
//               .map((corrs) => {
//                 return corrs.filter((corr) =>
//                   corr.methods.map((c) => c.method.toLowerCase()).includes(methodFilter.toLowerCase()),
//                 );
//               })
//               .filter((corrs) => corrs.length !== 0),
//           ]
//         : [];
//     filteredResults.methodRankings =
//       filteredResults.methodRankings.length > 0
//         ? [
//             ...filteredResults.methodRankings
//               .map((ranks) => {
//                 return ranks
//                   .map((rank) => {
//                     return rank.filter((r) => r.methods.method.toLowerCase() === methodFilter.toLowerCase());
//                   })
//                   .filter((rank) => rank.length !== 0);
//               })
//               .filter((ranks) => ranks.length !== 0),
//           ]
//         : [];
//     filteredResults.rankingCorrelations =
//       filteredResults.rankingCorrelations.length > 0
//         ? [
//             ...filteredResults.rankingCorrelations
//               .map((corrs) => {
//                 return corrs.filter((corr) => {
//                   return corr.methods.map((m) => m.method.toLowerCase()).includes(methodFilter.toLowerCase());
//                 });
//               })
//               .filter((corrs) => corrs.length !== 0),
//           ]
//         : [];
//   }

//   if (correlationFilter !== '') {
//     filteredResults.methodCorrelations =
//       filteredResults.methodCorrelations.length > 0
//         ? [
//             ...filteredResults.methodCorrelations
//               .map((corrs) => {
//                 return corrs.filter((corr) => corr.correlation.toLowerCase() === correlationFilter.toLowerCase());
//               })
//               .filter((corrs) => corrs.length > 0),
//           ]
//         : [];
//     filteredResults.rankingCorrelations =
//       filteredResults.rankingCorrelations.length > 0
//         ? [
//             ...filteredResults.rankingCorrelations
//               .map((corrs) => {
//                 return corrs.filter((corr) => corr.correlation.toLowerCase() === correlationFilter.toLowerCase());
//               })
//               .filter((corrs) => corrs.length !== 0),
//           ]
//         : [];
//   }

//   return filteredResults;
// };

type FiltersProps = {
  matrix: string;
  weights: string;
  method: string;
  correlation: string;
};
// NEW
export const filterResults = (results: ResultsNode[], filters: FiltersProps) => {
  if (results.length === 0) return [];
  let filtered = results;
  if (filters.matrix !== '') {
    filtered = [
      ...filtered.filter((node) => node.id === +filters.matrix),
      ...filtered.filter((node) => node.data.filter((item) => item?.matrix_id === +filters.matrix).length > 0),
    ];
  }
  return filtered;
};
