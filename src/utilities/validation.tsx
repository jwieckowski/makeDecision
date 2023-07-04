import { useTranslation } from "react-i18next";

// TYPES
import { BlockType } from "../redux/types";

// UTILS
import useSnackbars from "./snackbars";

const useValidation = () => {
  const { showSnackbar } = useSnackbars();
  const { t } = useTranslation();

  const validateCrispInput = (data: BlockType, value: any) => {
    if (data === null) return;
    if (data.data.extension === "fuzzy") return true;

    if (!isNaN(+value)) return true;
    return false;
  };
  const validateFuzzyInput = (data: BlockType, value: any) => {
    if (data === null) return;
    if (data.data.extension === "crisp") return true;

    // check if three number separated by comma are given
    let splitted = value.split(",");
    // check if not a number value in fuzzy set
    if (splitted.some((item: string) => isNaN(+item))) return false;

    if (splitted.length !== 0) return true;

    let numbers = splitted.map((n: string) => +n);
    // check if values are given in ascending order or equal than previous value
    if (
      !numbers.every((v: number, i: number) => i === 0 || v >= numbers[i - 1])
    )
      return true;

    return false;
  };

  const validateMatrixInputData = (blocks: BlockType[]) => {
    if (blocks.length === 0) {
      showSnackbar(t("snackbar:no-input-data"), "error");
      return false;
    }
    return true;
  };

  const validateMatrixWeightsConnections = (
    blocks: BlockType[],
    id: number
  ) => {
    if (blocks.length === 0) {
      showSnackbar(t("snackbar:matrix-weights-not-connected", { id }), "error");
      return false;
    }
    return true;
  };

  const validateUploadedMatrix = (block: BlockType, id: number) => {
    if (
      block.method === "file" &&
      Array.isArray(block.data.matrix) &&
      block.data.matrix.length === 0
    ) {
      showSnackbar(t("snackbar:empty-uploaded-matrix", { id }), "error");
      return false;
    }
    return true;
  };

  const validateUserInputMatrixEmpty = (block: BlockType, id: number) => {
    if (block.method !== "input") return true;
    if (block.data.matrix.length === 0) {
      showSnackbar(t("snackbar:empty-input-matrix", { id }), "error");
      return false;
    }
    return true;
  };

  const validateUserInputCrispMatrixZeros = (block: BlockType, id: number) => {
    if (block.method !== "input") return true;
    if (
      block.data.matrix
        .map((r: number[]) => r.some((item) => item === 0) === true)
        .some((r: boolean) => r === true) === true
    ) {
      showSnackbar(t("snackbar:zeros-in-matrix", { id }), "error");
      return false;
    }
    return true;
  };

  const validateUserInputCrispMatrixSameValuesInColumn = (
    block: BlockType,
    id: number
  ) => {
    if (block.method !== "input") return true;

    for (let i = 0; i < block.data.matrix[0].length; i++) {
      const colValue = [...block.data.matrix.map((r: number[]) => r[i])];
      const unique = Array.from(new Set(colValue));
      if (unique.length === 1) {
        showSnackbar(
          t("snackbar:same-values-in-column", { column: i, id }),
          "error"
        );
        return false;
      }
    }
    return true;
  };

  const validateUserInputFuzzyMatrixZeros = (block: BlockType, id: number) => {
    if (block.method !== "input") return true;
    if (
      block.data.matrix
        .map((r: string[]) => r.some((item) => item === "0, 0, 0") === true)
        .some((r: boolean) => r === true) === true
    ) {
      showSnackbar(t("snackbar:zeros-in-matrix", { id }), "error");
      return false;
    }
    return true;
  };

  const validateUserInputFuzzyMatrixTFN = (block: BlockType, id: number) => {
    if (block.method !== "input") return true;
    if (
      block.data.matrix
        .map(
          (r: string[]) =>
            r.some(
              (item) =>
                item.split(",").length !== 3 ||
                item.split(",").some((item: string) => item.trim() === "")
            ) === true
        )
        .some((r: boolean) => r === true) === true
    ) {
      showSnackbar(t("snackbar:fuzzy-matrix-comma", { id }), "error");
      return false;
    }
    return true;
  };

  const validateUserInputFuzzyMatrixOrder = (block: BlockType, id: number) => {
    if (block.method !== "input") return true;
    if (
      block.data.matrix
        .map(
          (r: string[]) =>
            r.some((item) => {
              const numbers = item.split(",").map((n) => +n);
              return !numbers.every(
                (v: number, i: number) => i === 0 || v >= numbers[i - 1]
              );
            }) === true
        )
        .some((r: boolean) => r === true) === true
    ) {
      showSnackbar(t("snackbar:fuzzy-matrix-ascending", { id }), "error");
      return false;
    }
    return true;
  };

  const validateCriteriaTypes = (block: BlockType) => {
    // ALL CRITERIA TYPES ITEMS
    if (block.data.types.length === 0) {
      showSnackbar(
        t("snackbar:none-criteria-types", { id: block._id }),
        "error"
      );
      return false;
    }

    // SOME CRITERIA TYPES ITEMS
    let size =
      block.method === "random"
        ? block.data.criteria
        : block.data.matrix[0].length;
    if (
      block.data.types.includes("" as never) ||
      size !== block.data.types.length
    ) {
      showSnackbar(
        t("snackbar:missing-criteria-types", { id: block._id }),
        "error"
      );
      return false;
    }
    return true;
  };

  const validateMethodConnection = (block: [] | BlockType[][], id: number) => {
    if (block.length === 0) {
      showSnackbar(t("snackbar:no-mcda-method", { id: id }), "error");
      return false;
    }
    return true;
  };

  const validateUserInputWeights = (block: BlockType) => {
    if (block.method === "input" && block.data.weights.length === 0) {
      showSnackbar(t("snackbar:no-input-weights", { id: block._id }), "error");
      return false;
    }
    return true;
  };

  const validateUserInputCrispWeightsValues = (block: BlockType) => {
    const sum = block.data.weights
      .map((w) => +w)
      .reduce((total, value) => Number(total) + Number(value), 0);
    // check if weights are greater than 0
    if (block.data.weights.some((w) => +w === 0)) {
      showSnackbar(t("snackbar:zero-in-weights", { id: block._id }), "error");
      return false;
    } else if (block.data.weights.some((w) => +w < 0)) {
      showSnackbar(t("snackbar:minus-in-weights", { id: block._id }), "error");
      return false;
    } else if (Math.round(sum * 100) / 100 !== 1) {
      showSnackbar(t("snackbar:sum-weights", { id: block._id }), "error");
      return false;
    }
    return true;
  };

  const validateUserInputFuzzyWeightsZeros = (block: BlockType) => {
    if (
      block.data.weights.some((item: string) => item === "0, 0, 0") === true
    ) {
      showSnackbar(t("snackbar:zero-in-weights", { id: block._id }), "error");
      return false;
    }
    return true;
  };

  const validateUserInputFuzzyWeightsTFN = (block: BlockType) => {
    if (
      block.data.weights.some(
        (item) =>
          item.split(",").length !== 3 ||
          item.split(",").some((item: string) => item.trim() === "")
      ) === true
    ) {
      showSnackbar(
        t("snackbar:fuzzy-weights-comma", { id: block._id }),
        "error"
      );
      return false;
    }
    return true;
  };

  const validateUserInputFuzzyWeightsOrder = (block: BlockType) => {
    if (
      block.data.weights.some((item) => {
        const numbers = item.split(",").map((n) => +n);
        return !numbers.every(
          (v: number, i: number) => i === 0 || v >= numbers[i - 1]
        );
      }) === true
    ) {
      showSnackbar(
        t("snackbar:fuzzy-weights-ascending", { id: block._id }),
        "error"
      );
      return false;
    }
    return true;
  };

  return {
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
    validateMethodConnection,
    validateUserInputWeights,
    validateUserInputCrispWeightsValues,
    validateUserInputFuzzyWeightsZeros,
    validateUserInputFuzzyWeightsTFN,
    validateUserInputFuzzyWeightsOrder,
  };
};

export default useValidation;
