import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import allReducers from './reducers/allReducers';
import {Provider} from 'react-redux';
import Board from './container/board';

const store = createStore(allReducers);

ReactDOM.render(
    <Provider store={store}>
        <Board/>
    </Provider>,
    document.getElementById('container')
);
