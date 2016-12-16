require('./env');

const config = require('./../../configs');
const { connect } = require('net');
const { Server } = require('ws');
const debug = require('debug')('proxy:ws');

const wss = new Server({
    host : config['ws.server.host'],
    port : config['ws.port']
});

const Proxy = require('./socket');

wss.on('connection', ws => {
    debug('Connect protocol %s/%s', ws.protocolVersion, ws.protocol);

    let proxy = null;

    ws.on('message', message => {
        debug('Message length %d, type %s', message.length, typeof message);

        switch(typeof message) {
            case 'string':
                const { event, payout, uid } = JSON.parse(message);

                switch(event) {
                    case 'connect:server':
                        const server = Proxy.connect(payout);

                        server.then(
                            socket => {
                                ws.send(JSON.stringify({
                                    uid,
                                    event,
                                    error   : null,
                                    payout  : {
                                        ip : ws.upgradeReq.connection.remoteAddress
                                    }
                                }));

                                socket.on('data', buffer => ws.send(buffer, { binary: true }));
                                socket.on('close', ws.close);
                            },
                            error => {
                                ws.send(JSON.stringify({
                                    uid,
                                    event,
                                    error
                                }));
                            }
                        );
                        break;
                }
                break;
            case 'object':
                proxy && proxy.write(message);
                break;
        }

    });

    ws.on('close', () => {
        debug('closed');

        Proxy.end();
    });

    ws.on('error', error => {
        debug('error: %s', error);

        Proxy.end();
    });
});
