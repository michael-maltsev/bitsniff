# __BitSniff__
## Bitcoin Embassy Hackathon 2019

__BitSniff__ is a tool for detecting cryptocurrency-related communications in network traffic. We exploit traffic patterns during block propagation to determine the correlation between sniffed communications and the underlying blockchain activity. As blocks delivery time is consensus-critical for nodes, and economically important for miners, such attack can not easily be avoided.
The attack is fully passive, may be applied to historical data, and should work with most popular cryptocurrencies.

## Use cases
* __BitSniff__ can be used for Bitcoin nodes detection by anyone having access to the traffic shape. The implication is the ability of ISP/government to detect Bitcoin nodes even if the communications are encrypted (e.g. running via VPN).
* __BitSniff__ can be used to detect unwanted mining activity on a machine (e.g. Monero mining malware). Current antivirus programs mostly rely on binary signatures or well-known endpoints, which can easily be tricked.

## Usage
First, install the programs required to run the application:

* [Python 3](https://www.python.org/downloads/) with [numpy](https://pypi.org/project/numpy/)
* [Node.js](https://nodejs.org/en/download/)

Next, clone this repository:

    git clone https://github.com/michael-maltsev/bitsniff.git

Now install dependencies for the web app and run it:

    cd web-app
    npm install
    npm run dev

The application should open automatically in the browser.

Drag one of the logs from the `real_logs` or `fake_logs` folder to analyze it.

## Team
* Niko 'Tommy' Kudriastev
* Michael 'Misha' Maltsev
