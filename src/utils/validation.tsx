import { useTranslation } from 'react-i18next';

// TYPES
import { BlockType } from '@/types';

// UTILS
import useSnackbars from './snackbars';

const useValidation = () => {
  const { showSnackbar } = useSnackbars();
  const { t } = useTranslation();

  const validateMatrixBounds = (lower: number, upper: number) => {
    if (lower >= upper) return false;

    return true;
  };

  const validateCrispInput = (extension: string, value: any) => {
    if (extension === 'fuzzy') return true;

    if (!isNaN(+value)) return true;
    return false;
  };
  const validateFuzzyInput = (extension: string, value: any) => {
    if (extension === 'crisp') return true;

    // check if three number separated by comma are given
    const splitted = value.split(',');
    // check if not a number value in fuzzy set
    if (splitted.some((item: string) => isNaN(+item))) return false;

    if (splitted.length > 3) return false;
    if (splitted.length !== 0) return true;

    const numbers = splitted.map((n: string) => +n);
    // check if values are given in ascending order or equal than previous value
    if (!numbers.every((v: number, i: number) => i === 0 || v >= numbers[i - 1])) return true;

    return false;
  };

  const validateMatrixInputData = (blocks: BlockType[]) => {
    if (blocks.length === 0) {
      showSnackbar(t('snackbar:no-input-data'), 'error');
      return false;
    }
    return true;
  };

  const validateMatrixWeightsConnections = (blocks: BlockType[], id: number) => {
    if (blocks.length === 0) {
      showSnackbar(t('snackbar:matrix-weights-not-connected', { id }), 'error');
      return false;
    }
    return true;
  };

  const validateUploadedMatrix = (block: BlockType, id: number) => {
    if (block.name !== 'file') return true;
    if (
      (Array.isArray(block.data.matrix) && block.data.matrix.length === 0) ||
      block.data.matrix.map((r: number[]) => r.some((item) => item === 0) === true).some((r: boolean) => r === true) ===
        true
    ) {
      showSnackbar(t('snackbar:empty-uploaded-matrix', { id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputMatrixEmpty = (matrix: string[][], id: number) => {
    if (matrix.length === 0) {
      showSnackbar(t('snackbar:empty-input-matrix', { id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputCrispMatrixZeros = (matrix: string[][], id: number) => {
    if (matrix.map((r: string[]) => r.some((item) => +item === 0) === true).some((r: boolean) => r === true) === true) {
      showSnackbar(t('snackbar:zeros-in-matrix', { id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputCrispMatrixSameValuesInColumn = (matrix: string[][], id: number) => {
    for (let i = 0; i < matrix[0].length; i++) {
      const colValue = [...matrix.map((r: string[]) => r[i])];
      const unique = Array.from(new Set(colValue));
      if (unique.length === 1) {
        showSnackbar(t('snackbar:same-values-in-column', { column: i + 1, id }), 'error');
        return false;
      }
    }
    return true;
  };

  const validateUserInputFuzzyMatrixZeros = (matrix: string[][], id: number) => {
    if (
      matrix.map((r: string[]) => r.some((item) => item === '0, 0, 0') === true).some((r: boolean) => r === true) ===
      true
    ) {
      showSnackbar(t('snackbar:zeros-in-matrix', { id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputFuzzyMatrixTFN = (matrix: string[][], id: number) => {
    if (
      matrix
        .map(
          (r: string[]) =>
            r.some(
              (item) => item.split(',').length !== 3 || item.split(',').some((item: string) => item.trim() === ''),
            ) === true,
        )
        .some((r: boolean) => r === true) === true
    ) {
      showSnackbar(t('snackbar:fuzzy-matrix-comma', { id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputFuzzyMatrixOrder = (matrix: string[][], id: number) => {
    if (
      matrix
        .map(
          (r: string[]) =>
            r.some((item) => {
              const numbers = item.split(',').map((n) => +n);
              return !numbers.every((v: number, i: number) => i === 0 || v >= numbers[i - 1]);
            }) === true,
        )
        .some((r: boolean) => r === true) === true
    ) {
      showSnackbar(t('snackbar:fuzzy-matrix-ascending', { id }), 'error');
      return false;
    }
    return true;
  };

  const validateMatrixData = (matrix: string[][], extension: string, id: number) => {
    if (extension === 'crisp') {
      if (!validateUserInputCrispMatrixZeros(matrix, id)) return false;
      if (!validateUserInputMatrixEmpty(matrix, id)) return false;
      if (!validateUserInputCrispMatrixSameValuesInColumn(matrix, id)) return false;
    } else if (extension === 'fuzzy') {
      if (!validateUserInputFuzzyMatrixZeros(matrix, id)) return false;
      if (!validateUserInputFuzzyMatrixTFN(matrix, id)) return false;
      if (!validateUserInputFuzzyMatrixOrder(matrix, id)) return false;
    }
    return true;
  };

  const validateCriteriaTypes = (block: BlockType) => {
    // ALL CRITERIA TYPES ITEMS
    if (block.data.criteriaTypes.length === 0) {
      showSnackbar(t('snackbar:none-criteria-types', { id: block.id }), 'error');
      return false;
    }

    // SOME CRITERIA TYPES ITEMS
    const size = block.name === 'random' ? block.data.criteria : block.data.matrix[0].length;
    if (block.data.criteriaTypes.includes('' as never) || size !== block.data.criteriaTypes.length) {
      showSnackbar(t('snackbar:missing-criteria-types', { id: block.id }), 'error');
      return false;
    }

    return true;
  };

  const validateSameCriteriaTypes = (methods: string[], types: number[]) => {
    let calculate = true;
    methods.forEach((method) => {
      if (['COPRAS', 'MOORA', 'OCRA'].includes(method.toUpperCase()) && Array.from(new Set(types)).length === 1) {
        showSnackbar(t('snackbar:same-criteria-types', { method: method.toUpperCase() }), 'error');
        calculate = false;
        return;
      }
    });
    return calculate;
  };

  // const validateWeightsMethodConnection = (
  //   weights: [] | BlockType[],
  //   connections: string[][]
  // ) => {
  //   weights.forEach((item) => {});
  // };

  const validateMethodConnection = (block: [] | BlockType[][], id: number) => {
    if (block.length === 0) {
      showSnackbar(t('snackbar:no-mcda-method', { id: id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputWeights = (weights: string[], id: number) => {
    if (weights.length === 0) {
      showSnackbar(t('snackbar:no-input-weights', { id: id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputCrispWeightsValues = (weights: string[], id: number) => {
    const sum = weights.map((w) => +w).reduce((total, value) => Number(total) + Number(value), 0);
    // check if weights are greater than 0
    if (weights.some((w) => +w === 0)) {
      showSnackbar(t('snackbar:zero-in-weights', { id: id }), 'error');
      return false;
    } else if (weights.some((w) => +w < 0)) {
      showSnackbar(t('snackbar:minus-in-weights', { id: id }), 'error');
      return false;
    } else if (Math.round(sum * 100) / 100 !== 1) {
      showSnackbar(t('snackbar:sum-weights', { id: id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputFuzzyWeightsZeros = (weights: string[], id: number) => {
    if (weights.some((item: string) => item === '0, 0, 0') === true) {
      showSnackbar(t('snackbar:zero-in-weights', { id: id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputFuzzyWeightsTFN = (weights: string[], id: number) => {
    if (
      weights.some(
        (item) => item.split(',').length !== 3 || item.split(',').some((item: string) => item.trim() === ''),
      ) === true
    ) {
      showSnackbar(t('snackbar:fuzzy-weights-comma', { id: id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputFuzzyWeightsOrder = (weights: string[], id: number) => {
    if (
      weights.some((item) => {
        const numbers = item.split(',').map((n) => +n);
        return !numbers.every((v: number, i: number) => i === 0 || v >= numbers[i - 1]);
      }) === true
    ) {
      showSnackbar(t('snackbar:fuzzy-weights-ascending', { id: id }), 'error');
      return false;
    }
    return true;
  };

  const validateUserInputWeightsData = (weights: string[], extension: string, id: number) => {
    if (!validateUserInputWeights(weights, id)) return false;

    if (extension === 'crisp') {
      if (!validateUserInputCrispWeightsValues(weights, id)) return false;
    } else if (extension === 'fuzzy') {
      if (!validateUserInputFuzzyWeightsZeros(weights, id)) return false;
      if (!validateUserInputFuzzyWeightsTFN(weights, id)) return false;
      if (!validateUserInputFuzzyWeightsTFN(weights, id)) return false;
    }
    return true;
  };

  return {
    validateMatrixBounds,
    validateCrispInput,
    validateFuzzyInput,
    validateMatrixInputData,
    validateMatrixWeightsConnections,
    validateUploadedMatrix,
    validateUserInputMatrixEmpty,
    validateUserInputCrispMatrixZeros,
    validateUserInputCrispMatrixSameValuesInColumn,
    validateUserInputFuzzyMatrixZeros,
    validateUserInputFuzzyMatrixTFN,
    validateUserInputFuzzyMatrixOrder,
    validateCriteriaTypes,
    validateSameCriteriaTypes,
    validateMethodConnection,
    validateUserInputWeights,
    validateUserInputCrispWeightsValues,
    validateUserInputFuzzyWeightsZeros,
    validateUserInputFuzzyWeightsTFN,
    validateUserInputFuzzyWeightsOrder,
    validateMatrixData,
    validateUserInputWeightsData,
  };
};

export default useValidation;
