package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ecosphere/backend/internal/middleware"
	"github.com/ecosphere/backend/pkg/database"
)

func GetBadges(w http.ResponseWriter, r *http.Request) {
	badges, err := database.GetBadges()
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(badges)
}

func GetUserBadges(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, `{"error":"user_id is required"}`, http.StatusBadRequest)
		return
	}

	badges, err := database.GetUserBadges(userID)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(badges)
}

func GetRewards(w http.ResponseWriter, r *http.Request) {
	rewards, err := database.GetRewards()
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(rewards)
}

func RedeemReward(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	var req struct {
		RewardID string `json:"reward_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	result, err := database.RedeemReward(userID, req.RewardID)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}
