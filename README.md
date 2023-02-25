# Multi-Criteria Decision Making GUI

(under development)

Application created in React to handle the calculation in Multi-Criteria Decision Analysis field.
Based on `pymcdm` and `pyfdm` packages which handles the calculations, the GUI can be used to determine the calculation structure and display results. User can modify the blocks and make connections between them to create a structure of methods that are then used to evaluate decision options.

### Functionalities
* User can use blocks representing different elements that are needed to perform calculations
    * Decision matrix data
    * Weights methods
    * MCDA methods
    * Ranking
    * Correlation coefficient
    * Visualization methods (currently not available)
* User can connect blocks with each other to determine the structure that will be used to calculate results
    * The connections applied by user are verified to prevent establishing connection between two elements that should not be connected
* User can see the results that are obtained based on the determined structure
* User can provide data in the decision matrix from files 
    * Supported extensions: .json, .csv, .xlsx
* User can provide data in the GUI for the decision matrix and weights (INPUT blocks' type)
* User can compare different MCDA methods results for the same data
* User can calculate the similarities between obtained results with correlation coefficient blocks

### Technologies
* Frontend
    * React
    * Redux toolkit
    * MUI
    * react-draggable
    * react-xarrows
* Backend
    * Python-Flask
    * pymcdm
    * pyifdm

### Get started

