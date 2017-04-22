import {combineReducers} from 'redux';
import boardReducer from './boardReducer';
import gameplayReducer from './gameplayReducer';

const allReducers = combineReducers({
    board: boardReducer,
    gameplay: gameplayReducer
});

export default allReducers;