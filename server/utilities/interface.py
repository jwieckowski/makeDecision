from .Interfaces.weights import Weights
from .Interfaces.correlations import Correlation
from .Interfaces.ranking import Ranking
from .Interfaces.results import Results

class Calculations():
    def __init__(self):
        pass

    @staticmethod
    def calculate_weights(matrix, weights_method, extension, types, weights=None):
        
        if weights == None and weights_method != '':
            weights_obj = Weights(weights_method, extension, types)
            weights_data = weights_obj.calculate_weights(matrix)
        else:
            # validate weights sum and extension
            weights_data = {
                'method': 'input',
                'weights': weights,
                'extension': extension,
                'error': ''
            }

        return weights_data

    @staticmethod
    def calculate_correlations(matrix, correlation_method):
        
        correlation_obj = Correlation(correlation_method)
        correlation_data = correlation_obj.calculate_correlation(matrix)
        
        return correlation_data

    @staticmethod
    def calculate_ranking(matrix, ranking_order):

        ranking_obj = Ranking(ranking_order)
        ranking_data = ranking_obj.calculate_ranking(matrix)
        
        return ranking_data

    @staticmethod
    def calculate_results(matrix, mcda_methods, extension, weights, types, params=None):

        results_obj = Results(mcda_methods, extension)
        results_data = results_obj.calculate_results(matrix, weights, types, params)
        
        return results_data
