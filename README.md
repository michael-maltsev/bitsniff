# __BitSniff__
# Bitcoin Embassy Hackathon 2019

__BitSniff__ is a tool for detecting cryptocurrency-related communications in network traffic. We exploit traffic patterns during block propagation to determine the correlation between sniffed communications and the underlying blockchain activity. As blocks delivery time is consensus-critical for nodes, and economically important for miners, such attack can not easily be avoided.
The attack is fully passive, may be applied to historical data, and should work with most popular cryptocurrencies.

# Usecases:
* __BitSniff__ can be used for Bitcoin nodes detection by anyone having access to the traffic shape. The implication is the ability of ISP/government to detect Bitcoin nodes even if the communications are encrypted (e.g. running via VPN).
* __BitSniff__ can be used to detect unwanted mining activity on a machine (e.g. Monero mining malware). Current antivirus programs mostly rely on binary signatures or well-known endpoints, which can easily be tricked.

# Team:
* Niko 'Tommy' Kudriastev
* Michael 'Misha' Maltsev
