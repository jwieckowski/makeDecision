import { 
  AllMethodsItem, 
  MethodAdditional,
  ResultsType
} from "../redux/types"

export const filterMethodsType = (data: [] | AllMethodsItem[], type: string) => {
  return data.filter(d => d.type === type)
}

export const getMethodData = (data: [] | AllMethodsItem[], key: string) => {
  return data.filter(d => d.key.toLowerCase() === key.toLowerCase())[0]
}

export const getSingleItemByID = (data: AllMethodsItem, id: number) => {
  return data.data.filter(d => d.id === id)
}

export const getSingleItemByName = (data: AllMethodsItem, name: string) => {
  return data.data.filter(d => d.name.toLowerCase() === name.toLowerCase())[0]
}

export const getFilteredMethods = (array: AllMethodsItem, extension: string) => {
  return array.data.filter(a => a.extensions.includes(extension as never))
}

export const getAdditionalParameters = (additional: MethodAdditional[] | null | undefined, extension: string) => {
  if (additional === null || additional === undefined) return []
  return additional.filter(a => a.extension === extension)
}

export const removeFirst = (src: string[], element: string) => {
  const index = src.indexOf(element);
  if (index === -1) return src;
  return [...src.slice(0, index), ...src.slice(index + 1)];
}

export const areResultsAvailable = (results: [] | ResultsType) => {
  if (Array.isArray(results)) return false

  const l1 = results.method.length === 0
  const l2 = results.methodCorrelations.length === 0
  const l3 = results.methodRankings.length === 0
  const l4 = results.rankingCorrelations.length === 0

  return [l1, l2, l3, l4].some(l => l === false)
} 