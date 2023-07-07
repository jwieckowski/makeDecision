// TYPES
import {
  BlockType,
  MethodType,
  MethodCorrelationType,
  MethodRankingType,
  AllMethodsItem,
  RankingCorrelationType,
  CalculationBodyType,
} from "../redux/types";

// UTILS
import { getSingleItemByName, getMethodData } from "./filtering";
import useValidation from "./validation";

const useCalculation = () => {
  const {
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
  } = useValidation();

  const getMatrixWeightsConnections = (
    blocks: [] | BlockType[],
    connections: [] | string[][],
    matrix: BlockType
  ) => {
    let weightsItems: [] | BlockType[] = [];

    connections.forEach((connection) => {
      if (connection[0] === matrix._id.toString()) {
        weightsItems = [
          ...weightsItems,
          blocks.filter((block) => block._id === +connection[1])[0],
        ];
      }
    });

    return weightsItems;
  };

  const getWeightsMethodConnections = (
    weightsItems: [] | BlockType[],
    blocks: [] | BlockType[],
    connections: [] | string[][]
  ) => {
    let mcdaItems: [] | BlockType[][] = [];

    weightsItems.forEach((w) => {
      let mcdaMethodItems: [] | BlockType[] = [];
      connections.forEach((connection) => {
        if (connection[0] === w._id.toString()) {
          mcdaMethodItems = [
            ...mcdaMethodItems,
            blocks.filter((block) => block._id === +connection[1])[0],
          ];
        }
      });
      // if no connection from weight then insert empty array
      if (!connections.map((c) => c[0]).includes(w._id.toString())) {
        mcdaMethodItems = [];
      }
      if (mcdaMethodItems.length > 0) {
        mcdaItems = [...mcdaItems, [...mcdaMethodItems]];
      }
    });

    return mcdaItems;
  };

  const getMethodsParams = (
    mcdaItems: [] | BlockType[][],
    matrixIdx: number,
    extension: string
  ) => {
    let params: [] | any = [];
    mcdaItems.forEach((items) => {
      items.forEach((item) => {
        params = [
          ...params,
          {
            extension: extension,
            additional:
              item.data.additionals[matrixIdx] === undefined
                ? {}
                : item.data.additionals[matrixIdx],
            method: item.method,
          },
        ];
      });
    });

    params = [
      ...params.map((param: any) => {
        let additionals = {};
        if (Object.keys(param.additional).length > 0) {
          additionals = param.additional.reduce(
            (a: any, v: any) => ({
              ...a,
              [Object.keys(v)[0]]: v[Object.keys(v)[0]],
            }),
            {}
          );
        }
        return { ...param, additional: additionals };
      }),
    ];

    return params;
  };

  const createWeightMethodPair = (
    weightsItems: [] | BlockType[],
    mcdaItems: [] | BlockType[][]
  ) => {
    let methodItem: MethodType[] = [];

    weightsItems.forEach((item, index) => {
      mcdaItems[index]?.forEach((mcda) => {
        methodItem = [
          ...methodItem,
          {
            method: mcda.method,
            weights:
              item.method === "input"
                ? `${item.data.weights[0]}`.includes(",")
                  ? item.data.weights
                  : item.data.weights.map((w) => +w)
                : item.method,
          },
        ];
      });
    });

    return methodItem;
  };

  const getMethodCorrelationConnections = (
    blocks: [] | BlockType[],
    connections: [] | string[][],
    weightsItems: [] | BlockType[],
    mcdaItems: [] | BlockType[][]
  ) => {
    const correlationBlocks = blocks.filter(
      (block) => block.type === "correlation"
    );
    let methodCorrelationItem: [] | MethodCorrelationType[] = [];

    correlationBlocks.forEach((block) => {
      const blockConnections = connections.filter(
        (c) =>
          c[1] === block._id.toString() &&
          mcdaItems.filter(
            (items) => items.filter((i) => i._id === +c[0]).length > 0
          )
      );
      let methodCorrelation: MethodCorrelationType = {
        correlation: block.method,
        data: [],
      };
      blockConnections.forEach((c) => {
        weightsItems.forEach((item, index) => {
          mcdaItems[index].forEach((mcda) => {
            if (mcda._id === +c[0]) {
              methodCorrelation.data = [
                ...methodCorrelation.data,
                {
                  method: mcda.method,
                  weights: item.method,
                },
              ];
            }
          });
        });
      });
      if (methodCorrelation.data.length > 0) {
        methodCorrelationItem = [...methodCorrelationItem, methodCorrelation];
      }
    });
    return methodCorrelationItem;
  };

  const getMethodRankingConnections = (
    blocks: [] | BlockType[],
    connections: [] | string[][],
    weightsItems: [] | BlockType[],
    mcdaItems: [] | BlockType[][],
    allMethods: [] | AllMethodsItem[]
  ) => {
    const rankingBlocks = blocks.filter((block) => block.type === "ranking");
    let methodRankingItem: [] | MethodRankingType[] = [];

    rankingBlocks.forEach((block) => {
      const blockConnections = connections.filter(
        (c) =>
          c[1] === block._id.toString() &&
          mcdaItems.filter(
            (items) => items.filter((i) => i._id === +c[0]).length > 0
          )
      );
      let methodRanking: MethodRankingType = { data: [] };

      blockConnections.forEach((c) => {
        weightsItems.forEach((item, index) => {
          mcdaItems[index].forEach((mcda) => {
            if (mcda._id === +c[0]) {
              const data = getSingleItemByName(
                getMethodData(allMethods, "Method"),
                blocks.filter((block) => block._id === +c[0])[0].method
              );
              methodRanking.data = [
                ...methodRanking.data,
                {
                  method: mcda.method,
                  weights: item.method,
                  order: data?.order ? data.order : "",
                },
              ];
            }
          });
        });
      });
      if (methodRanking.data.length > 0) {
        methodRankingItem = [...methodRankingItem, methodRanking];
      }
    });

    return methodRankingItem;
  };

  const getRankingCorrelationConnections = (
    blocks: [] | BlockType[],
    connections: [] | string[][],
    weightsItems: [] | BlockType[],
    mcdaItems: [] | BlockType[][],
    allMethods: [] | AllMethodsItem[]
  ) => {
    const rankingBlocks = blocks.filter((block) => block.type === "ranking");
    const correlationBlocks = blocks.filter(
      (block) => block.type === "correlation"
    );
    let rankingCorrelationItem: [] | RankingCorrelationType[] = [];

    rankingBlocks.forEach((block) => {
      const rankCorrConnections = connections.filter(
        (c) =>
          c[0] === block._id.toString() &&
          correlationBlocks.map((b) => b._id).includes(+c[1])
      );
      rankCorrConnections.forEach((c) => {
        const blockConnections = connections.filter(
          (c) =>
            c[1] === block._id.toString() &&
            mcdaItems.filter(
              (items) => items.filter((i) => i._id === +c[0]).length > 0
            )
        );
        let rankingCorrelation: RankingCorrelationType = {
          correlation: blocks.filter((b) => b._id === +c[1])[0].method,
          data: [],
        };
        blockConnections.forEach((conn) => {
          weightsItems.forEach((item, index) => {
            mcdaItems[index].forEach((mcda) => {
              if (mcda._id === +conn[0]) {
                const data = getSingleItemByName(
                  getMethodData(allMethods, "Method"),
                  blocks.filter((block) => block._id === +conn[0])[0].method
                );
                rankingCorrelation.data = [
                  ...rankingCorrelation.data,
                  {
                    method: mcda.method,
                    weights: item.method,
                    order: data?.order ? data.order : "",
                  },
                ];
              }
            });
          });
        });
        if (rankingCorrelation.data.length > 0) {
          rankingCorrelationItem = [
            ...rankingCorrelationItem,
            rankingCorrelation,
          ];
        }
      });
    });

    return rankingCorrelationItem;
  };

  const getCalculateBody = (
    blocks: BlockType[],
    connections: string[][],
    allMethods: AllMethodsItem[]
  ) => {
    let calculate = true;
    let body: CalculationBodyType = {
      matrix: [],
      extensions: [],
      types: [],
      method: [],
      methodCorrelations: [],
      methodRankings: [],
      rankingCorrelations: [],
      params: [],
    };

    let matrixIndexes: [] | number[] = [];
    // CHECK CONNECTIONS FROM MATRIX TO WEIGHTS BLOCKS
    const matrices = blocks.filter((block) => block.type.includes("matrix"));
    if (!validateMatrixInputData(matrices)) return;

    // FOR EACH MATRIX CREATE A CALCULATION MODEL CONNECTION
    matrices.forEach((matrix, matrixIdx) => {
      calculate = true;
      // GET WEIGHTS BLOCKS CONNECTED TO CURRENT MATRIX
      const weightsItems = getMatrixWeightsConnections(
        blocks,
        connections,
        matrix
      );

      if (!validateMatrixWeightsConnections(weightsItems, matrix._id)) {
        calculate = false;
        return;
      }

      if (!validateUploadedMatrix(matrix, matrix._id)) {
        calculate = false;
        return;
      }

      if (!validateUserInputMatrixEmpty(matrix, matrix._id)) {
        calculate = false;
        return;
      }

      if (matrix.data.extension === "crisp") {
        if (!validateUserInputCrispMatrixZeros(matrix, matrix._id)) {
          calculate = false;
          return;
        }
        if (
          !validateUserInputCrispMatrixSameValuesInColumn(matrix, matrix._id)
        ) {
          calculate = false;
          return;
        }
      } else if (matrix.data.extension === "fuzzy") {
        if (!validateUserInputFuzzyMatrixZeros(matrix, matrix._id)) {
          calculate = false;
          return;
        }
        if (!validateUserInputFuzzyMatrixTFN(matrix, matrix._id)) {
          calculate = false;
          return;
        }
        if (!validateUserInputFuzzyMatrixOrder(matrix, matrix._id)) {
          calculate = false;
          return;
        }
      }

      if (!validateCriteriaTypes(matrix)) {
        calculate = false;
        return;
      }

      // EXTENSIONS
      body.extensions = [...body.extensions, matrix.data.extension];

      // MATRIX ID
      matrixIndexes = [...matrixIndexes, matrix._id];

      // MATRIX
      if (["input", "file"].includes(matrix.method))
        body.matrix = [...body.matrix, matrix.data.matrix];
      else if (matrix.method === "random")
        body.matrix = [
          ...body.matrix,
          [matrix.data.alternatives, matrix.data.criteria],
        ];

      // TYPES
      body.types = [...body.types, matrix.data.types.map((t) => +t)];

      // INPUT WEIGHTS VALIDATION
      weightsItems.forEach((weights) => {
        if (weights.method === "input") {
          if (!validateUserInputWeights(weights)) {
            calculate = false;
            return;
          }

          if (weights.data.extension === "crisp") {
            if (!validateUserInputCrispWeightsValues(weights)) {
              calculate = false;
              return;
            }
          } else if (weights.data.extension === "fuzzy") {
            if (!validateUserInputFuzzyWeightsZeros(weights)) {
              calculate = false;
              return;
            }
            if (!validateUserInputFuzzyWeightsTFN(weights)) {
              calculate = false;
              return;
            }
            if (!validateUserInputFuzzyWeightsOrder(weights)) {
              calculate = false;
              return;
            }
          }
        }
      });

      // GET METHODS BLOCKS CONNECTED TO WEIGHTS BLOCKS
      const mcdaItems = getWeightsMethodConnections(
        weightsItems,
        blocks,
        connections
      );
      calculate = validateMethodConnection(mcdaItems, matrix._id);

      // ADDITIONAL PARAMS FOR METHODS
      const params = getMethodsParams(
        mcdaItems,
        matrixIdx,
        matrix.data.extension
      );
      body.params = [...body.params, [...params]];

      const methodItem = createWeightMethodPair(weightsItems, mcdaItems);
      if (methodItem.length > 0) {
        body.method = [...body.method, [...methodItem]];
      }

      // correlations connections -> (method -> correlation)
      const methodCorrelationItem = getMethodCorrelationConnections(
        blocks,
        connections,
        weightsItems,
        mcdaItems
      );
      if (methodCorrelationItem.length > 0) {
        body.methodCorrelations = [
          ...body.methodCorrelations,
          [...methodCorrelationItem],
        ];
      }

      // ranking connections -> (method -> ranking)
      const methodRankingItem = getMethodRankingConnections(
        blocks,
        connections,
        weightsItems,
        mcdaItems,
        allMethods
      );
      if (methodRankingItem.length > 0) {
        body.methodRankings = [...body.methodRankings, [...methodRankingItem]];
      }
      // correlations connections -> (ranking -> correlation)
      const rankingCorrelationItem = getRankingCorrelationConnections(
        blocks,
        connections,
        weightsItems,
        mcdaItems,
        allMethods
      );
      if (rankingCorrelationItem.length > 0) {
        body.rankingCorrelations = [
          ...body.rankingCorrelations,
          [...rankingCorrelationItem],
        ];
      }
    });

    return { calculate, body, matrixIndexes };
  };

  return {
    getMatrixWeightsConnections,
    getWeightsMethodConnections,
    getMethodsParams,
    createWeightMethodPair,
    getMethodCorrelationConnections,
    getMethodRankingConnections,
    getRankingCorrelationConnections,
    getCalculateBody,
  };
};

export default useCalculation;
