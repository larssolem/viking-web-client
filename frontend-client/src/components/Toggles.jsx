import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {toggleSplitChat} from "../store/messageReducer.js"

const SplitChatToggle = () => {
    const dispatch = useDispatch();
    const {splitChat} = useSelector((state) => state.messageState);

    const handleToggle = () => {
        dispatch(toggleSplitChat());
    };

    return (
        <div>
            <p>Split Chat is {splitChat ? 'On' : 'Off'}</p>
            <input type="checkbox" id="splitChatToggle" onClick={handleToggle}/>
            <label htmlFor="splitChatToggle">
                Toggle Split Chat
            </label>
        </div>
    );
};

export default SplitChatToggle;