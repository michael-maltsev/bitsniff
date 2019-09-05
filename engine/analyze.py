from datetime import datetime
from datetime import timezone
from urllib.request import urlopen
import sys
import json
import sniffer

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

    start = sorted(ts_dict.keys())[0]
    end = sorted(ts_dict.keys())[-1]

    ts_arr = []
    for t in range(start, end + 1):
        if t in ts_dict:
            ts_arr += [ts_dict[t]]
        else:
            ts_arr += [0]

    return (ts_arr, start)

# Get the blockchain data given start time and timeframe
def getBlocks(start, length):
    request = 'https://api.blockchair.com/bitcoin/'
    request += 'blocks?q=time(2019-09-04..2019-09-05)&limit=100&offset='

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

    b_arr = []
    for t in range(start, start + length):
        if t in b_dict:
            b_arr += [b_dict[t]]
        else:
            b_arr += [0]

    return b_arr

# Hack for prettier plot
def bellShape(data):
    result = np.zeros(len(data) + len(k_bell_shape))
    for i in range(len(data)):
        if data[i] > 0:
            for b in range(len(k_bell_shape)):
                if b == 3:
                    result[i + b] = data[i]
                else:
                    result[i + b] = None

    return result[:len(data)]

traffic, start = parseLog()
blocks_data = getBlocks(start, len(traffic))
blocks = list(bellShape(blocks_data))
result = sniffer.detect(traffic, blocks)

response = json.dumps({'traffic': traffic, 'blocks': blocks, 'result': result})

print(response)
