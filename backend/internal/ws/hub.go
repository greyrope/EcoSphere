package ws

import (
	"encoding/json"
	"log"
)

// Client represents a single connected user
type Client struct {
	Hub  *Hub
	Conn interface{} // Gorilla WebSocket connection
	Send chan []byte // Channel for outbound messages
}

// Hub maintains the set of active clients and broadcasts messages
type Hub struct {
	Clients    map[*Client]bool
	Broadcast  chan []byte
	Register   chan *Client
	Unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true
			log.Println("⚡ New client connected to WebSocket Hub")
		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)
			}
		case message := <-h.Broadcast:
			// Blast the message to every connected React frontend
			for client := range h.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.Clients, client)
				}
			}
		}
	}
}

// Payload is the standard JSON structure for our real-time events
func (h *Hub) BroadcastEvent(eventType string, data interface{}) {
	msg := map[string]interface{}{
		"type": eventType,
		"data": data,
	}
	encoded, _ := json.Marshal(msg)
	h.Broadcast <- encoded
}