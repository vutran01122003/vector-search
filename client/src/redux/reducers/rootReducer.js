import { combineReducers } from 'redux';
import chatReducer from './chatReducer';

const rootReducer = combineReducers({
    // Add reducers here
    chatReducer
});

export default rootReducer;
