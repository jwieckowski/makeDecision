// FILES DOWNLOAD
export const CRISP_JSON_FILE = 'crisp_data_json.json';
export const FUZZY_JSON_FILE = 'fuzzy_data_json.json';
export const CRISP_CSV_FILE = 'crisp_data_csv.csv';
export const FUZZY_CSV_FILE = 'fuzzy_data_csv.csv';
export const CRISP_XLSX_FILE = 'crisp_data_xlsx.xlsx';
export const FUZZY_XLSX_FILE = 'fuzzy_data_xlsx.xlsx';

// FILES FORMAT EXAMPLES
export const JSON_CRISP_DATA = {
  matrix: [
    [78, 56, 1],
    [4, 45, 97],
    [18, 2, 63],
    [9, 14, 92],
    [85, 9, 29],
  ],
  criteriaTypes: [-1, 1, 1],
};

export const JSON_FUZZY_DATA = {
  matrix: [
    [
      [1, 2, 3],
      [3, 4, 5],
      [2, 3, 4],
    ],
    [
      [4, 5, 8],
      [3, 4, 7],
      [1, 2, 3],
    ],
    [
      [3, 5, 7],
      [4, 5, 6],
      [7, 8, 9],
    ],
  ],
  criteriaTypes: [-1, 1, 1],
};

export const CSV_CRISP_DATA = ['78, 56, 1,', '4, 45, 97,', '18, 2, 63,', '9, 14, 92,', '85, 9, 29,', '', '-1, 1, 1,'];

export const CSV_FUZZY_DATA = ['1 2 3, 3 4 5, 2 3 4,', '4 5 8, 3 4 7, 1 2 3,', '3 5 7, 4 5 6, 7 8 9,', '', '-1, 1, 1,'];

export const XLSX_CRISP_DATA = [
  [78, 56, 1],
  [4, 45, 97],
  [18, 2, 63],
  [9, 14, 92],
  [85, 9, 29],
  ['', '', ''],
  [-1, 1, 1],
];

export const XLSX_FUZZY_DATA = [
  ['1 2 3', '3 4 5', '2 3 4'],
  ['4 5 8', '3 4 7', '1 2 3'],
  ['3 5 7', '4 5 6', '7 8 9'],
  [],
  [-1, 1, 1],
];
