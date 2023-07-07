export const BASE_URL = "https://jwieckowski.pythonanywhere.com";

export const APP_NAME_PATH = "gui";

// APPLICATION CONST
export const NAV_HEIGHT = 80;
export const DRAWER_MIN_WIDTH = 350;
export const METHODS_LIST_HEIGHT = 430;
export const DRAG_AREA_SPACE = 40;

export const HIDE_DURATION = 4000;

export const DEFAULT_ALTERNATIVES = 3;
export const DEFAULT_CRITERIA = 3;
export const MIN_ALTERNATIVES = 2;
export const MAX_ALTERNATIVES = 20;
export const MIN_CRITERIA = 1;
export const MAX_CRITERIA = 15;

export const ZOOM_STEP = 0.05;

export const DRAWER_WIDTH = 20;
export const MODAL_MIN_WIDTH = 400;
export const MODAL_MAX_WIDTH = 700;
export const MENU_ITEM_WIDTH = 140;

// CONTACT AND SOCIALS
export const GITHUB_PROFILE_LABEL = "jwieckowski";
export const GITHUB_PROFILE_LINK = "https://github.com/jwieckowski";
export const EMAIL_LABEL = "j.wieckowski@il-pib.pl";
export const EMAIL_LINK = "mailto: j.wieckowski@il-pib.pl?subject=GUI MCDA app";
export const COMET_LABEL = "comet.edu.pl";
export const COMET_LINK = "http://comet.edu.pl";
export const MCDA_IT_LABEL = "MCDA Method Selection Tool";
export const MCDA_IT_LINK = "https://mcda.it/";

// TECHNOLOGY
export const API_DOCUMENTATION =
  "https://jwieckowski.pythonanywhere.com/api/v1/documentation";
export const REACT_LINK = "https://react.dev/";
export const RTK_LINK = "https://redux-toolkit.js.org/";
export const DRAGGABLE_LINK =
  "https://github.com/react-grid-layout/react-draggable";
export const XARROWS_LINK = "https://eliav2.github.io/react-xarrows/";

// PACKAGES
export const PYMCDM_LABEL =
  "pymcdm - Crisp Multi-Criteria Decision Making techniques";
export const PYMCDM_LINK = "https://pypi.org/project/pymcdm/";
export const PYMCDM_APA =
  "Kizielewicz, B., Shekhovtsov, A., & Sałabun, W. (2023). pymcdm—The universal library for solving multi-criteria decision-making problems. SoftwareX, 22, 101368.";
export const PYMCDM_DOI = "https://doi.org/10.1016/j.softx.2023.101368";

export const PYFDM_LABEL =
  "pyfdm - Fuzzy Multi-Criteria Decision Making techniques";
export const PYFDM_LINK = "https://pypi.org/project/pyfdm/";
export const PYFDM_APA =
  "Więckowski, J., Kizielewicz, B., & Sałabun, W. (2022). pyFDM: A Python library for uncertainty decision analysis methods. SoftwareX, 20, 101271.";
export const PYFDM_DOI = "https://doi.org/10.1016/j.softx.2022.101271";

export const PYIFDM_LABEL =
  "pyifdm - Intuitionistic Multi-Criteria Decision Making techniques";
export const PYIFDM_LINK = "https://pypi.org/project/pyifdm/";
export const PYIFDM_APA =
  "Więckowski, J., Kizielewicz, B., & Sałabun, W. (2023). Handling decision-making in Intuitionistic Fuzzy environment: PyIFDM package. SoftwareX, 22, 101344.";
export const PYIFDM_DOI = "https://doi.org/10.1016/j.softx.2023.101344";

// ROUTER
export const PAGES = ["Home", "Calculations", "Methods", "About", "Contact"];
export const URLS = ["", "/calculation", "/methods", "/about", "/contact"];

// ITEMS
export const PATHS = [
  {
    label: "smooth",
    value: "smooth",
  },
  {
    label: "grid",
    value: "grid",
  },
  {
    label: "straight",
    value: "straight",
  },
];

export const LANGUAGES = [
  {
    label: "EN",
    value: "en",
  },
  {
    label: "PL",
    value: "pl",
  },
];

// FILES DOWNLOAD
export const CRISP_JSON_FILE = "crisp_data_json.json";
export const FUZZY_JSON_FILE = "fuzzy_data_json.json";
export const CRISP_CSV_FILE = "crisp_data_csv.csv";
export const FUZZY_CSV_FILE = "fuzzy_data_csv.csv";
export const CRISP_XLSX_FILE = "crisp_data_xlsx.xlsx";
export const FUZZY_XLSX_FILE = "fuzzy_data_xlsx.xlsx";

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

export const CSV_CRISP_DATA = [
  "78, 56, 1,",
  "4, 45, 97,",
  "18, 2, 63,",
  "9, 14, 92,",
  "85, 9, 29,",
  "",
  "-1, 1, 1,",
];

export const CSV_FUZZY_DATA = [
  "1 2 3, 3 4 5, 2 3 4,",
  "4 5 8, 3 4 7, 1 2 3,",
  "3 5 7, 4 5 6, 7 8 9,",
  "",
  "-1, 1, 1,",
];

export const XLSX_CRISP_DATA = [
  [78, 56, 1],
  [4, 45, 97],
  [18, 2, 63],
  [9, 14, 92],
  [85, 9, 29],
  ["", "", ""],
  [-1, 1, 1],
];

export const XLSX_FUZZY_DATA = [
  ["1 2 3", "3 4 5", "2 3 4"],
  ["4 5 8", "3 4 7", "1 2 3"],
  ["3 5 7", "4 5 6", "7 8 9"],
  [],
  [-1, 1, 1],
];
