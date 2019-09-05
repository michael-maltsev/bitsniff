from datetime import datetime
import sys
import json

# Parse log into python array and start timestamp
def parseLog():
    lines = sys.stdin.readlines()
    ts_dict = {}

    for line in lines:
        arr = line.split()
        time = [int(t) for t in arr[0].split('.')[0].split(':')]
        size = int(arr[-1])

        dt = datetime(2019, 9, 5, time[0], time[1], time[2])
        key = int(datetime.timestamp(dt))
        if key in ts_dict:
            ts_dict[key] += size
        else:
            ts_dict[key] = size

    ts_arr = [ts_dict[k] for k in sorted(ts_dict.keys())]
    return (ts_arr, sorted(ts_dict.keys())[0])

# Get the blockchain data given start time and timeframe
def getBlocks(start, length):
    return [0 for i in range(length)]

traffic, start = parseLog()
blocks = getBlocks(start, len(traffic))
result = 2.1

response = json.dumps({'traffic': traffic, 'blocks': blocks, 'result': result})

print(response)
