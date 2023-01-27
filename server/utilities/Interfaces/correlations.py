import numpy as np
import pymcdm.correlations as corr

class Correlation():
    def __init__(self, methods):
        self.methods = methods
        
    def calculate_correlation(self, matrix):
        methods = {
            'Goodman-Kruskall': corr.goodman_kruskal_gamma,
            'Kendall-Tau': corr.kendall_tau,
            'Pearson': corr.pearson,
            'Spearman': corr.spearman,
            'Weighted Spearman': corr.weighted_spearman,
            'WS rank similarity': corr.rank_similarity_coef
        }

        error = None
        results = []
        for method in self.methods:
            if method not in methods.keys():
                error = 'Correlation coefficient method not found'
                correlation = []
            else:
                correlation =  np.array([[methods[method](a, b) for b in matrix] for a in matrix])
            
            results.append({
                'method': method,
                'correlation': correlation.tolist(),
                'error': error

            })

        return results

if __name__ == '__main__':
    matrix = np.array([
        [1, 2, 3, 4, 5],
        [5, 4, 3, 4, 3],
        [1, 1, 3, 1, 3],
        [4, 1, 3, 5, 2],
        [4, 2, 4, 2, 3]
    ])
    matrix2 = np.array([
        [1, 2, 3, 4, 5],
        [5, 4, 3, 4, 3]
    ])

    method = 'WS rank similarity'

    correlation = Correlation(method)
    print(correlation.calculate_correlation(matrix))
    print(correlation.calculate_correlation(matrix2))