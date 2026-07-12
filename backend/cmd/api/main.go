package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ecosphere/backend/internal/esg"
	"github.com/ecosphere/backend/internal/ws"
	"github.com/ecosphere/backend/pkg/database"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found.")
	}

	db := database.InitDB()
	defer db.Close()

	// Initialize the Real-Time Engine
	hub := ws.NewHub()
	go hub.Run()

	// Initialize the ESG API Module
	esgAPI := &esg.API{
		DB:  db,
		Hub: hub,
	}

	mux := http.NewServeMux()

	// Health Route
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "Operational"}`))
	})

	// THE WEBSOCKET ENDPOINT
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ws.ServeWs(hub, w, r)
	})

	// THE SOCIAL ESG ENDPOINT
	mux.HandleFunc("/api/csr", esgAPI.HandleSubmitCSR)

	// Add basic CORS headers for your Vite frontend
	handler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if r.Method == "OPTIONS" {
			return
		}
		mux.ServeHTTP(w, r)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("EcoSphere API initialized. Listening on port %s...", port)
	if err := http.ListenAndServe(":"+port, http.HandlerFunc(handler)); err != nil {
		log.Fatalf("Critical Server Failure: %v", err)
	}
}
