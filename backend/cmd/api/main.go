package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ecosphere/backend/internal/config"
	"github.com/ecosphere/backend/internal/handlers"
	"github.com/ecosphere/backend/internal/middleware"
	"github.com/ecosphere/backend/pkg/database"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	cfg := config.Load()

	if err := database.Connect(cfg.DatabaseURL); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	go database.StartNotificationListener()

	router := mux.NewRouter()

	api := router.PathPrefix("/api").Subrouter()

	api.HandleFunc("/auth/signup", handlers.SignUp).Methods("POST")
	api.HandleFunc("/auth/signin", handlers.SignIn).Methods("POST")

	protected := api.NewRoute().Subrouter()
	protected.Use(middleware.AuthMiddleware)

	protected.HandleFunc("/auth/me", handlers.GetCurrentUser).Methods("GET")
	protected.HandleFunc("/profile", handlers.GetProfile).Methods("GET")

	protected.HandleFunc("/organizations", handlers.GetOrganization).Methods("GET")

	protected.HandleFunc("/metrics/environmental", handlers.GetEnvironmentalMetrics).Methods("GET")
	protected.HandleFunc("/metrics/social", handlers.GetSocialMetrics).Methods("GET")
	protected.HandleFunc("/metrics/governance", handlers.GetGovernanceMetrics).Methods("GET")

	protected.HandleFunc("/policies", handlers.GetPolicies).Methods("GET")
	protected.HandleFunc("/policies", handlers.CreatePolicy).Methods("POST")

	protected.HandleFunc("/badges", handlers.GetBadges).Methods("GET")
	protected.HandleFunc("/badges/user", handlers.GetUserBadges).Methods("GET")
	protected.HandleFunc("/rewards", handlers.GetRewards).Methods("GET")
	protected.HandleFunc("/rewards/redeem", handlers.RedeemReward).Methods("POST")

	protected.HandleFunc("/notifications", handlers.GetNotifications).Methods("GET")
	protected.HandleFunc("/notifications/read", handlers.MarkNotificationRead).Methods("POST")

	router.HandleFunc("/ws", handlers.WebSocketHandler)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{cfg.CORSOrigin},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	port := cfg.Port
	if port == "" {
		port = "8080"
	}

	log.Printf("EcoSphere API server starting on :%s", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func init() {
	if os.Getenv("DATABASE_URL") == "" {
		log.Println("WARNING: DATABASE_URL not set")
	}
}
