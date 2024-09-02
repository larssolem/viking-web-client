import {addMessage, clearMessages} from "../store/messageReducer.js";
import {ping} from "../store/socketReducer.js";
import {WS_URL} from "../config.js";

export const socketMiddleware = (socket) => (params) => (next) => (action) => {
    const { dispatch, getState } = params
    const { type, payload } = action

    switch (type) {
        case 'socket/connect':
            if (!socket.socket) {
                console.log("middleware socket/connect")
                socket.connect(WS_URL)

                socket.on('open', () => {
                    console.log("WebSocket opened")
                    dispatch(ping())
                })
                socket.on('message', (e) => {
                    const response = JSON.parse(e.data);
                    const text = response.Data.replace(/[^\x00-\x7F]/g, "");
                    if (text === "__pong__") return;
                    dispatch(addMessage(text))

                })
                socket.on('close', () => {
                    console.log("WebSocket closed")
                })
            }
            break

        case 'socket/disconnect':
            socket.disconnect()
            dispatch(clearMessages())
            break

        case 'socket/ping':
            socket.send("__ping__")
            break

        case 'socket/send':
            socket.send(payload)
            break

        default:
            break
    }

    return next(action)
}