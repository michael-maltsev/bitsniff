from datetime import datetime
import os

def getTimeString():
	time = datetime.now()

	res = str(time.month).zfill(2) + '-'
	res += str(time.day).zfill(2) + '-'
	res += str(time.hour).zfill(2) + '-'
	res += str(time.minute).zfill(2) + '-'
	res += str(time.second).zfill(2)

	return res

def startLog():
	if not os.path.isdir('./data/'):
		os.system('mkdir data')

	while True:
		filename = getTimeString() + '.log'
		os.system('tcpdump -q -c 10000 port 8333 > ./data/' + filename)
