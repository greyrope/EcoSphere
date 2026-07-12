package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ecosphere/backend/internal/middleware"
	"github.com/ecosphere/backend/pkg/database"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func GetNotifications(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	notifications, err := database.GetNotifications(userID)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(notifications)
}

func MarkNotificationRead(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	var req struct {
		NotificationID string `json:"notification_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	if err := database.MarkNotificationRead(req.NotificationID, userID); err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, `{"error":"user_id is required"}`, http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	database.RegisterWebSocket(userID, conn)

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			database.UnregisterWebSocket(userID, conn)
			break
		}
	}
}
