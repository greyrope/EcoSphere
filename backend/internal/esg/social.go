package esg

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/ecosphere/backend/internal/ws"
	"github.com/jackc/pgx/v5/pgxpool"
)

type API struct {
	DB  *pgxpool.Pool
	Hub *ws.Hub
}

type CSRSubmission struct {
	EmployeeID int    `json:"employee_id"`
	ActivityID int    `json:"activity_id"`
	ProofURL   string `json:"proof_url"`
}

func (api *API) HandleSubmitCSR(w http.ResponseWriter, r *http.Request) {
	// 1. Enforce POST method
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 2. Parse the JSON from your frontend team
	var payload CSRSubmission
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Bad Request: Invalid JSON", http.StatusBadRequest)
		return
	}

	// 3. Raw SQL Execution (ACID Compliant)
	query := `INSERT INTO employee_participation (employee_id, activity_id, proof_url, approval_status) 
	          VALUES ($1, $2, $3, 'Under Review') RETURNING id`

	var participationID int
	err := api.DB.QueryRow(context.Background(), query, payload.EmployeeID, payload.ActivityID, payload.ProofURL).Scan(&participationID)
	if err != nil {
		http.Error(w, "Database Failure", http.StatusInternalServerError)
		return
	}

	// 4. Trigger the Real-Time Broadcast
	api.Hub.BroadcastEvent("CSR_SUBMITTED", map[string]interface{}{
		"message":          "New CSR Activity Pending Review",
		"participation_id": participationID,
		"employee_id":      payload.EmployeeID,
	})

	// 5. Respond to the HTTP client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "CSR Activity logged and broadcasted."})
}
