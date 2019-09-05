import numpy as np
import math

# Return the similarity score for two timeseries
def similarity(a, b):
    # return np.corrcoef(a, b)
    return np.trapz(a * b)
