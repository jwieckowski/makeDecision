from .Interfaces.weights import Weights
from .Interfaces.correlations import Correlation
from .Interfaces.preferences import Preferences
from .Interfaces.ranking import Ranking
from .Interfaces.additional import Additional
class Calculations():
    def __init__(self):
        pass

    # TODO change to current format
    # @staticmethod
    # def calculate_weights(matrix, weights_method, extension, types, weights=None):
        
    #     if weights == None and weights_method != '':
    #         weights_obj = Weights(weights_method, extension, types)
    #         weights_data = weights_obj.calculate_weights(matrix)
    #     else:
    #         # validate weights sum and extension
    #         weights_data = {
    #             'method': 'input',
    #             'weights': weights,
    #             'extension': extension,
    #             'error': ''
    #         }

    #     return weights_data


    @staticmethod
    def generate_random_matrix(alternatives, criteria, extension):
        return Additional.generate_random_matrix(alternatives, criteria, extension)

    @staticmethod
    def calculate_preference_correlations(methods, results):

        correlation_obj = Correlation()
        correlation_data = correlation_obj.calculate_preferences_correlation(methods, results)

        return correlation_data

    @staticmethod
    def calculate_ranking_correlations(methods, results):

        correlation_obj = Correlation()
        correlation_data = correlation_obj.calculate_ranking_correlation(methods, results)

        return correlation_data

    @staticmethod
    def calculate_preferences(matrixes, extensions, types, methods, params=None):

        preferences_object = Preferences(matrixes, extensions, types)
        preferences_data = preferences_object.calculate_preferences(methods, params)
        
        return preferences_data

    @staticmethod
    def calculate_ranking(methods, results):

        ranking_obj = Ranking()
        ranking_data = ranking_obj.calculate_ranking(methods, results)
        
        return ranking_data

    #  TODO change to current format
    # @staticmethod
    # def calculate_correlations(matrix, correlation_method):
        
    #     correlation_obj = Correlation(correlation_method)
    #     correlation_data = correlation_obj.calculate_correlation(matrix)
        
    #     return correlation_data
