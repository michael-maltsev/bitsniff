const { execFile } = require('child_process');
const stream = require('stream');
const fs = require('fs');
const ztable = require('ztable');

const successThreshold = 95;
const blockLengthInMinutes = 30;
const blockAmount = 50;

console.log('Loading log file...');
const logFile = 'logs/all_real-shifted.log';
const logFileLines = fs.readFileSync(logFile, 'utf-8').split('\n');
console.log('Log file loaded');

let blocksLeft = blockAmount;
let blocksPositive = 0;
let blocksNegative = 0;

measureNextBlock();

function measureNextBlock() {
  if (blocksLeft == 0) {
    //console.log('True positive: ' + (blocksPositive / (blocksPositive + blocksNegative)));
    console.log('False positive: ' + (blocksPositive / (blocksPositive + blocksNegative)));
    return;
  }

  let lineNum = Math.floor(Math.random() * (logFileLines.length - 2000 * blockLengthInMinutes));
  let line1 = logFileLines[lineNum];
  let prevMinute = minutesFromLine(line1);
  let minute = prevMinute;
  while (minute === prevMinute) {
    lineNum++;
    line1 = logFileLines[lineNum];
    minute = minutesFromLine(line1);
  }

  let lineNum1 = lineNum;
  let minute1 = minute;

  let minute2 = minute1;
  let line2;
  while (minute2 - minute1 <= blockLengthInMinutes) {
    lineNum++;
    line2 = logFileLines[lineNum];
    minute2 = minutesFromLine(line2);
  }

  let lineNum2 = lineNum;

  console.log(`Measuring from line ${lineNum1 + 1} to ${lineNum2}`);

  let log = '';
  for (let i = lineNum1; i < lineNum2; i++) {
    log += logFileLines[i] + '\n';
  }

  analyzeNetworkLog('bitcoin', log, (err, result) => {
    if (err) {
      console.log('Error');
      measureNextBlock();
      return;
    }

    const percentage = ztable(result * 0.5) * 100;
    console.log(`Percentage: ${percentage}`);

    if (percentage >= successThreshold) {
      blocksPositive++;
    } else {
      blocksNegative++;
    }

    blocksLeft--;
    console.log(`${blocksLeft} blocks left`);
    measureNextBlock();
  });
}

function minutesFromLine(line) {
  const h = parseInt(line.slice(0, 2), 10);
  const m = parseInt(line.slice(3, 5), 10);
  return h * 60 + m;
}

function analyzeNetworkLog(coin, log, next) {
  const child = execFile('python', ['analyze.py', coin], { cwd: '../engine' }, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(err);
      console.log('execFile error');
      return next(err);
    }

    // the *entire* stdout and stderr (buffered)
    //console.log(`stdout: ${stdout}`);
    //console.log(`stderr: ${stderr}`);

    try {
      const data = JSON.parse(stdout);
      return next(null, data.result);
    } catch (e) {
      console.log('JSON parse error');
      console.log(e);
      console.log('Data', stdout);
      return next(e);
    }
  });

  const stdinStream = new stream.Readable();
  stdinStream.push(log);           // Add data to the internal queue for users of the stream to consume
  stdinStream.push(null);          // Signals the end of the stream (EOF)
  stdinStream.pipe(child.stdin);
};
