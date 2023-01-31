from flask import Flask, redirect, request, g, jsonify
from flask_expects_json import expects_json
from flask_cors import CORS
import numpy as np
import json

from utilities.interface import Calculations
from utilities.validator import Validator 

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
    # with open('public/dictionary/all-methods.json') as file:
    with open('public/dictionary/all-methods-complex.json') as file:
        data = file.read()
    return data

@app.route('/api/v1/dictionary/all-methods/primary', methods=['GET'])
def dictionary_all_methods_primary():
    # with open('public/dictionary/all-methods.json') as file:
    with open('public/dictionary/all-methods-complex.json') as file:
        data = json.load(file)

    primary = []
    for method in data:
        if method['type'] == 'primary':
            primary.append(method)
    
    return primary

@app.route('/api/v1/dictionary/all-methods/additional', methods=['GET'])
def dictionary_all_methods_additional():
    # with open('public/dictionary/all-methods.json') as file:
    with open('public/dictionary/all-methods-complex.json') as file:
        data = json.load(file)

    additional = []
    for method in data:
        if method['type'] == 'additional':
            additional.append(method)
    
    return additional

@app.route('/api/v1/dictionary/methods', methods=['GET'])
def dictionary_methods():
    with open('public/dictionary/methods.json') as file:
        data = file.read()
    return data

@app.route('/api/v1/dictionary/methods/<int:id>', methods=['GET'])
def dictionary_single_method(id):
    with open('public/dictionary/methods.json') as file:
        data = json.load(file)

    item = None
    for method in data:
        if method['id']  == id:
            item = method  

    if item == None:
        return {
            'id': id,
            'error': 'No MCDA method found with given id'
        }, 404

    return item

@app.route('/api/v1/dictionary/correlations', methods=['GET'])
def dictionary_correlations():
    with open('public/dictionary/correlations.json') as file:
        data = file.read()

    return data

@app.route('/api/v1/dictionary/correlations/<int:id>', methods=['GET'])
def dictionary_single_correlation(id):
    with open('public/dictionary/correlations.json') as file:
        data = json.load(file)

    item = None
    for correlation in data:
        if correlation['id']  == id:
            item = correlation  

    if item == None:
        return {
            'id': id,
            'error': 'No correlation method found with given id'
        }, 404

    return item

@app.route('/api/v1/dictionary/decision-matrix', methods=['GET'])
def dictionary_decision_matrix():
    with open('public/dictionary/decision-matrix.json') as file:
        data = file.read()
    return data

@app.route('/api/v1/dictionary/decision-matrix/<int:id>', methods=['GET'])
def dictionary_single_decision_matrix(id):
    with open('public/dictionary/decision-matrix.json') as file:
        data = json.load(file)

    item = None
    for dm in data:
        if dm['id']  == id:
            item = dm  

    if item == None:
        return {
            'id': id,
            'error': 'No method to provide decision matrix found with given id'
        }, 404

    return item

@app.route('/api/v1/dictionary/defuzzifications', methods=['GET'])
def dictionary_defuzzifications():
    with open('public/dictionary/defuzzifications.json') as file:
        data = file.read()
    return data

@app.route('/api/v1/dictionary/defuzzifications/<int:id>', methods=['GET'])
def dictionary_single_defuzzification(id):
    with open('public/dictionary/defuzzifications.json') as file:
        data = json.load(file)

    item = None
    for defuzzification in data:
        if defuzzification['id']  == id:
            item = defuzzification  

    if item == None:
        return {
            'id': id,
            'error': 'No defuzzification method found with given id'
        }, 404

    return item

@app.route('/api/v1/dictionary/distances', methods=['GET'])
def dictionary_distances():
    with open('public/dictionary/distances.json') as file:
        data = file.read()
    return data

@app.route('/api/v1/dictionary/distances/<int:id>', methods=['GET'])
def dictionary_single_distance(id):
    with open('public/dictionary/distances.json') as file:
        data = json.load(file)

    item = None
    for distance in data:
        if distance['id']  == id:
            item = distance  

    if item == None:
        return {
            'id': id,
            'error': 'No distance method found with given id'
        }, 404

    return item

@app.route('/api/v1/dictionary/normalizations', methods=['GET'])
def dictionary_normalizations():
    with open('public/dictionary/normalizations.json') as file:
        data = file.read()
    return data

@app.route('/api/v1/dictionary/normalizations/<int:id>', methods=['GET'])
def dictionary_single_normalization(id):
    with open('public/dictionary/normalizations.json') as file:
        data = json.load(file)

    item = None
    for normalization in data:
        if normalization['id']  == id:
            item = normalization  

    if item == None:
        return {
            'id': id,
            'error': 'No normalization method found with given id'
        }, 404

    return item

@app.route('/api/v1/dictionary/ranking', methods=['GET'])
def dictionary_ranking():
    with open('public/dictionary/ranking.json') as file:
        data = file.read()
    return data

@app.route('/api/v1/dictionary/ranking/<int:id>', methods=['GET'])
def dictionary_single_ranking(id):
    with open('public/dictionary/ranking.json') as file:
        data = json.load(file)

    item = None
    for ranking in data:
        if ranking['id']  == id:
            item = ranking  

    if item == None:
        return {
            'id': id,
            'error': 'No ranking order found with given id'
        }, 404

    return item

@app.route('/api/v1/dictionary/visualization', methods=['GET'])
def dictionary_visualization():
    with open('public/dictionary/visualization.json') as file:
        data = file.read()
    return data

@app.route('/api/v1/dictionary/visualization/<int:id>', methods=['GET'])
def dictionary_single_visualization(id):
    with open('public/dictionary/visualization.json') as file:
        data = json.load(file)

    item = None
    for visualization in data:
        if visualization['id']  == id:
            item = visualization  

    if item == None:
        return {
            'id': id,
            'error': 'No visualization method found with given id'
        }, 404

    return item

@app.route('/api/v1/dictionary/weights', methods=['GET'])
def dictionary_weights():
    with open('public/dictionary/weights.json') as file:
        data = file.read()
    return data

@app.route('/api/v1/dictionary/weights/<int:id>', methods=['GET'])
def dictionary_single_weight(id):
    with open('public/dictionary/weights.json') as file:
        data = json.load(file)

    item = None
    for weight in data:
        if weight['id']  == id:
            item = weight  

    if item == None:
        return {
            'id': id,
            'error': 'No weight method found with given id'
        }, 404

    return item

results_schema = {
    'type': 'object',
    'properties': {
        'matrix': {
            'type': 'array',
            'items': {
                'type': 'array'
            }
        },
        'extensions': {
            'type': 'array',
            'items': {
                "type": 'string'
            }
        },
        'types': {
            'type': 'array',
            'items': {
                'type': 'array',
                "items": {
                    "type": "number"
                }
            }
        },
        "method": {
            "type": "array",
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "method": {
                            "type": "string"
                        },
                        "weights": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "methodCorrelations": {
            "type": "array",
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "correlation": {
                            "type": "string",
                        },    
                        "data": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "method": {
                                        "type": "string"
                                    },
                                    "weights": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "methodRankings": {
            "type": "array",
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "data": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "method": {
                                        "type": "string"
                                    },
                                    "weights": {
                                        "type": "string"
                                    },
                                    "order": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "rankingCorrelations": {
            "type": "array",
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "correlation": {
                            "type": "string"
                        },
                        "data": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "method": {
                                        "type": "string"
                                    },
                                    "weights": {
                                        "type": "string"
                                    },
                                    "order": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    'required': ['matrix', 'extensions', 'types', 'method', 'methodCorrelations', 'methodRankings', 'rankingCorrelations']
}

correlation_schema = {
    'type': 'object',
    'properties': {
        'matrix': {
            'type': 'array'
        },
        'correlationMethods': {
            'type': 'array',
            'items': {
                'type': 'string'
            }
        }
    },
    'required': ['matrix', 'correlationMethods']
}

ranking_schema = {
    'type': 'object',
    'properties': {
        'matrix': {
            'type': 'array'
        },
        'order': {
            'type': 'array',
            'items': {
                'type': 'string'
            }
        }
    },
    'required': ['matrix', 'order']
}

# CALCULATIONS
@app.route('/api/v1/results', methods=['POST'])
@expects_json(results_schema)
def calculation_results():
    # if payload is invalid, request will be aborted with error code 400
    # if payload is valid it is stored in g.data

    # data = request.get_json()
    data = g.data
    matrixes = np.array(data['matrix'])
    extensions = np.array(data['extensions'])
    types = np.array(data['types'])
    method = np.array(data['method'])
    methodCorrelations = np.array(data['methodCorrelations'])
    methodRankings = np.array(data['methodRankings'])
    rankingCorrelations = np.array(data['rankingCorrelations'])

    print(matrixes)
    print(extensions)
    print(types)
    print(method)
    print(methodCorrelations)
    print(methodRankings)
    print(rankingCorrelations)
    # print(data['params'])

    # verification of input data
    for m, ext in zip(matrixes, extensions):
        matrix_error = Validator.validate_matrix(m, ext)
        if matrix_error:
            return matrix_error, 400

    for m, t in zip(matrixes, types):
        types_error = Validator.validate_types(t)
        if types_error:
            return types_error, 400

    # retrieve additional params for assessment
    try:
        params = np.array(data['params'])
    except:
        params = None

    for m, t in zip(matrixes, types):
        dimension_error = Validator.validate_dimensions(m, t)
        if dimension_error:
            return dimension_error, 400

    results = {
        'method': [],
        'methodCorrelations': [],
        'methodRankings': [],
        'rankingCorrelations': []
    }
    # MCDA evaluation
    results['method'] = Calculations.calculate_preferences(matrixes, extensions, types, method, params)

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

@app.route('/api/v1/evaluation', methods=['POST'])
def calculation_evaluation():
    data = request.get_json()
    print(data)

    results = np.array([])
    return jsonify(results.tolist())

@app.route('/api/v1/correlation', methods=['POST'])
@expects_json(correlation_schema)
def calculation_correlation():
    data = g.data
    
    matrix = np.array(data['matrix'])
    method = np.array(data['correlationMethods'])

    matrix_error = Validator.validate_matrix(matrix, 'crisp')
    if matrix_error:
        return matrix_error, 400

    correlations = Calculations.calculate_correlations(matrix, method)

    return jsonify(correlations)

@app.route('/api/v1/ranking', methods=['POST'])
@expects_json(ranking_schema)
def calculation_ranking():
    data = g.data

    matrix = np.array(data['matrix'])
    order = np.array(data['order'])

    matrix_error = Validator.validate_matrix(matrix, 'crisp')
    if matrix_error:
        return matrix_error, 400
    
    dimension_error = Validator.validate_orders_dimensions(matrix, order)
    if dimension_error:
        return {
            'error': dimension_error
        }, 400

    ranking = Calculations.calculate_ranking(matrix, order)
    return jsonify(ranking)

@app.route('/api/v1/visualization', methods=['POST'])
def calculation_visualization():
    data = request.get_json()
    print(data)

    results = np.array([])
    return jsonify(results.tolist())

# CATCH-ALL
@app.route('/*', defaults={'u_path': ''})
@app.route('/<path:u_path>')
def catch_all(u_path):
    return redirect('/')

app.run()