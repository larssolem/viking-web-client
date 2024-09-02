import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    connected: false,
    lastPing: new Date().getTime(),
 }

 const socketReducer = createSlice({
     name: "socket",
     initialState,
     reducers: {
         connect: (state) => {
             state.connected = true;
             console.log("connect dispatched")
         },
         disconnect: (state) => {
             state.connected = false;
         },
         ping: (state) => {
             state.lastPing = new Date().getTime();
         },
         send: (state, action) => {
         }
     }
 })

export const {connect, disconnect, ping, send} = socketReducer.actions;
export default socketReducer.reducer;

export function sendPing() {
    return async (dispatch, getState) => {
        setInterval(dispatch(ping()), 20000);
    }
}