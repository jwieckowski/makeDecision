import pymcdm
import numpy as np
from .definitions import mcda_methods, normalization_methods,\
    correlation_methods, weights_methods


def calc_promethee(matrix, weights, types, pref_func):
    """
    :param matrix: decision matrix as numpy array
    :param weights: weights for criteria as numpy array, where sum of list is equal 1
    :param types: types for criteria as numpy array, where 1 means profit type and -1 means cost type
    :param pref_func: type of promethee preference function
    :return: preferences for alternatives as numpy array
    """

    p = np.random.rand(matrix.shape[1]) / 2
    q = np.random.rand(matrix.shape[1]) / 2 + 0.5

    method = mcda_methods['promethee'](preference_function=pref_func)
    result = method(matrix, weights, types, p=p, q=q)
    return result


def calc_spotis(matrix, weights, types):
    """
    :param matrix: decision matrix as numpy array
    :param weights: weights for criteria as numpy array, where sum of list is equal 1
    :param types: types for criteria as numpy array, where 1 means profit type and -1 means cost type
    :return: preferences for alternatives as numpy array
    """

    bounds = np.vstack((
        np.min(matrix, axis=0),
        np.max(matrix, axis=0)
    )).T
    method = mcda_methods['spotis']()
    result = method(matrix, weights, types, bounds)
    return result


def calc_comet(matrix, weights, types):
    """
    :param matrix: decision matrix as numpy array
    :param weights: weights for criteria as numpy array, where sum of list is equal 1
    :param types: types for criteria as numpy array, where 1 means profit type and -1 means cost type
    :return: preferences for alternatives as numpy array
    """

    cvalues = np.vstack((
        np.min(matrix, axis=0),
        np.mean(matrix, axis=0),
        np.max(matrix, axis=0)
    )).T
    method = mcda_methods['comet'](cvalues,
                           rate_function=pymcdm.methods.COMET.topsis_rate_function(weights, types))
    result = method(matrix)
    return result


def calc_weights(matrix, method):
    """
    :param matrix: decision matrix as numpy array
    :param method: method with which the weights should be calculated
    :return: values of weights for criteria based on decision matrix as numpy array
    """
    return np.ones(matrix.shape[1]) / matrix.shape[1] if method == 'equal' else weights_methods[method](matrix)


def calculate_results(method, normalization, matrix, weights, types, pref_func=None):
    """
    :param method: MCDA method - lowercase
    :param normalization: normalization method - lowercase
    :param matrix: decision matrix as numpy array
    :param weights: weights for criteria as numpy array, where sum of list is equal 1
    :param types: types for criteria as numpy array, where 1 means profit type and -1 means cost type
    :param pref_func: preference function for promethee method - if promethee not chosen, value in None
    :return: preferences for alternatives as numpy array
    """

    if method == 'promethee':
        return calc_promethee(matrix, weights, types, pref_func)
    elif method == 'spotis':
        return calc_spotis(matrix, weights, types)
    elif method == 'comet':
        return calc_comet(matrix, weights, types)
    else:
        if normalization == 'none':
            m = mcda_methods[method]()
        else:
            m = mcda_methods[method](normalization_methods[normalization])
        result = m(matrix, weights, types)
        return result


def calculate_correlations(method, results, rankings):
    """
    :param method: method of correlation coefficient
    :param results: matrix of preferences as string list
    :param rankings: matrix of positional rankings as string list
    :return: matrix of correlations for rankings as numpy array
    """

    res = np.array([r.strip('][').split(',') for r in results]).astype(np.float)
    rank = np.array([r.strip('][').split(',') for r in rankings]).astype(np.float)

    if method == 'pearson':
        correlations = np.array([[correlation_methods[method](r1, r2) for r2 in res] for r1 in res])
    else:
        correlations = np.array([[correlation_methods[method](r1, r2) for r2 in rank] for r1 in rank])
    return correlations


def calculate_preferences(method, normalization, matrix, weightsMethod, weightsValue, weightsType, preferenceFunction):
    """
    :param method: MCDA method - lowercase
    :param normalization: normalization method - lowercase
    :param matrix: decision matrix as numpy array
    :param weightsMethod: method to calculate weights for criteria - if not provided than has none Value
    :param weightsValue: values of weights for criteria - if not provided than values calculated based on method
    :param weightsType: types of criteria - 1 means profit type and -1 means cost type
    :param preferenceFunction: preference function for promethee method - if promethee not chosen than value is None
    :return: preferences for alternatives as numpy array
    """
    m = np.array([m.strip('][').split(',') for m in matrix]).astype(np.float)

    if weightsMethod == None:
        w = np.array([float(w) for w in weightsValue])
    else:
        w = calc_weights(m, weightsMethod)
    t = np.array([1 if t == 'Profit' else -1 for t in weightsType])

    return calculate_results(method, normalization, m, w, t, preferenceFunction), 