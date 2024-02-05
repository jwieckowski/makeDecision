export const getTableLabels = (n: number, label = 'C') => {
  return Array(n)
    .fill('')
    .map((_, idx) => `${label}${idx + 1}`);
};
