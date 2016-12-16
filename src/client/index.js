import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga'

import Application from 'component/application';

import { GameSocket } from './network/gamesocket';
import { PacketRegistry } from './network/packetregistry';
import { createStore, applyMiddleware } from 'redux';
import reducers from './state/reducers';
import thunk from 'redux-thunk';

import { LoginHandler } from './state/login/login';
import { WorldHandler } from './state/world/world';
import { PlayerHandler } from './state/player/player';

// @@@@@
import config from 'config'
import Transport from 'core/transport'
import sagas from './sagas'

const transport = new Transport({
    host        : config['ws.client.host'],
    port        : config['ws.port'],
    protocol    : 'binary',
    binaryType  : 'arraybuffer'
});

const sagaMiddleware = createSagaMiddleware();

const middleware = [
    sagaMiddleware,
    thunk
];

if(__DEVELOPMENT__) {
    middleware.push(
        require('redux-logger')({
            duration    : true,
            diff        : true,
            collapsed   : true
        })
    );
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

const store = createStoreWithMiddleware(reducers);
sagaMiddleware.run(sagas);

const registry = new PacketRegistry();
const socket = new GameSocket(store, registry);

const handlers = {
    login: new LoginHandler(store, socket),
    world: new WorldHandler(store, socket),
    player: new PlayerHandler(store, socket)
};

Object
    .keys(handlers)
    .forEach(handler => handlers[handler].register(registry));

render(
    <Provider store={store}>
        <Application handlers={handlers} transport={transport} />
    </Provider>,
    document.getElementById('app')
);
