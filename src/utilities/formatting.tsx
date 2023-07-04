export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const convertCrispInput = (value: string) => {
  return value.includes(".") ? value : Number(value).toString();
};

export const convertFuzzyInput = (value: string) => {
  return value;
};
