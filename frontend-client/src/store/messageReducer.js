import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    messages: [],
    chats: [],
    splitChat: false
}

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        addMessage: (state, action) => {
            if (state.splitChat) {
                const tellsYou = /(\w+?) tells you: (.+)/;
                //const youTell = /You tell (\w+): (.+)/;
                const chat = /^\x1b\[[0-9;]*m(\w+)\s\[(\w+)\]:\s(.+)/;
                if (action.payload.match(tellsYou)) {
                    state.chats.push(action.payload);
                } else if (action.payload.match(chat)) {
                    state.chats.push(action.payload);
                } else {
                    state.messages.push(action.payload);
                }
            } else {
                state.messages.push(action.payload);
            }
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        toggleSplitChat: (state) => {
            state.splitChat = !state.splitChat;
        }
    },
})

export const {addMessage, clearMessages, toggleSplitChat} = messageSlice.actions;
export default messageSlice.reducer;
