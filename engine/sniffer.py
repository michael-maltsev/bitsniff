from datetime import datetime
import numpy as np
import math
import os

k_fakes_num = 1000

# Return the similarity score for two time-series
def similarity(a, b):
    # return np.corrcoef(a, b)
    return np.trapz(a * b)

# Generate fake block time-series of given length
def generateFake(real):
    fake = np.zeros(len(real))
    size = np.sum(real) / np.count_nonzero(real)
    freq = np.count_nonzero(real) / len(real)
    for i in range(len(fake)):
        if np.random.random() < freq:
            fake[i] = size
    return fake

# Create bell shapes around blocks
def shapePredict(data):
    return data

# Calculate the probability of detection (in units of std)
def detect(traffic, blocks):
    if len(traffic) != len(block):
        print('Error: traffic/blocks length mismatch')
        return
    length = len(traffic)

    fake_results = np.zeros(k_fakes_num)
    for i in range(k_fakes_num):
        fake = generateFake(blocks)
        fake_results[i] = similarity(traffic, shapePredict(fake))

    real_result = similarity(traffic, shapePredict(blocks))

    fake_mean = np.mean(fake_results)
    fake_std = np.std(fake_results)

    return (real_result - fake_mean) / fake_std

# Getting timestamp from time values
def timestamp():
    return

# Parse log into python structure
def parseLog(filename):
    if not os.path.isfile(filename):
        print('Error: ' + filename + ' is not found')
        return
    with open(filename, "r") as log:
        lines = log.readlines()
        for line in lines:
            arr = line.split()
            time = [int(t) for t in arr[0].split('.')[0].split(':')]
            size = int(arr[-1])

            dt = datetime(2019, 9, 5, time[0], time[1], time[2])
            print(datetime.timestamp(dt))
            # if timestamp

    #return (array, start)
