from datetime import datetime
from datetime import timezone
from urllib.request import urlopen
import urllib
import numpy as np
import os
import sys
import pickle
import json
import sniffer

# Parse .pcap file into python array and start timestamp
def parsePcap(packets):
    ts_dict = {}

    for p in packets:
        time = int(str(p.time).split('.')[0])
        size = len(p)

        if time in ts_dict:
            ts_dict[time] += size
        else:
            ts_dict[time] = size

    start = sorted(ts_dict.keys())[0]
    end = sorted(ts_dict.keys())[-1]

    ts_arr = []
    for t in range(start, end + 1):
        if t in ts_dict:
            ts_arr += [ts_dict[t]]
        else:
            ts_arr += [0]

    return (ts_arr, start)


# Parse log into python array and start timestamp
def parseLog():
    lines = sys.stdin.readlines()
    ts_dict = {}

    for line in lines:
        arr = line.split()
        time = [int(t) for t in arr[0].split('.')[0].split(':')]
        try:
            size = int(arr[-1])
        except:
            size = 0

        if len(sys.argv) > 2:
            day = int(sys.argv[2])

        dt = datetime(2019, 9, day, time[0], time[1], time[2])
        key = int(datetime.timestamp(dt))
        if key in ts_dict:
            ts_dict[key] += size
        else:
            ts_dict[key] = size

    start = sorted(ts_dict.keys())[0]
    end = sorted(ts_dict.keys())[-1]

    ts_arr = []
    for t in range(start, end + 1):
        if t in ts_dict:
            ts_arr += [ts_dict[t]]
        else:
            ts_arr += [0]

    return (ts_arr, start)

# Get the blockchain data (BTC)
def getBlocksDict():
    request = 'https://api.blockchair.com/bitcoin/'
    request += 'blocks?q=time(2019-09-04..2019-09-06)&limit=100&offset='

    limit = 100
    offset = 0

    content = urlopen(request + str(offset)).read()
    data = json.loads(content)
    blocks_tuples = [(block['time'], block['size']) for block in data['data']]

    rows_num = data['context']['total_rows']
    while offset + limit < rows_num:
        offset += 100
        content = urlopen(request + str(offset)).read()
        data = json.loads(content)
        blocks_tuples += [(block['time'], block['size']) for block in data['data']]

    blocks_tuples.sort(key=lambda block: block[0])
    def get_timestamp(d):
        arr = [int(n) for n in (d.split()[0].split('-') + d.split()[1].split(':'))]
        dt = datetime(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], tzinfo=timezone.utc)
        return datetime.timestamp(dt)

    b_dict = {}
    for block in blocks_tuples:
        key = int(get_timestamp(block[0]))
        if key in b_dict:
            b_dict[key] += block[1]
        else:
            b_dict[key] = block[1]

    return b_dict

# Return blocks array given start time and timeframe
def getBlocksArray(start, length, b_dict):
    b_arr = []
    for t in range(start, start + length):
        if t in b_dict:
            b_arr += [b_dict[t]]
        else:
            b_arr += [0]

    return b_arr

traffic, start = parseLog()

pkl_path = './blocks_dict.pickle'

if os.path.isfile(pkl_path):
    with open(pkl_path, 'rb') as pkl_file:
        blocks_dict = pickle.load(pkl_file)
else:
    blocks_dict = getBlocksDict()
    with open(pkl_path, 'wb') as pkl_file:
        pickle.dump(blocks_dict, pkl_file)

blocks_data = getBlocksArray(start, len(traffic), blocks_dict)
blocks_web = list(sniffer.bellShape(blocks_data))
blocks_local = sniffer.shapePredict(blocks_data)

result = sniffer.detect(traffic, blocks_local)

response = json.dumps({'traffic': traffic, 'blocks': blocks_web, 'result': result})

print(response)
