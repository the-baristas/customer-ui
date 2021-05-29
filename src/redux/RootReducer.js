import { combineReducers } from 'redux';
import userStatusReducer from './userStatus/UserStatusReducer';

const rootReducer = combineReducers({userStatus: userStatusReducer});

export default rootReducer;