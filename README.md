# Multi-Criteria Decision Making Graphical User Interface

Make-Decision.it application

(under development)

Application created in React to handle the calculation in Multi-Criteria Decision Analysis field.
Based on `pymcdm` and `pyfdm` packages which handles the calculations, the GUI can be used to determine the calculation structure and display results. User can modify the blocks and make connections between them to create a structure of methods that are then used to evaluate decision options.

### Functionalities

- User can use blocks representing different elements that are needed to perform calculations
  - Decision matrix data
  - Weights methods
  - MCDA methods
  - Ranking
  - Correlation coefficient
  - Visualization methods (currently not available)
- User can connect blocks with each other to determine the structure that will be used to calculate results
  - The connections applied by user are verified to prevent establishing connection between two elements that should not be connected
- User can see the results that are obtained based on the determined structure
- User can provide data in the decision matrix from files
  - Supported extensions: .json, .csv, .xlsx
- User can provide data in the GUI for the decision matrix and weights (INPUT blocks' type)
- User can compare different MCDA methods results for the same data
- User can calculate the similarities between obtained results with correlation coefficient blocks

### STRUCTURE

```
├── src
│   ├── App
│   │   ├── Layout
│   │   ├── App.tsx
│   ├── assets
│   ├── common
│   ├── components
│   ├── hooks
│   ├── redux
│   │   ├── slices
│   ├── translations
│   ├── utilities
│   ├── views
├── public
│   ├── examples
│   ├── index.html
├── build
├── node_modules
├── package.json
├── package-lock.json
├── tsconfig.json
├── webpack.config.js
└── .gitignore

```

### Technologies

- Frontend
  - React
  - Vite
  - Redux toolkit
  - mui
  - react-draggable
  - react-xarrows
  - react-zoom-pin-panch
  - react-i18next
  - notistack
- Backend
  - Python-Flask-RestX
  - pymcdm
  - pyfdm

### Get started

[GUI application](http://make-decision.it)

[Server documentation](http://api.make-decision.it/api/v1/documentation)

### Run locally

To run the web application locally:

- Clone the repository with the web application

```
git clone https://github.com/jwieckowski/makeDecision.git
```

- Enter the repository and install dependencies

```
cd makeDecision
npm install
```

- Run the application

```
npm run dev
```

To run the REST API server locally:

- Clone the repository with the REST API server

```
git clone https://github.com/jwieckowski/makeDecision-server.git
```

- Enter the repository and install dependencies

```
cd makeDecision-server
pip install -r requirements.txt
```

- Run the server

```
cd server
python server.py
```
