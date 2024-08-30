import React, { useState, useEffect, useRef } from 'react';
import { Xterm } from 'xterm-react';

const WebSocketClient = () => {
    const [terminal, setTerminal] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const ws = useRef(null);

    const initializeWebSocket = () => {
        ws.current = new WebSocket("ws://localhost:8090/ws");
        ws.current.onopen = () => console.log("WebSocket opened");
        ws.current.onclose = () => console.log("WebSocket closed");
        return setInterval(sendPingMessage, 20000);
    };

    const cleanupWebSocket = () => {
        if (ws.current) {
            ws.current.close();
        }
    };

    const handleWebSocketMessage = (e) => {
        const response = JSON.parse(e.data);
        const text = response.Data.replace(/[^\x00-\x7F]/g, "");
        if (text === "__pong__") return;
        setMessages(prevMessages => [...prevMessages, text]);
        if (terminal) {
            terminal.write(text);
        }
    };

    const sendPingMessage = () => {
        if (ws.current) {
            ws.current.send("__ping__");
        }
    };

    const initializeTerminal = (term) => {
        if (!terminal) {
            console.log('Initializing terminal', term);
            setTerminal(term);
            term.reset();
            term.resize(100, 80);
            messages.forEach(message => term.write(message));
        }
    };

    const handleSendMessage = () => {
        if (ws.current) {
            ws.current.send(inputMessage);
            setInputMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    useEffect(() => {
        const interval = initializeWebSocket();
        return () => {
            cleanupWebSocket();
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!ws.current) return;
        ws.current.onmessage = handleWebSocketMessage;
    }, [messages]);

    return (
        <div>
            {messages.length > 0 && (
                <div className="App">
                    <header className="App-header">
                        <Xterm onInit={initializeTerminal} onDispose={() => setTerminal(null)} />
                    </header>
                </div>
            )}
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