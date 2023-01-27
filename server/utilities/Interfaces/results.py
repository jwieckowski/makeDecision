import numpy as np
import pymcdm
import pyfdm
import pymcdm.methods as crisp_methods
import pyfdm.methods as fuzzy_methods
import pymcdm.weights as crisp_weights

class Results():
    def __init__(self, mcda_methods, extension):
        self.mcda_methods = mcda_methods
        self.extension = extension
        
    def calculate_results(self, matrix, weights, types, params=None):
        methods = {
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
                return 'None params'

            return kwargs

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
                return 'None params'

            return kwargs

        def _get_methods_name(dict):
            names_dict = {}
            for key, val in dict.items():
                names_dict[key] = val.__name__
            return names_dict

        preferences = []
        for idx, mcda_method in enumerate(self.mcda_methods):

            error = False
            # FUZZY CALCULATIONS
            if self.extension == 'fuzzy':
                # fuzzy -> call (matrix, weights, types)
                # ARAS, COPRAS, EDAS, MOORA -> normalization
                if mcda_method in ['ARAS', 'COPRAS', 'EDAS', 'MOORA']:
                    kwargs = _check_fuzzy_parameters(mcda_method, idx, check_normalization=True)

                # fuzzy CODAS: normalization, distance_1, distance_2
                elif mcda_method == 'CODAS':
                    kwargs = _check_fuzzy_parameters(mcda_method, idx, check_normalization=True, check_distance_1=True, check_distance_2=True)


                # fuzzy MAIRCA: normalization, distance
                # fuzzy TOPSIS: normalization, distance
                elif mcda_method in ['MAIRCA', 'TOPSIS']:
                    kwargs = _check_fuzzy_parameters(mcda_method, idx, check_normalization=True, check_distance=True)

                # fuzzy MABAC: normalization, defuzzify
                elif mcda_method == 'MABAC':
                    kwargs = _check_fuzzy_parameters(mcda_method, idx, check_normalization=True, check_defuzzify=True)
                
                # fuzzy OCRA: defuzzify
                # fuzzy VIKOR: defuzzify
                elif mcda_method in ['OCRA', 'VIKOR']:
                    kwargs = _check_fuzzy_parameters(mcda_method, idx, check_defuzzify=True)

                else:
                    return {'error': 'Method not detected in fuzzy extension'}

                if type(kwargs) == str:
                    error = kwargs
                    kwargs = {}

                body = methods[mcda_method][self.extension](**kwargs)
                preference = body(matrix, weights, types)

                if mcda_method == 'VIKOR':
                    # preference = {
                    #     'S': preference[0].tolist(),
                    #     'R': preference[1].tolist(),
                    #     'Q': preference[2].tolist()
                    # }
                    preference = [
                        preference[0].tolist(),
                        preference[1].tolist(),
                        preference[2].tolist()
                    ]
                else:
                    preference = preference.tolist()

                preferences.append({
                    "method": mcda_method,
                    "preference": preference,
                    "extension": self.extension,
                    "additional": _get_methods_name(kwargs),
                    'error': error
                })
            
            elif self.extension == 'crisp':
                # crisp -> matrix, types, weights
                if mcda_method in ['ARAS', 'COCOSO', 'CODAS', 'COPRAS', 'EDAS', 'MABAC', 'MAIRCA', 'MARCOS', 'MOORA', 'OCRA', 'TOPSIS', 'VIKOR']:

                    kwargs = {}
                    if mcda_method in ['ARAS', 'COCOSO', 'CODAS', 'MABAC', 'MAIRCA', 'MARCOS', 'OCRA', 'TOPSIS', 'VIKOR']:
                        kwargs = _check_crisp_parameters(mcda_method, idx, check_normalization_function=True)

                    if type(kwargs) == str:
                        error = kwargs
                        kwargs = {}

                    body = methods[mcda_method][self.extension](**kwargs)

                    if mcda_method == 'VIKOR':
                        preference = body(matrix, weights, types, return_all=True)
                        preference = [
                            preference[0].tolist(),
                            preference[1].tolist(),
                            preference[2].tolist()
                        ]
                    else:
                        preference = body(matrix, weights, types).tolist()

                    preferences.append({
                        "method": mcda_method,
                        "preference": preference,
                        "extension": self.extension,
                        "additional": _get_methods_name(kwargs),
                        'error': error
                    })

                # PROMETHEE -> matrix, weights, types, p, q, preference_function ('usual', 'ushape', 'vshape', 'level', 'vshape_2')
                elif mcda_method == 'PROMETHEE':
                    kwargs = _check_crisp_parameters(mcda_method, idx, check_preference_function=True)

                    if type(kwargs) == str:
                        error = kwargs
                        # default settings
                        kwargs = {'preference_function': 'usual'}

                    body = methods[mcda_method][self.extension](**kwargs)
                    preferences.append({
                        "method": mcda_method,
                        "preference": body(matrix, weights, types).tolist(),
                        "extension": self.extension,
                        "additional": kwargs,
                        'error': error
                    })

                # SPOTIS -> matrix, weights, types, bounds
                elif mcda_method == 'SPOTIS':
                    bounds =  np.vstack((
                        np.min(matrix, axis=0),
                        np.max(matrix, axis=0)
                    )).T

                    body = methods[mcda_method][self.extension]()
                    preferences.append({
                        "method": mcda_method,
                        "preference": body(matrix, weights, types, bounds).tolist(),
                        "extension": self.extension,
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
                    body = methods[mcda_method][self.extension](cvalues, crisp_methods.COMET.topsis_rate_function(weights, types))
                    preferences.append({
                        "method": mcda_method,
                        "preference": body(matrix).tolist(),
                        "extension": self.extension,
                        "additional": {},
                        'error': error
                    })
            else:
                return 'Extension not handled'
            
        return preferences

if __name__ == '__main__':
     # CRISP test case
    print('CRISP TEST CASE -------------------------------')
    matrix = np.array([
        [78, 56, 34, 6],
        [4, 45, 3, 97],
        [18, 2, 50, 63],
        [9, 14, 11, 92],
        [85, 9, 100, 29]
    ])

    # matrix2 = np.array([
    #     [1, 2, 3, 4, 5],
    #     [5, 4, 3, 4, 3]
    # ])

    params = [
        {
            "method": "ARAS",
            "extension": "crisp",
            "additional": {
                "normalization_function": "max_normalization"
            }
        },
        {
            "method": "COPRAS",
            "extension": "crisp",
            "additional": {
                "normalization_function": "sum_normalization"
            }
        },
        {
            "method": "PROMETHEE",
            "extension": "crisp",
            "additional": {
                "preference_function": "usual"
            }
        },
        {
            "method": "EDAS",
            "extension": "crisp",
            "additional": {
                "preference_function": "usual"
            }
        }
    ]

    method = np.array(['ARAS', 'COPRAS', 'PROMETHEE', 'EDAS', 'COCOSO', 'CODAS', 'MABAC', 'MAIRCA', 'MARCOS', 'MOORA', 'OCRA', 'TOPSIS', 'VIKOR', 'COMET', 'SPOTIS'])
    extension = 'crisp'
    weights = crisp_weights.equal_weights(matrix)
    types = np.array([-1, 1, -1, 1])

    results = Results(method, extension)
    for r in results.calculate_results(matrix, weights, types, params):
        print(r)
    
    print('\nFUZZY TEST CASE -------------------------------')
    # FUZZY test case
    matrix = np.array([
        [[5, 7, 9], [5, 7, 9], [7, 9, 9]],
        [[1, 3, 5], [3, 5, 7], [3, 5, 7]],
        [[1, 1, 3], [1, 3, 5], [1, 3, 5]],
        [[7, 9, 9], [7, 9, 9], [7, 9, 9]]
    ])
    weights = np.array([0.4, 0.4, 0.2])
    types = np.array([1, -1, 1])
    params = [
        {
            "method": "ARAS",
            "extension": "fuzzy",
            "additional": {
                "normalization": "max_normalization"
            }
        },
        {
            "method": "CODAS",
            "extension": "fuzzy",
            "additional": {
                "normalization": "sum_normalization"
            }
        },
        {
            "method": "VIKOR",
            "extension": "fuzzy",
            "additional": {
                "defuzzify": "mean_defuzzification"
            }
        },
        {},
        {},
        {
            "method": "COPRAS",
            "extension": "fuzzy",
            "additional": {
                "defuzzify": "mean_defuzzification"
            }
        },

    ]

    method = np.array(['ARAS', 'CODAS', 'VIKOR',  'EDAS', 'TOPSIS', 'COPRAS', 'MAIRCA', 'MABAC', 'MOORA', 'OCRA'])
    extension = 'fuzzy'
    results = Results(method, extension)
    for r in results.calculate_results(matrix, weights, types, params):
        print(r)