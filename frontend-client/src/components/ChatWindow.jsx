import React, {useEffect, useState} from 'react';
import {Xterm} from 'xterm-react';
import {useSelector} from "react-redux";

const GeneralWindow = () => {
    const [terminal, setTerminal] = useState(null);
    const {chats} = useSelector((state) => state.messageState);

    const initializeTerminal = (term) => {
        if (!terminal) {
            console.log('Initializing terminal', term);
            setTerminal(term);
            term.resize(100, 20);
        }
        console.log("dispatching connect")
    };

    useEffect(() => {
        if (terminal) {
            terminal.write(chats[chats.length - 1]);
        }
    }, [chats])

    return (
        <div className="App">
            <header className="App-header">
                <Xterm onInit={initializeTerminal} onDispose={() => setTerminal(null)}/>
            </header>
        </div>
    );
};

export default GeneralWindow;