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

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Data string
	Time time.Time
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()
	log.Println("Connection upgraded")

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
			i, msg, err := conn.ReadMessage()
			if err != nil {
				log.Printf("WebSocket type: %d read error: %s", i, err)
				return
			}
			// Forward WebSocket data to Telnet
			fprintf, err := fmt.Fprintf(telnetConn, string(msg)+"\n")
			if err != nil {
				log.Println("error when writing: ", err, fprintf)
			}
		}
	}()

	for {
		buf := make([]byte, 1024*1024)
		_, err := telnetConn.Read(buf)
		if err != nil {
			log.Println("Telnet read error:", err)
			return
		}
		message := Message{Data: string(buf), Time: time.Now()}
		// Forward Telnet data to WebSocket
		byteMess, err := json.Marshal(message)
		if err != nil {
			log.Println("Error json marshalling message: ", err)
		}
		err = conn.WriteMessage(websocket.TextMessage, byteMess)
		if err != nil {
			log.Println(err)
		}
	}
}

func main() {
	fmt.Println("------------------- starting server ------------------------")
	http.HandleFunc("/ws", handleWebSocket)
	log.Fatal(http.ListenAndServe(":8090", nil))
}
