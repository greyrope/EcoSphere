package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ecosphere/backend/internal/esg"
	"github.com/ecosphere/backend/internal/handlers"
	"github.com/ecosphere/backend/internal/middleware"
	"github.com/ecosphere/backend/internal/ws"
	"github.com/ecosphere/backend/pkg/database"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
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

	withMethod := func(method string, next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			if r.Method != method {
				http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
				return
			}
			next.ServeHTTP(w, r)
		}
	}

	withAuth := func(method string, next http.HandlerFunc) http.HandlerFunc {
		return withMethod(method, middleware.AuthMiddleware(next))
	}

	// Health Route
	mux.HandleFunc("/api/health", withMethod(http.MethodGet, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "Operational"}`))
	}))
	mux.HandleFunc("/api/auth/signup", withMethod(http.MethodPost, handlers.SignUp))
	mux.HandleFunc("/api/auth/signin", withMethod(http.MethodPost, handlers.SignIn))
	mux.HandleFunc("/api/auth/me", withAuth(http.MethodGet, handlers.GetCurrentUser))
	mux.HandleFunc("/api/profile", withMethod(http.MethodGet, handlers.GetProfile))
	mux.HandleFunc("/api/organizations", withMethod(http.MethodGet, handlers.GetOrganization))
	mux.HandleFunc("/api/metrics/environmental", withMethod(http.MethodGet, handlers.GetEnvironmentalMetrics))
	mux.HandleFunc("/api/metrics/social", withMethod(http.MethodGet, handlers.GetSocialMetrics))
	mux.HandleFunc("/api/metrics/governance", withMethod(http.MethodGet, handlers.GetGovernanceMetrics))
	mux.HandleFunc("/api/policies", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handlers.GetPolicies(w, r)
		case http.MethodPost:
			handlers.CreatePolicy(w, r)
		default:
			http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/api/badges", withMethod(http.MethodGet, handlers.GetBadges))
	mux.HandleFunc("/api/badges/user", withMethod(http.MethodGet, handlers.GetUserBadges))
	mux.HandleFunc("/api/rewards", withMethod(http.MethodGet, handlers.GetRewards))
	mux.HandleFunc("/api/rewards/redeem", withAuth(http.MethodPost, handlers.RedeemReward))
	mux.HandleFunc("/api/notifications", withAuth(http.MethodGet, handlers.GetNotifications))
	mux.HandleFunc("/api/notifications/read", withAuth(http.MethodPost, handlers.MarkNotificationRead))

	// THE WEBSOCKET ENDPOINT
	mux.HandleFunc("/ws", withMethod(http.MethodGet, func(w http.ResponseWriter, r *http.Request) {
		ws.ServeWs(hub, w, r)
	}))
	mux.HandleFunc("/api/csr", withMethod(http.MethodPost, esgAPI.HandleSubmitCSR))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("EcoSphere API initialized. Listening on port %s...", port)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions},
		AllowedHeaders: []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
	})

	if err := http.ListenAndServe(":"+port, corsHandler.Handler(mux)); err != nil {
		log.Fatalf("Critical Server Failure: %v", err)
	}
}
