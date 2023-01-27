import numpy as np
import pymcdm.weights as crisp_weights
import pyfdm.weights as fuzzy_weights

class Weights():
    def __init__(self, method, extension, types, weights = None):
        self.method = method
        self.extension = extension
        self.weights = weights
        self.types = types

    def validate_input_weights(self, matrix):
        if self.weights == None:
            return 'Error'
        
        if matrix.shape[1] != self.weights.shape[0]:
            return "Different sizes"

        if self.extension == 'ifs':
            return 'All weights should be represented as ifs'

        if self.extension == 'fuzzy':
            return 'All weights should be represented as tfn'

        if np.round(np.sum(self.weights), 5) != 1:
            return "Sum not equals 1"

    def calculate_weights(self, matrix):
        methods = {
            'Angle': {
                'crisp': crisp_weights.angle_weights
            },
            'CILOS': {
                'crisp': crisp_weights.cilos_weights
            },
            'CRITIC': {
                'crisp': crisp_weights.critic_weights,
            },
            'Entropy': {
                'crisp': crisp_weights.entropy_weights,
                'fuzzy': fuzzy_weights.shannon_entropy_weights
            },
            'Equal': {
                'crisp': crisp_weights.equal_weights,
                'fuzzy': fuzzy_weights.equal_weights
            },
            'Gini': {
                'crisp': crisp_weights.gini_weights
            },
            'IDOCRIW': {
                'crisp': crisp_weights.idocriw_weights
            },
            'MEREC': {
                'crisp': crisp_weights.merec_weights
            },
            'Standard deviation': {
                'crisp': crisp_weights.standard_deviation_weights,
                'fuzzy': fuzzy_weights.standard_deviation_weights
            },
            'Variance': {
                'crisp': crisp_weights.variance_weights,
                'fuzzy': fuzzy_weights.variance_weights
            }
        }

        error = False
        weights = None
        if self.extension not in methods[self.method].keys():
            error = f'Extension ({self.extension}) not found'
        else:
            if self.method in ['MEREC', 'CILOS', 'IDOCRIW']:
                weights = methods[self.method][self.extension](matrix, self.types)
            else:
                weights = methods[self.method][self.extension](matrix)

        return {
            'method': self.method,
            'weights': weights.tolist(),
            'extension': self.extension,
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