import numpy as np
import pyfdm

class Additional():
    def __init__(self):
        pass

    @staticmethod
    def generate_random_matrix(alternatives, criteria, extension):
        if extension == 'crisp':
            return np.random.random((alternatives, criteria))
        elif extension == 'fuzzy':
            return pyfdm.helpers.generate_fuzzy_matrix(alternatives, criteria)
        else:
            return {'error': f'Cannot generate random matrix for {extension} extension'}
