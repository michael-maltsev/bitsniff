from datetime import datetime
import os

def charchar(num):
	s = str(num)
	if len(s) < 2:
		s = "0" + s
	return s

def getTimeString():
	time = datetime.now()

	res = charchar(time.month) + '-'
	res += charchar(time.day) + '-'
	res += charchar(time.hour) + '-'
	res += charchar(time.minute) + '-'
	res += charchar(time.second)

	return res

if not os.path.isdir('./data/'):
	os.system('mkdir data')

while True:
	filename = getTimeString() + '.log'
	os.system('tcpdump -q -c 10000 port 8333 > ./data/' + filename)
