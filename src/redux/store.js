import {createStore} from 'redux';
import userStatusReducer from './userStatus/UserStatusReducer';

const store = createStore(userStatusReducer);

export default store;