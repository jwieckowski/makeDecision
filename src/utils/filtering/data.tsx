import { AllMethodsItem, MethodKwargs } from '@/types';

export const filterMethodsFunction = (data: [] | AllMethodsItem[], methodFunction: string) => {
  return data.filter((d) => d.function === methodFunction);
};

export const getMethodData = (data: [] | AllMethodsItem[], key: string) => {
  return data.filter((d) => d.key.toLowerCase() === key.toLowerCase())[0];
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
