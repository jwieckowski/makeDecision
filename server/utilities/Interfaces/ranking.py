import numpy as np
from pyfdm.helpers import rank

class Ranking():
    def __init__(self, orders):
        self.orders = orders
        
    def calculate_ranking(self, matrix):
        
        error = None
        results = []
        for idx, order in enumerate(self.orders):
            if order not in ['Ascending', 'Descending']:
                error = f'Ranking order ({order}) not found'
                ranking = []
            else:
                if order == 'Ascending':
                    ranking = rank(matrix[idx], descending=False)
                else:
                    ranking =  rank(matrix[idx])
            
            results.append({
                'order': order,
                'ranking': ranking.tolist(),
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

    method = 'Ascending'

    ranking = Ranking(method)
    print(ranking.calculate_ranking(matrix))