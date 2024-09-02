import { combineReducers } from 'redux'
import messageReducer from "./messageReducer.js";
import socketReducer from "./socketReducer.js";

export const rootReducer = combineReducers({
    messageState: messageReducer,
    socketState: socketReducer
})