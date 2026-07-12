package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/ecosphere/backend/pkg/database"
)

func GetOrganization(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("org_id")
	if orgID == "" {
		http.Error(w, `{"error":"org_id is required"}`, http.StatusBadRequest)
		return
	}

	org, err := database.GetOrganization(orgID)
	if err != nil {
		http.Error(w, `{"error":"organization not found"}`, http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(org)
}

func GetEnvironmentalMetrics(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("org_id")
	startDate := r.URL.Query().Get("start_date")
	endDate := r.URL.Query().Get("end_date")

	if orgID == "" {
		http.Error(w, `{"error":"org_id is required"}`, http.StatusBadRequest)
		return
	}

	metrics, err := database.GetEnvironmentalMetrics(orgID, startDate, endDate)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(metrics)
}

func GetSocialMetrics(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("org_id")
	startDate := r.URL.Query().Get("start_date")
	endDate := r.URL.Query().Get("end_date")

	if orgID == "" {
		http.Error(w, `{"error":"org_id is required"}`, http.StatusBadRequest)
		return
	}

	metrics, err := database.GetSocialMetrics(orgID, startDate, endDate)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(metrics)
}

func GetGovernanceMetrics(w http.ResponseWriter, r *http.Request) {
	orgID := r.URL.Query().Get("org_id")
	startDate := r.URL.Query().Get("start_date")
	endDate := r.URL.Query().Get("end_date")

	if orgID == "" {
		http.Error(w, `{"error":"org_id is required"}`, http.StatusBadRequest)
		return
	}

	metrics, err := database.GetGovernanceMetrics(orgID, startDate, endDate)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(metrics)
}
