import React, {useEffect, useState} from 'react';
import {Xterm} from 'xterm-react';
import {useSelector} from "react-redux";
import {useDispatch} from 'react-redux'
import {connect} from "../store/socketReducer.js";

const GeneralWindow = () => {
    const [terminal, setTerminal] = useState(null);
    const {messages} = useSelector((state) => state.messageState);
    const dispatch = useDispatch()

    const initializeTerminal = (term) => {
        if (!terminal) {
            console.log('Initializing terminal', term);
            setTerminal(term);
            dispatch(connect());
            term.resize(100, 80);
        }
        console.log("dispatching connect")
    };

    useEffect(() => {
        if (terminal) {
            terminal.write(messages[messages.length - 1]);
        }
    }, [messages])

    return (
        <div className="App">
            <header className="App-header">
                <Xterm onInit={initializeTerminal} onDispose={() => setTerminal(null)}/>
            </header>
        </div>
    );
};

export default GeneralWindow;