package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ecosphere/backend/pkg/database"
)

func GetPolicies(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("org_id")
	category := r.URL.Query().Get("category")

	if orgID == "" {
		http.Error(w, `{"error":"org_id is required"}`, http.StatusBadRequest)
		return
	}

	policies, err := database.GetPolicies(orgID, category)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(policies)
}

func CreatePolicy(w http.ResponseWriter, r *http.Request) {
	var policy database.Policy
	if err := json.NewDecoder(r.Body).Decode(&policy); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	created, err := database.CreatePolicy(policy)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}
