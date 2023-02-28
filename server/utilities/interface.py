from .Interfaces.weights import Weights
from .Interfaces.correlations import Correlation
from .Interfaces.preferences import Preferences
from .Interfaces.ranking import Ranking
from .Interfaces.additional import Additional
class Calculations():
    def __init__(self):
        pass

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
