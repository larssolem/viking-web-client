import React, {useState} from 'react';
import {send} from "../store/socketReducer.js";
import {useDispatch} from "react-redux";

const InputField = () => {
    const [inputMessage, setInputMessage] = useState('');
    const dispatch = useDispatch()

    const handleSendMessage = () => {
        dispatch(send(inputMessage));
        setInputMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };
    return (
        <div>
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default InputField;