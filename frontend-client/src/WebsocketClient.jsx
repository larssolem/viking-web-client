// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect, useRef} from 'react';
import {Xterm} from 'xterm-react';

const WebSocketClient = () => {
    const [Terminal, setTerminal] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isPaused,] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8090/ws");
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");

        const wsCurrent = ws.current;

        const interval = setInterval(() => {
            sendPing();
        }, 20000);

        return () => {
            clearInterval(interval);
            wsCurrent.close();
        };
    }, []);

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = (e) => {
            if (isPaused) return;
            const response = JSON.parse(e.data);
            const text = response.Data.replace(/[^\x00-\x7F]/g, "");

            if (text === "__pong__") {
                return
            }
            setMessages([...messages, text]);

            if (Terminal) {
                Terminal.write(text);
            }
        };
    }, [isPaused, messages]);

    const sendPing = () => {
        if (!ws.current) {
            return;
        }
        ws.current.send("__ping__")
    }

    const onTermInit = (term) => {
        if (!Terminal) {
            console.log('init term', term);
            setTerminal(term);
            term.reset();
            term.resize(100, 80)
            messages.forEach(message => {
                term.write(message);
            })
        }
    }

    const onTermDispose = (term) => {
        setTerminal(null);
    }


    const handleSendMessage = () => {
        if (inputMessage.trim() !== '') {
            console.log('inputMessage', inputMessage);
            setMessages([...messages, inputMessage]);
            ws.current.send(inputMessage);
            setInputMessage('');
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setMessages([...messages, inputMessage]);
            ws.current.send(inputMessage);
            setInputMessage('');
        }
    }

    return (
        <div>
            {messages.length > 0 && (
                <div className="App">
                    <header className="App-header">
                        <Xterm
                            onInit={onTermInit}
                            onDispose={onTermDispose}
                        />
                    </header>
                </div>)
            }
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
        </div>
    );
};

export default WebSocketClient;