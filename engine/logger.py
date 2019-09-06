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

# Create log files used for detection
# Bitcoin nodes run on 8333 by default
# For Monero mining use pool port
def startLog(port):
	if not os.path.isdir('./data/'):
		os.system('mkdir data')

	while True:
		filename = getTimeString() + '.log'
		os.system('tcpdump -q -c 10000 port ' + port + ' > ./data/' + filename)
