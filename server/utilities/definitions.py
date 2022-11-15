import pymcdm

mcda_methods = {
    'topsis': pymcdm.methods.TOPSIS,
    'vikor': pymcdm.methods.VIKOR,
    'promethee': pymcdm.methods.PROMETHEE_II,
    'copras': pymcdm.methods.COPRAS,
    'spotis': pymcdm.methods.SPOTIS,
    'comet': pymcdm.methods.COMET
}

normalization_methods = {
    'minmax': pymcdm.normalizations.minmax_normalization,
    'max': pymcdm.normalizations.max_normalization,
    'sum': pymcdm.normalizations.sum_normalization,
    'vector': pymcdm.normalizations.vector_normalization,
    'logarithmic': pymcdm.normalizations.logarithmic_normalization,
}

correlation_methods = {
    'spearman': pymcdm.correlations.spearman,
    'pearson': pymcdm.correlations.pearson,
    'weighted spearman': pymcdm.correlations.weighted_spearman,
    'rank similarity coef': pymcdm.correlations.rank_similarity_coef,
    'kendall tau': pymcdm.correlations.kendall_tau,
    'goodman kruskal gamma': pymcdm.correlations.goodman_kruskal_gamma
}

weights_methods = {
    'equal': pymcdm.weights.equal_weights,
    'entropy': pymcdm.weights.entropy_weights,
    'standard deviation': pymcdm.weights.standard_deviation_weights
}

all_info = {
    'methods': [k for k in mcda_methods.keys()],
    'normalizations': [k for k in normalization_methods.keys()],
    'correlations': [k for k in correlation_methods.keys()],
    'weights': [k for k in weights_methods.keys()]
}