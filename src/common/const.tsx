// APP
export const TITLE: string = 'Make-Decision.it';
export const MENU_ITEMS = [
  {
    id: 0,
    href: '/',
  },
  {
    id: 1,
    href: '/calculations',
  },
  {
    id: 2,
    href: '/methods',
  },
  {
    id: 3,
    href: '/about',
  },
  {
    id: 4,
    href: '/contact',
  },
];

// UI
export const DRAWER_WIDTH: number = 250;
export const SEASON_ITEMS: number = 10;

// export const BASE_URL = 'http://api.make-decision.it/';
export const BASE_URL = 'http://127.0.0.1:5000';

export const APP_URL = 'http://make-decision.it';

export const APP_NAME_PATH = '/';

// REQUEST TIMEOUT
// export const REQUEST_TIMEOUT_CALCULATION = 300000; // 1000 * 60 * 5 (5 MINUTES)
// export const REQUEST_TIMEOUT_SHORT = 30000; // (30 seconds)
export const REQUEST_TIMEOUT_CALCULATION = 3000; // (3 seconds) TEST
export const REQUEST_TIMEOUT_SHORT = 3000; // (3 seconds) TEST

// APPLICATION CONST
export const APPLICATION_NAME = 'MakeDecision.it';
export const NAV_HEIGHT = 80;
export const DRAWER_MIN_WIDTH = 350;
export const METHODS_LIST_HEIGHT = 460;
export const DRAG_AREA_SPACE = 40;

export const HIDE_DURATION = 4000;

export const DEFAULT_ALTERNATIVES = 3;
export const DEFAULT_CRITERIA = 3;
export const MIN_ALTERNATIVES = 2;
export const MAX_ALTERNATIVES = 20;
export const MIN_CRITERIA = 2;
export const MAX_CRITERIA = 15;

export const ZOOM_STEP = 0.05;

export const MODAL_MIN_WIDTH = 400;
export const MODAL_MAX_WIDTH = 700;
export const MENU_ITEM_WIDTH = 140;

export const DRAGGABLE_WIDTH = 140;
export const DRAGGABLE_HEIGHT = 80;

export const MATRIX_INPUT_WIDTH = 80;
export const MATRIX_LABEL_WIDTH = 50;

// DRAG SETTINGS INPUT PROPS
export const MIN_SETTINGS_VALUE = 1;
export const MIN_CURVENESS_VALUE = 0.1;
export const MAX_SETTINGS_VALUE = 10;
export const MAX_CURVENESS_VALUE = 2;
export const STEP_SETTINGS_VALUE = 1;
export const STEP_CURVENESS_VALUE = 0.1;
export const MIN_GRID_VALUE = 25;
export const MAX_GRID_VALUE = 100;

// CONTACT AND SOCIALS
export const GITHUB_PROFILE_LABEL = 'jwieckowski';
export const GITHUB_PROFILE_LINK = 'https://github.com/jwieckowski';
export const GITHUB_ISSUES_LINK = 'https://github.com/jwieckowski/makeDecision/issues';
export const EMAIL_LABEL = 'j.wieckowski@il-pib.pl';
export const EMAIL_LINK = 'mailto: j.wieckowski@il-pib.pl?subject=GUI MCDA app';
export const COMET_LABEL = 'comet.edu.pl';
export const COMET_LINK = 'http://comet.edu.pl';
export const MCDA_IT_LABEL = 'MCDA Method Selection Tool';
export const MCDA_IT_LINK = 'https://mcda.it/';

// TECHNOLOGY
export const API_DOCUMENTATION = 'http://api.make-decision.it/api/v1/documentation';
export const REACT_LINK = 'https://react.dev/';
export const RTK_LINK = 'https://redux-toolkit.js.org/';
export const DRAGGABLE_LINK = 'https://github.com/react-grid-layout/react-draggable';
export const XARROWS_LINK = 'https://eliav2.github.io/react-xarrows/';

// PACKAGES
// TODO move to separate file as array with objects
export const PYMCDM_LABEL = 'pymcdm - Crisp Multi-Criteria Decision Making techniques';
export const PYMCDM_LINK = 'https://pypi.org/project/pymcdm/';
export const PYMCDM_APA =
  'Kizielewicz, B., Shekhovtsov, A., & Sałabun, W. (2023). pymcdm—The universal library for solving multi-criteria decision-making problems. SoftwareX, 22, 101368.';
export const PYMCDM_DOI = 'https://doi.org/10.1016/j.softx.2023.101368';

export const PYMCDM_11_LABEL =
  'Version [1.1]-[pymcdm–The universal library for solving multi-criteria decision-making problems]';
export const PYMCDM_11_LINK = 'https://pypi.org/project/pymcdm/';
export const PYMCDM_11_APA =
  'Shekhovtsov, A., Kizielewicz, B., & Sałabun, W. (2023). Version [1.1]-[pymcdm–The universal library for solving multi-criteria decision-making problems]. SoftwareX, 24, 101519.';
export const PYMCDM_11_DOI = 'https://doi.org/10.1016/j.softx.2023.101519';

export const PYFDM_LABEL = 'pyfdm - Fuzzy Multi-Criteria Decision Making techniques';
export const PYFDM_LINK = 'https://pypi.org/project/pyfdm/';
export const PYFDM_APA =
  'Więckowski, J., Kizielewicz, B., & Sałabun, W. (2022). pyFDM: A Python library for uncertainty decision analysis methods. SoftwareX, 20, 101271.';
export const PYFDM_DOI = 'https://doi.org/10.1016/j.softx.2022.101271';

export const PYIFDM_LABEL = 'pyifdm - Intuitionistic Multi-Criteria Decision Making techniques';
export const PYIFDM_LINK = 'https://pypi.org/project/pyifdm/';
export const PYIFDM_APA =
  'Więckowski, J., Kizielewicz, B., & Sałabun, W. (2023). Handling decision-making in Intuitionistic Fuzzy environment: PyIFDM package. SoftwareX, 22, 101344.';
export const PYIFDM_DOI = 'https://doi.org/10.1016/j.softx.2023.101344';

// ROUTER
export const PAGES = ['Home', 'Calculations', 'Methods', 'About', 'Contact'];
export const URLS = ['', '/calculation', '/methods', '/about', '/contact'];

// ITEMS
export const PATHS = [
  {
    label: 'smooth',
    value: 'smooth',
  },
  {
    label: 'grid',
    value: 'grid',
  },
  {
    label: 'straight',
    value: 'straight',
  },
];

export const LANGUAGES = [
  {
    label: 'EN',
    value: 'en',
  },
  {
    label: 'PL',
    value: 'pl',
  },
];

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
