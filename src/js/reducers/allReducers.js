import {combineReducers} from 'redux';
import {boardReducer} from './board';

const allReducers = combineReducers({
    board: boardReducer
});

export default allReducers;