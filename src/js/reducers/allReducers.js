import {combineReducers} from 'redux';
import boardReducer from './boardReducer';

const allReducers = combineReducers({
    board: boardReducer
});

export default allReducers;