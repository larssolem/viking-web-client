package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net"
	"net/http"
	"time"
)

const (
	telnetAddress  = "vikingmud.org:2001"
	websocketRoute = "/ws"
	wsBufferSize   = 1024 * 1024
	serverAddress  = "localhost:8090"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Data string
	Time time.Time
}

func main() {
	fmt.Println("------------------- starting server ------------------------")
	http.HandleFunc(websocketRoute, handleWebSocket)
	log.Fatal(http.ListenAndServe(serverAddress, nil))
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()
	log.Printf("Connection upgraded from %s", conn.RemoteAddr().String())

	telnetConn, err := net.Dial("tcp", telnetAddress)
	if err != nil {
		log.Println("Telnet connection error:", err)
		return
	}
	defer telnetConn.Close()

	go handleWebSocketMessages(conn, telnetConn)
	handleTelnetMessages(conn, telnetConn)
}

func handleWebSocketMessages(wsConn *websocket.Conn, telnetConn net.Conn) {
	for {
		msgType, msg, err := wsConn.ReadMessage()
		if err != nil {
			log.Printf("WebSocket read error (type %d): %s", msgType, err)
			return
		}
		if string(msg) == "__ping__" {
			handlePingMessage(wsConn)
		} else {
			_, err := fmt.Fprintf(telnetConn, string(msg)+"\n")
			if err != nil {
				log.Println("Error writing to Telnet:", err)
			}
		}
	}
}

func handlePingMessage(wsConn *websocket.Conn) {
	message := Message{Data: "__pong__"}
	byteMessage, err := json.Marshal(message)
	if err != nil {
		log.Println("Error marshalling JSON:", err)
		return
	}
	log.Println("Received ping message from " + wsConn.RemoteAddr().String())
	err = wsConn.WriteMessage(websocket.PongMessage, byteMessage)
	if err != nil {
		log.Println("Error writing WebSocket message:", err)
	}
}

func handleTelnetMessages(wsConn *websocket.Conn, telnetConn net.Conn) {
	for {
		buffer := make([]byte, wsBufferSize)
		n, err := telnetConn.Read(buffer)
		if err != nil {
			log.Println("Telnet read error:", err)
			return
		}
		message := Message{Data: string(buffer[:n]), Time: time.Now()}
		byteMessage, err := json.Marshal(message)
		if err != nil {
			log.Println("Error marshalling JSON:", err)
			return
		}
		err = wsConn.WriteMessage(websocket.TextMessage, byteMessage)
		if err != nil {
			log.Println("Error writing WebSocket message:", err)
		}
	}
}
