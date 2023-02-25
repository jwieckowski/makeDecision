import numpy as np
import pymcdm
import pyfdm
import pymcdm.methods as crisp_methods
import pyfdm.methods as fuzzy_methods

from .weights import Weights
from ..validator import Validator
class Preferences():
    def __init__(self, matrixes, extensions, types):
        self.matrixes = matrixes
        self.extensions = extensions
        self.types = types

        self.mcda_methods = {
            'ARAS': {
                'crisp': crisp_methods.ARAS,
                'fuzzy': fuzzy_methods.fARAS
            },
            'COCOSO': {
                'crisp': crisp_methods.COCOSO
            },
            'CODAS': {
                'crisp': crisp_methods.CODAS,
                'fuzzy': fuzzy_methods.fCODAS
            },
            'COMET': {
                'crisp': crisp_methods.COMET
            },
            'COPRAS': {
                'crisp': crisp_methods.COPRAS,
                'fuzzy': fuzzy_methods.fCOPRAS
            },
            'EDAS': {
                'crisp': crisp_methods.EDAS,
                'fuzzy': fuzzy_methods.fEDAS
            },
            'MABAC': {
                'crisp': crisp_methods.MABAC,
                'fuzzy': fuzzy_methods.fMABAC
            },
            'MAIRCA': {
                'crisp': crisp_methods.MAIRCA,
                'fuzzy': fuzzy_methods.fMAIRCA
            },
            'MARCOS': {
                'crisp': crisp_methods.MARCOS
            },
            'MOORA': {
                'crisp': crisp_methods.MOORA,
                'fuzzy': fuzzy_methods.fMOORA
            },
            'OCRA': {
                'crisp': crisp_methods.OCRA,
                'fuzzy': fuzzy_methods.fOCRA
            },
            'PROMETHEE': {
                'crisp': crisp_methods.PROMETHEE_II
            },
            'SPOTIS': {
                'crisp': crisp_methods.SPOTIS
            },
            'TOPSIS': {
                'crisp': crisp_methods.TOPSIS,
                'fuzzy': fuzzy_methods.fTOPSIS
            },
            'VIKOR': {
                'crisp': crisp_methods.VIKOR,
                'fuzzy': fuzzy_methods.fVIKOR
            }
        }


    def calculate_preferences(self, methods, params=None):
        
        # FOR ADDITIONAL PARAMETERS FOR FUZZY MCDA METHODS
        def _check_fuzzy_parameters(mcda_method, idx, check_normalization=False, check_distance=False, check_defuzzify=False, check_distance_1=False, check_distance_2=False):
            
            kwargs = {}

            if params is not None and len(params) >= idx+1 and len(list(params[idx].keys())) != 0:
                if mcda_method == params[idx]['method'] and params[idx]['extension'] == 'fuzzy' and len(list(params[idx]['additional'].keys())) != 0:
                    
                    if check_normalization == True and 'normalization' in list(params[idx]['additional'].keys()):
                        try:
                            normalization = getattr(pyfdm.methods.fuzzy_sets.tfn.normalizations, params[idx]['additional']['normalization'])
                            kwargs = {'normalization': normalization} | kwargs
                        except:
                            return 'Error while retrieving normalization method'
                    
                    if check_distance == True and 'distance' in list(params[idx]['additional'].keys()):
                        try:
                            distance = getattr(pyfdm.methods.fuzzy_sets.tfn.distances, params[idx]['additional']['distance'])
                            kwargs = {'distance': distance} | kwargs
                        except:
                            return 'Error while retrieving distance method'

                    if check_defuzzify == True and 'defuzzify' in list(params[idx]['additional'].keys()):
                        try:
                            defuzzify = getattr(pyfdm.methods.fuzzy_sets.tfn.defuzzifications, params[idx]['additional']['defuzzify'])
                            kwargs = {'defuzzify': defuzzify} | kwargs
                        except:
                            return 'Error while retrieving defuzzify method'

                    if check_distance_1 == True and 'distance_1' in list(params[idx]['additional'].keys()):
                        try:
                            distance_1 = getattr(pyfdm.methods.fuzzy_sets.tfn.distances, params[idx]['additional']['distance_1'])
                            kwargs = {'distance_1': distance_1} | kwargs
                        except:
                            return 'Error while retrieving distance_1 method'

                    if check_distance_2 == True and 'distance_2' in list(params[idx]['additional'].keys()): 
                        try:
                            distance_2 = getattr(pyfdm.methods.fuzzy_sets.tfn.distances, params[idx]['additional']['distance_2'])
                            kwargs = {'distance_2': distance_2} | kwargs
                        except:
                            return 'Error while retrieving distance_2 method'
            else:
                pass

            return kwargs

        # FOR ADDITIONAL PARAMETERS FOR CRISP MCDA METHODS
        def _check_crisp_parameters(mcda_method, idx, check_normalization_function=False, check_preference_function=False):
            
            kwargs = {}
            
            if params is not None and len(params) >= idx+1 and len(list(params[idx].keys())) != 0:
                if mcda_method == params[idx]['method'] and params[idx]['extension'] == 'crisp' and len(list(params[idx]['additional'].keys())) != 0:
                
                    if check_normalization_function == True and 'normalization_function' in list(params[idx]['additional'].keys()):
                        try:
                            normalization = getattr(pymcdm.normalizations, params[idx]['additional']['normalization_function'])
                            kwargs = {'normalization_function': normalization} | kwargs
                        except:
                            return 'Error while retrieving normalization method'

                    if check_preference_function == True and 'preference_function' in list(params[idx]['additional'].keys()):
                        
                        pref_fun = params[idx]['additional']['preference_function'] 
                        if pref_fun in ['usual', 'ushape', 'vshape', 'level', 'vshape_2']:
                            kwargs = {'preference_function': pref_fun} | kwargs
                        else:
                            return 'Preference function not found'
            else:
                pass

            return kwargs

        # RETRIEVE METHOD NAME FROM FUNCTION NAME
        def _get_methods_name(dict):
            names_dict = {}
            for key, val in dict.items():
                names_dict[key] = val.__name__
            return names_dict

        preferences = []
        for idx, (matrix, extension, types) in enumerate(zip(self.matrixes, self.extensions, self.types)):
            matrix_preferences = []
            for idx_method, method in enumerate(methods[idx]):
                matrix = np.array(matrix)
                types = np.array(types)

                # GET METHODS FROM DICTIONARY
                mcda_method = method['method'].upper()
                if isinstance(method['weights'], str):
                    weights_method = method['weights'].upper()

                    # WEIGHTS CALCULATION
                    weights_object = Weights(extension, types)
                    weights_data = weights_object.calculate_weights(matrix, weights_method)
                    weights = np.array(weights_data['weights'])

                    if weights_data['error'] != False:
                        weights = np.array([])
                        calculate = False
                    else:
                        error = False
                        calculate = True
                    
                else:
                    weights_method = 'input'
                    weights = np.array(method['weights'])
                    check = Validator.validate_user_weights(weights)
                    if check != None:
                        calculate = False
                        error = check['error']
                    else:
                        error = False
                        calculate = True

                # FUZZY CALCULATIONS
                if extension == 'fuzzy':
                    # fuzzy -> call (matrix, weights, types)
                    # ARAS, COPRAS, EDAS, MOORA -> normalization
                    if mcda_method in ['ARAS', 'COPRAS', 'EDAS', 'MOORA']:
                        kwargs = _check_fuzzy_parameters(mcda_method, idx_method, check_normalization=True)

                    # fuzzy CODAS: normalization, distance_1, distance_2
                    elif mcda_method == 'CODAS':
                        kwargs = _check_fuzzy_parameters(mcda_method, idx_method, check_normalization=True, check_distance_1=True, check_distance_2=True)

                    # fuzzy MAIRCA: normalization, distance
                    # fuzzy TOPSIS: normalization, distance
                    elif mcda_method in ['MAIRCA', 'TOPSIS']:
                        kwargs = _check_fuzzy_parameters(mcda_method, idx_method, check_normalization=True, check_distance=True)

                    # fuzzy MABAC: normalization, defuzzify
                    elif mcda_method == 'MABAC':
                        kwargs = _check_fuzzy_parameters(mcda_method, idx_method, check_normalization=True, check_defuzzify=True)
                    
                    # fuzzy OCRA: defuzzify
                    # fuzzy VIKOR: defuzzify
                    elif mcda_method in ['OCRA', 'VIKOR']:
                        kwargs = _check_fuzzy_parameters(mcda_method, idx_method, check_defuzzify=True)

                    else:
                        calculate = False
                        matrix_preferences.append({
                            "method": mcda_method,
                            "weights": weights_method,
                            "weights_value": weights.tolist(),
                            "preference": [],
                            "extension": extension,
                            "additional": _get_methods_name(kwargs),
                            'error': 'Method not detected in fuzzy extension'
                        })

                    if calculate:
                        if type(kwargs) == str:
                            error = kwargs
                            kwargs = {}

                        body = self.mcda_methods[mcda_method][extension](**kwargs)
                        preference = body(matrix, weights, types)

                        if mcda_method == 'VIKOR':
                            preference = [
                                preference[0].tolist(),
                                preference[1].tolist(),
                                preference[2].tolist()
                            ]
                        else:
                            preference = preference.tolist()

                        matrix_preferences.append({
                            "method": mcda_method,
                            "weights": weights_method,
                            "weights_value": weights.tolist(),
                            "preference": preference,
                            "extension": extension,
                            "additional": _get_methods_name(kwargs),
                            'error': error
                        })
                
                elif extension == 'crisp':
                    # crisp -> matrix, types, weights
                    if mcda_method in ['ARAS', 'COCOSO', 'CODAS', 'COPRAS', 'EDAS', 'MABAC', 'MAIRCA', 'MARCOS', 'MOORA', 'OCRA', 'TOPSIS', 'VIKOR']:

                        kwargs = {}
                        if mcda_method in ['ARAS', 'COCOSO', 'CODAS', 'MABAC', 'MAIRCA', 'MARCOS', 'OCRA', 'TOPSIS', 'VIKOR']:
                            kwargs = _check_crisp_parameters(mcda_method, idx_method, check_normalization_function=True)

                        if type(kwargs) == str:
                            error = kwargs
                            kwargs = {}

                        body = self.mcda_methods[mcda_method][extension](**kwargs)

                        if mcda_method == 'VIKOR':
                            preference = body(matrix, weights, types, return_all=True)
                            preference = [
                                preference[0].tolist(),
                                preference[1].tolist(),
                                preference[2].tolist()
                            ]
                        else:
                            preference = body(matrix, weights, types).tolist()

                        matrix_preferences.append({
                            "method": mcda_method,
                            "preference": preference,
                            "weights": weights_method,
                            "weights_value": weights.tolist(),
                            "extension": extension,
                            "additional": _get_methods_name(kwargs),
                            'error': error
                        })

                    # PROMETHEE -> matrix, weights, types, p, q, preference_function ('usual', 'ushape', 'vshape', 'level', 'vshape_2')
                    elif mcda_method == 'PROMETHEE':
                        kwargs = _check_crisp_parameters(mcda_method, idx_method, check_preference_function=True)

                        if type(kwargs) == str:
                            error = kwargs
                            # default settings
                            kwargs = {'preference_function': 'usual'}

                        body = self.mcda_methods[mcda_method][extension](**kwargs)
                        matrix_preferences.append({
                            "method": mcda_method,
                            "preference": body(matrix, weights, types).tolist(),
                            "weights": weights_method,
                            "weights_value": weights.tolist(),
                            "extension": extension,
                            "additional": kwargs,
                            'error': error
                        })

                    # SPOTIS -> matrix, weights, types, bounds
                    elif mcda_method == 'SPOTIS':
                        bounds =  np.vstack((
                            np.min(matrix, axis=0),
                            np.max(matrix, axis=0)
                        )).T

                        body = self.mcda_methods[mcda_method][extension]()
                        matrix_preferences.append({
                            "method": mcda_method,
                            "preference": body(matrix, weights, types, bounds).tolist(),
                            "weights": weights_method,
                            "weights_value": weights.tolist(),
                            "extension": extension,
                            "additional": {},
                            'error': error
                        })

                    # COMET -> matrix, weights, types, rate function
                    elif mcda_method == 'COMET':
                        cvalues =  np.vstack((
                            np.min(matrix, axis=0),
                            np.mean(matrix, axis=0),
                            np.max(matrix, axis=0)
                        )).T
                        body = self.mcda_methods[mcda_method][extension](cvalues, crisp_methods.COMET.topsis_rate_function(weights, types))
                        matrix_preferences.append({
                            "method": mcda_method,
                            "preference": body(matrix).tolist(),
                            "weights": weights_method,
                            "weights_value": weights.tolist(),
                            "extension": extension,
                            "additional": {},
                            'error': error
                        })
                    else:
                        calculate=False
                        matrix_preferences.append({
                            "method": mcda_method,
                            "weights": weights_method,
                            "weights_value": weights.tolist(),
                            "preference": [],
                            "extension": extension,
                            "additional": _get_methods_name(kwargs),
                            'error': 'Method not detected in crisp extension'
                        })

                else:
                    matrix_preferences.append({
                        "method": mcda_method,
                        "weights": weights_method,
                        "weights_value": weights.tolist(),
                        "preference": [],
                        "extension": extension,
                        "additional": _get_methods_name(kwargs),
                        'error': 'Extension not handled'
                    })
            
            preferences.append(matrix_preferences)
        return preferences


