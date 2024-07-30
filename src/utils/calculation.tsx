// TYPES
import { BlockType, CalculationNode } from '@/types';

const useCalculation = () => {
  const getMatrixWeightsConnections = (blocks: [] | BlockType[], connections: [] | string[][], matrix: BlockType) => {
    let weightsItems: [] | BlockType[] = [];

    connections.forEach((connection) => {
      if (connection[0] === matrix.id.toString()) {
        weightsItems = [...weightsItems, blocks.filter((block) => block.id === +connection[1])[0]];
      }
    });

    return weightsItems;
  };

  const getWeightsMethodConnections = (weightsItems: BlockType[], blocks: BlockType[], connections: string[][]) => {
    let mcdaItems: [] | BlockType[][] = [];

    weightsItems.forEach((w) => {
      let mcdaMethodItems: [] | BlockType[] = [];
      connections.forEach((connection) => {
        if (connection[0] === w.id.toString()) {
          mcdaMethodItems = [...mcdaMethodItems, blocks.filter((block) => block.id === +connection[1])[0]];
        }
      });
      // if no connection from weight then insert empty array
      if (!connections.map((c) => c[0]).includes(w.id.toString())) {
        mcdaMethodItems = [];
      }
      if (mcdaMethodItems.length > 0) {
        mcdaItems = [...mcdaItems, [...mcdaMethodItems]];
      }
    });

    return mcdaItems;
  };

  const getConnectionsTo = (id: number, connections: string[][]) => {
    return connections.filter((con) => +con[0] === id).map((con) => +con[1]);
  };

  const getConnectionsFrom = (id: number, connections: string[][]) => {
    return connections.filter((con) => +con[1] === id).map((con) => +con[0]);
  };

  const getMatrixData = (block: BlockType) => {
    return {
      matrix: block.data.matrix,
      criteria_types: block.data.criteriaTypes,
    };
  };

  const getWeightsData = (block: BlockType) => {
    return {
      weights: block.data.weights,
    };
  };

  const getMethodsData = (block: BlockType) => {
    if (block.name === 'input') {
      return {
        kwargs: [{ preference: block.data.preference }],
      };
    } else {
      return {
        kwargs: block.data.kwargs.map((item) => {
          return {
            matrix_id: item.matrixId,
            ...item.data.reduce((a, v) => ({ ...a, [v.parameter]: v.value }), {}),
          };
        }),
      };
    }
  };
  const getRankingsData = (block: BlockType) => {
    if (block.name !== 'input') return null;
    return {
      kwargs: [{ ranking: block.data.preference }],
    };
  };

  const getCalculationBody = (blocks: BlockType[], connections: string[][]) => {
    const data: CalculationNode[] = blocks.map((block) => {
      return {
        id: block.id,
        node_type: block.type,
        extension: block.data.extension,
        method: block.name,
        connections_from: getConnectionsFrom(block.id, connections),
        connections_to: getConnectionsTo(block.id, connections),
        position_x: block.position.x,
        position_y: block.position.y,
        ...(block.type === 'matrix' && getMatrixData(block)),
        ...(block.type === 'weights' && getWeightsData(block)),
        ...(block.type === 'method' && getMethodsData(block)),
        ...(block.type === 'ranking' && getRankingsData(block)),
      };
    });

    return data;
  };

  return {
    getMatrixWeightsConnections,
    getWeightsMethodConnections,
    getCalculationBody,
  };
};

export default useCalculation;
