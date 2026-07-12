package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ecosphere/backend/internal/middleware"
	"github.com/ecosphere/backend/pkg/database"
)

type AuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	FullName string `json:"full_name,omitempty"`
}

type AuthResponse struct {
	User  *database.User `json:"user,omitempty"`
	Token string         `json:"token,omitempty"`
	Error string         `json:"error,omitempty"`
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	user, token, err := database.CreateUser(req.Email, req.Password, req.FullName)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(AuthResponse{Error: err.Error()})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(AuthResponse{User: user, Token: token})
}

func SignIn(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	user, token, err := database.AuthenticateUser(req.Email, req.Password)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(AuthResponse{Error: err.Error()})
		return
	}

	json.NewEncoder(w).Encode(AuthResponse{User: user, Token: token})
}

func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	user, err := database.GetProfile(userID)
	if err != nil {
		http.Error(w, `{"error":"user not found"}`, http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, `{"error":"user_id is required"}`, http.StatusBadRequest)
		return
	}

	profile, err := database.GetProfile(userID)
	if err != nil {
		http.Error(w, `{"error":"profile not found"}`, http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(profile)
}
