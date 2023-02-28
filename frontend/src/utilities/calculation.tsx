import { 
  BlockType, 
  MethodType,
  MethodCorrelationType,
  MethodRankingType,
  AllMethodsItem,
  RankingCorrelationType
} from "../redux/types"

import { getSingleItemByName, getMethodData } from "./filtering"

export const getMatrixWeightsConnections = (blocks: [] | BlockType[], connections: [] | string[][], matrix: BlockType) => {
  let weightsItems: [] | BlockType[] = []
  
  connections.forEach(connection => {
    if (connection[0] === matrix._id.toString()) {
      weightsItems = [...weightsItems, blocks.filter(block => block._id === +connection[1])[0]]
    }
  })
  
  return weightsItems
}

export const getWeightsMethodConnections = (weightsItems: [] | BlockType[], blocks: [] | BlockType[], connections: [] | string[][]) => {
  let mcdaItems: [] | BlockType[][] = []

  weightsItems.forEach(w => {
    let mcdaMethodItems: [] | BlockType[] = []
    connections.forEach(connection => {
      if (connection[0] === w._id.toString()) {
        mcdaMethodItems = [...mcdaMethodItems, blocks.filter(block => block._id === +connection[1])[0]]
      }
    })
    // if no connection from weight then insert empty array
    if (!connections.map(c => c[0]).includes(w._id.toString())) {
      mcdaMethodItems = []
    }
    if (mcdaMethodItems.length > 0) {
      mcdaItems = [...mcdaItems, [...mcdaMethodItems]]
    }
  })

  return mcdaItems
}

export const createWeightMethodPair = (weightsItems: [] | BlockType[], mcdaItems: [] | BlockType[][]) => {
  let methodItem: MethodType[] = []
  
  weightsItems.forEach((item, index) => {
    mcdaItems[index].forEach(mcda => {
      methodItem = [...methodItem, {
        method: mcda.method,
        weights: item.method === 'input' ? item.data.weights.map(w => +w) :item.method
      }]
    })
  })

  return methodItem
}

export const getMethodCorrelationConnections = (blocks: [] | BlockType[], connections: [] | string[][], weightsItems: [] | BlockType[], mcdaItems: [] | BlockType[][]) => {
  const correlationBlocks = blocks.filter(block => block.type === 'correlation')
  let methodCorrelationItem: [] | MethodCorrelationType[] = []

  correlationBlocks.forEach(block => {
    const blockConnections = connections.filter(c => c[1] === block._id.toString() && mcdaItems.filter(items => items.filter(i => i._id === +c[0]).length > 0))
    let methodCorrelation: MethodCorrelationType = {
      correlation: block.method,
      data: []
    }
    blockConnections.forEach(c => {
      weightsItems.forEach((item, index) => {
        mcdaItems[index].forEach(mcda => {
          if (mcda._id === +c[0]) {
            methodCorrelation.data = [...methodCorrelation.data, {
              method: mcda.method,
              weights: item.method
            }]
          }
        })
      })
    })
    if (methodCorrelation.data.length > 0) {
      methodCorrelationItem = [...methodCorrelationItem, methodCorrelation]
    }
  })
  return methodCorrelationItem
}

export const getMethodRankingConnections = (blocks: [] | BlockType[], connections: [] | string[][], weightsItems: [] | BlockType[], mcdaItems: [] | BlockType[][], allMethods: [] | AllMethodsItem[]) => {
  const rankingBlocks = blocks.filter(block => block.type === 'ranking')
  let methodRankingItem: [] | MethodRankingType[] = []

  rankingBlocks.forEach(block => {
    const blockConnections = connections.filter(c => c[1] === block._id.toString() && mcdaItems.filter(items => items.filter(i => i._id === +c[0]).length > 0))
    let methodRanking: MethodRankingType = {data: []}
    
    blockConnections.forEach(c => {
      weightsItems.forEach((item, index) => {
        mcdaItems[index].forEach(mcda => {
          if (mcda._id === +c[0]) {
            const data = getSingleItemByName(getMethodData(allMethods, 'Method'), blocks.filter(block => block._id === +c[0])[0].method)
            methodRanking.data = [...methodRanking.data, {
              method: mcda.method, 
              weights: item.method,
              order: data?.order ? data.order : ''
            }]
          }
        })
      })
    })
    if (methodRanking.data.length > 0 ) {
      methodRankingItem = [...methodRankingItem, methodRanking]
    }
  })

  return methodRankingItem
}

export const getRankingCorrelationConnections = (blocks: [] | BlockType[], connections: [] | string[][], weightsItems: [] | BlockType[], mcdaItems: [] | BlockType[][], allMethods: [] | AllMethodsItem[]) => {
  const rankingBlocks = blocks.filter(block => block.type === 'ranking')
  const correlationBlocks = blocks.filter(block => block.type === 'correlation')
  let rankingCorrelationItem: [] | RankingCorrelationType[] = []

  rankingBlocks.forEach(block => {
    const rankCorrConnections = connections.filter(c => c[0] === block._id.toString() && correlationBlocks.map(b => b._id).includes(+c[1]))
    rankCorrConnections.forEach(c => {
      const blockConnections = connections.filter(c => c[1] === block._id.toString() && mcdaItems.filter(items => items.filter(i => i._id === +c[0]).length > 0))
      let rankingCorrelation: RankingCorrelationType = {
        correlation: blocks.filter(b => b._id === +c[1])[0].method,
        data: []
      }
      blockConnections.forEach(conn => {
        weightsItems.forEach((item, index) => {
          mcdaItems[index].forEach(mcda => {
            if (mcda._id === +conn[0]) {
              const data = getSingleItemByName(getMethodData(allMethods, 'Method'), blocks.filter(block => block._id === +conn[0])[0].method)
              rankingCorrelation.data = [...rankingCorrelation.data, {
                method: mcda.method,
                weights: item.method,
                order: data?.order ? data.order : ''
              }]
            }
          })
        })
      })
      if (rankingCorrelation.data.length > 0) {
        rankingCorrelationItem = [...rankingCorrelationItem, rankingCorrelation]
      }
    })
  })

  return rankingCorrelationItem
}