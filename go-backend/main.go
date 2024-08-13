package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net"
	"net/http"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	// Connect to the Telnet server
	telnetAddr := "vikingmud.org:2001"
	telnetConn, err := net.Dial("tcp", telnetAddr)
	if err != nil {
		log.Println("Telnet connection error:", err)
		return
	}
	defer telnetConn.Close()

	go func() {
		for {
			_, msg, err := conn.ReadMessage()
			if err != nil {
				log.Println("WebSocket read error:", err)
				return
			}
			// Forward WebSocket data to Telnet
			telnetConn.Write(msg)
		}
	}()

	for {
		buf := make([]byte, 1024)
		n, err := telnetConn.Read(buf)
		if err != nil {
			log.Println("Telnet read error:", err)
			return
		}
		// Forward Telnet data to WebSocket
		conn.WriteMessage(websocket.TextMessage, buf[:n])
	}
}

func main() {
	http.HandleFunc("/ws", handleWebSocket)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
