const express = require('express');
const os = require('os');
const { exec } = require('child_process');
var bodyParser = require('body-parser');

const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.post('/api/analyzeNetworkLog', (req, res) => {
  console.log(JSON.stringify(req.body.log));

  exec('cmd /c echo {"a":1}', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      res.status(500).send('Oh uh, something went wrong - could not run analyzer');
      return;
    }

    // the *entire* stdout and stderr (buffered)
    //console.log(`stdout: ${stdout}`);
    //console.log(`stderr: ${stderr}`);

    try {
      res.send(JSON.parse(stdout));
    } catch (e) {
      res.status(500).send('Oh uh, something went wrong - invalid result');
    }
  });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
