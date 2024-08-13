// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect, useRef} from 'react';

const WebSocketClient = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isPaused, ] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8090/ws");
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");

        const wsCurrent = ws.current;

        return () => {
            wsCurrent.close();
        };
    }, []);

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = (e) => {
            if (isPaused) return;
            console.log(e.data)
            console.log(JSON.stringify(e.data));
            const response = JSON.parse(e.data);
            console.log(response)
            setMessages([...messages, response.Data]);
        };
    }, [isPaused, messages]);


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
            if (inputMessage.trim() !== '') {
                setMessages([...messages, inputMessage]);
                ws.current.send(inputMessage);
                setInputMessage('');
            }
        }
    }

    return (
        <div>
            <div>
                <h2>WebSocket Output:</h2>
                <div>
                    {messages.map((msg, index) => (
                        <pre key={index}>{msg}</pre>
                    ))}
                </div>
            </div>
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