from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
import numpy as np


app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Hello'})

@app.route('/results', methods=['GET'])
def results():
    method = request.args.get('method')
    normalization = request.args.get('normalization')
    matrix = request.args.getlist('matrix[]')
    weightsType = request.args.getlist('weightsType[]')
    weightsValue = request.args.getlist('weightsValue[]')
    weightsMethod = request.args.get('weightsMethod')
    preferenceFunction = request.args.get('preferenceFunction')

    results = np.array([])
    return jsonify(results.tolist())

app.run()