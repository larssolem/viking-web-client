// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect, useRef} from 'react';
import { Xterm } from 'xterm-react';

const WebSocketClient = () => {
    const [Terminal, setTerminal] = useState(null);
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
            const text = response.Data.replace(/[^\x00-\x7F]/g, "");
            console.log(response)
            setMessages([...messages, text]);

            if (Terminal) {
                Terminal.write(text);
            }
        };
    }, [isPaused, messages]);

    const onTermInit = (term) => {
        if (!Terminal) {
            console.log('init term', term);
            setTerminal(term);
            term.reset();
            term.resize(100, 80)
            messages.forEach(message => {
                console.log("writing too term: ", message);
                term.write(message);
            })
        }
    }

    const onTermDispose = (term) => {
        setTerminal(null);
    }

    const handleData =(data) => {
        if (Terminal) {
            const code = data.charCodeAt(0)
            if (code === 13 && inputMessage.length > 0) {
                Terminal.write("\r\nEcho> " + inputMessage + "\r\n");
            } else if (code < 32 || code === 127)  {
                console.log('Controll key: ', code);
            } else {
                Terminal.write(data)
                setInputMessage(inputMessage + data)
            }
        }
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
            if (inputMessage.trim() !== '') {
                setMessages([...messages, inputMessage]);
                ws.current.send(inputMessage);
                setInputMessage('');
            }
        }
    }

    return (
        <div>
            { messages.length > 0 && (
            <div className="App">
                <header className="App-header">
                    <Xterm
                        onInit={onTermInit}
                        onDispose={onTermDispose}
                        onData={handleData}
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