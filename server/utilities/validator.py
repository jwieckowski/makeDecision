import numpy as np

class Validator():

    @staticmethod
    def validate_dimensions(matrix, types, weights=None):

        # check dimensions match
        if weights == None:
            if len(np.unique([matrix.shape[1], types.shape[0]])) != 1:
                return {'error': f'Number of criteria should equals number of types, not {matrix.shape[1]}, {types.shape[0]}'}
        else:
            if len(np.unique([matrix.shape[1], weights.shape[0], types.shape[0]])) != 1:
                return {'error': f'Number of criteria should equals number of weights and types, not {matrix.shape[1]}, {weights.shape[0]}, {types.shape[0]}'}
    
    @staticmethod
    def validate_orders_dimensions(matrix, orders):

        # check dimensions match
        if len(np.unique([matrix.shape[0], orders.shape[0]])) != 1:
            return {'error': f'Number of arrays and orders should be the same, not {matrix.shape[0]}, {orders.shape[0]}'}

    @staticmethod
    def validate_matrix(matrix, extension):
        
        if extension == 'crisp':
            # dimension
            if matrix.ndim != 2:
                return {'error': 'Crisp matrix bad formatted'}
            # numeric values
        elif extension == 'fuzzy':
            # dimension
            if matrix.ndim != 3 or matrix.shape[2] != 3:
                return {'error': 'Fuzzy matrix bad formatted'}
        else:
            return {'error': f'Extension "{extension}" not handled'}


        # numeric values
        if matrix.dtype not in [np.int32, np.int64, np.float32, np.float64]:
            return {'error': 'Not all elements in matrix are numeric'}
            
    @staticmethod
    def validate_user_weights(weights):
        
        # crisp weights
        if weights.ndim == 1 and np.round(np.sum(weights), 4) != 1:
            return {'error': 'Weights should sum up to 1'}

        # fuzzy weights
        if weights.ndim != 2 or weights.shape[1] != 3:
            return {'error': 'Fuzzy weights should be given as Triangular Fuzzy Numbers'}

    @staticmethod
    def validate_types(types, unique_values=False):

        # check if types in [-1, 1]
        if any([t not in [-1, 1] for t in types]):
            return {'error': 'Criteria types should be given as -1 for cost or 1 for profit'}
            
        # check if different types in array
        if unique_values:
            if len(np.unique(types)) == 1:
                return {'error': 'Criteria types should not be the same'}
