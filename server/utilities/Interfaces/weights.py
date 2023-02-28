import numpy as np
import pymcdm.weights as crisp_weights
import pyfdm.weights as fuzzy_weights

class Weights():
    def __init__(self, extension, types):
        self.extension=extension
        self.types=types

        self.weights_methods = {
            'ANGLE': {
                'crisp': crisp_weights.angle_weights
            },
            'CILOS': {
                'crisp': crisp_weights.cilos_weights
            },
            'CRITIC': {
                'crisp': crisp_weights.critic_weights,
            },
            'ENTROPY': {
                'crisp': crisp_weights.entropy_weights,
                'fuzzy': fuzzy_weights.shannon_entropy_weights
            },
            'EQUAL': {
                'crisp': crisp_weights.equal_weights,
                'fuzzy': fuzzy_weights.equal_weights
            },
            'GINI': {
                'crisp': crisp_weights.gini_weights
            },
            'IDOCRIW': {
                'crisp': crisp_weights.idocriw_weights
            },
            'MEREC': {
                'crisp': crisp_weights.merec_weights
            },
            'STANDARD DEVIATION': {
                'crisp': crisp_weights.standard_deviation_weights,
                'fuzzy': fuzzy_weights.standard_deviation_weights
            },
            'VARIANCE': {
                'crisp': crisp_weights.variance_weights,
                'fuzzy': fuzzy_weights.variance_weights
            }
        }

    def validate_input_weights(self, matrix):
        pass

    def calculate_weights(self, matrix, method):

        error = False
        weights = np.array([])
        if self.extension not in self.weights_methods[method].keys():
            error = f'Extension {self.extension} not found for method {method}'
        else:
            if method in ['MEREC', 'CILOS', 'IDOCRIW']:
                weights = self.weights_methods[method][self.extension](matrix, self.types)
            else:
                weights = self.weights_methods[method][self.extension](matrix)

        return {
            'weights': weights.tolist(),
            'error': error
        }

if __name__ == '__main__':
    matrix = np.array([
        [1, 2, 3, 4, 5],
        [5, 4, 3, 4, 3],
        [1, 1, 3, 1, 3],
        [4, 1, 3, 5, 2],
        [4, 2, 4, 2, 3]
    ])

    types = np.array([-1, 1, -1, 1, -1])

    method = 'Entropy'
    extension = 'crisp'

    weights = Weights(method, extension, types)
    print(weights.calculate_weights(matrix))