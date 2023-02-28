from flask import Flask, redirect, request, g, jsonify
from flask_expects_json import expects_json
from flask_cors import CORS
import numpy as np
import json

from utilities.interface import Calculations
from utilities.validator import Validator 
from utilities.files import Files

app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Hello'})

# dictionaries
@app.route('/api/v1/dictionary/all-methods', methods=['GET'])
def dictionary_all_methods():
    with open('public/dictionary/all-methods.json') as file:
        data = file.read()
    return data

@app.route('/api/v1/descriptions/home', methods=['GET'])
def descriptions_home():
    with open('public/descriptions/home.json', encoding='utf-8') as file:
        data = file.read()
    return data

@app.route('/api/v1/descriptions/methods', methods=['GET'])
def descriptions_methods():
    with open('public/descriptions/methods.json', encoding='utf-8') as file:
        data = file.read()
    return data

@app.route('/api/v1/descriptions/about', methods=['GET'])
def about_description():
    with open('public/descriptions/about.json', encoding='utf-8') as file:
        data = file.read()
    return data

@app.route('/api/v1/files/about', methods=['GET'])
def about_files():
    images = [
        'public/files/json_data.png',
        'public/files/xlsx_data.png',
        'public/files/csv_data.png'
    ]
    encoded_images = []
    for image_path in images:
        encoded_images.append(Files.get_response_image(image_path))
    return jsonify({'result': encoded_images})

# CALCULATIONS
@app.route('/api/v1/results', methods=['POST'])
def calculation_results():

    data = request.get_json()
    matrixes = np.array(data['matrix'], dtype='object')
    extensions = np.array(data['extensions'])
    types = np.array(data['types'])
    method = np.array(data['method'])
    methodCorrelations = np.array(data['methodCorrelations'])
    methodRankings = np.array(data['methodRankings'])
    rankingCorrelations = np.array(data['rankingCorrelations'])

    calculationMatrixes = []
    calculationTypes = []
    # check if need to generate random matrix or process the data from file
    for idx, (m, ext) in enumerate(zip(matrixes, extensions)):
        # file
        if isinstance(m, str): 
            flag, a, b = Files.convert_file_to_matrix(m, ext)
            if flag == True:
                calculationMatrixes.append(a)
                calculationTypes.append(b)
            else:
                return a, 400
        # random
        elif m.ndim == 1 and len(m) == 2:
            calculationMatrixes.append(Calculations.generate_random_matrix(m[0], m[1], ext))
            calculationTypes.append(types[idx])
        # input
        else:
            calculationMatrixes.append(np.array(m, dtype=float))
            calculationTypes.append(types[idx])

    # verification of input data
    for m, ext in zip(calculationMatrixes, extensions):
        matrix_error = Validator.validate_matrix(m, ext)
        if matrix_error:
            return matrix_error, 400

    for m, t in zip(calculationMatrixes, calculationTypes):
        types_error = Validator.validate_types(t)
        if types_error:
            return types_error, 400

    # retrieve additional params for assessment
    try:
        params = np.array(data['params'])
    except:
        params = None

    for m, t in zip(calculationMatrixes, calculationTypes):
        dimension_error = Validator.validate_dimensions(m, t)
        if dimension_error:
            return dimension_error, 400

    results = {
        'matrices': [], 
        'method': [],
        'methodCorrelations': [],
        'methodRankings': [],
        'rankingCorrelations': []
    }

    if len(method) == 0:
        return jsonify(results)
        
    # return matrices
    results['matrices'] = [m.tolist() for m in calculationMatrixes]
    
    # MCDA evaluation
    results['method'] = Calculations.calculate_preferences(calculationMatrixes, extensions, calculationTypes, method, params)

    # MCDA preferences correlation
    if len(methodCorrelations) > 0:
        results['methodCorrelations'] = Calculations.calculate_preference_correlations(methodCorrelations, results['method'])

    # MCDA ranking calculation
    if len(methodRankings) > 0:
        results['methodRankings'] = Calculations.calculate_ranking(methodRankings, results['method'])

    # MCDA ranking correlation
    if len(rankingCorrelations) > 0:
        results['rankingCorrelations'] = Calculations.calculate_ranking_correlations(rankingCorrelations, results['methodRankings'])

    return jsonify(results)

# CATCH-ALL
@app.route('/*', defaults={'u_path': ''})
@app.route('/<path:u_path>')
def catch_all(u_path):
    return redirect('/')

app.run()