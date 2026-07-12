package ws

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// The Upgrader bypasses SameOrigin policy for the hackathon. 
// If this were production, I would fire you for this CheckOrigin function.
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all incoming connections for local Vite dev server
	},
}

// ServeWs handles websocket requests from the peer.
func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("❌ WebSocket Upgrade Failed:", err)
		return
	}
	client := &Client{Hub: hub, Conn: conn, Send: make(chan []byte, 256)}
	client.Hub.Register <- client

	// We only need this goroutine to push messages TO the frontend right now
	go func() {
		defer func() {
			client.Hub.Unregister <- client
			conn.Close()
		}()
		for message := range client.Send {
			w, err := conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)
			w.Close()
		}
	}()
}