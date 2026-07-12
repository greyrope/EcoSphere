package database

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5/pgtype"
)

var tokenStore sync.Map

type User struct {
	ID             string         `json:"id"`
	FullName       string         `json:"full_name"`
	AvatarURL      *string        `json:"avatar_url"`
	OrganizationID *string        `json:"organization_id"`
	Role           string         `json:"role"`
	XP             int            `json:"xp"`
	Level          int            `json:"level"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
}

type Organization struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Industry    *string   `json:"industry"`
	Description *string   `json:"description"`
	LogoURL     *string   `json:"logo_url"`
	CreatedAt   time.Time `json:"created_at"`
}

type EnvironmentalMetric struct {
	ID                  string    `json:"id"`
	OrganizationID      string    `json:"organization_id"`
	ReportedBy          *string   `json:"reported_by"`
	PeriodStart         string    `json:"period_start"`
	PeriodEnd           string    `json:"period_end"`
	CarbonEmissionsTons float64   `json:"carbon_emissions_tons"`
	EnergyConsumptionKwh float64  `json:"energy_consumption_kwh"`
	RenewableEnergyPct  float64   `json:"renewable_energy_pct"`
	WaterUsageLiters    float64   `json:"water_usage_liters"`
	WasteGeneratedKg    float64   `json:"waste_generated_kg"`
	WasteRecycledKg     float64   `json:"waste_recycled_kg"`
	Notes               *string   `json:"notes"`
	CreatedAt           time.Time `json:"created_at"`
}

type SocialMetric struct {
	ID                    string    `json:"id"`
	OrganizationID        string    `json:"organization_id"`
	ReportedBy            *string   `json:"reported_by"`
	PeriodStart           string    `json:"period_start"`
	PeriodEnd             string    `json:"period_end"`
	EmployeeCount         int       `json:"employee_count"`
	EmployeeSatisfactionPct float64 `json:"employee_satisfaction_pct"`
	DiversityPct          float64   `json:"diversity_pct"`
	TrainingHours         float64   `json:"training_hours"`
	VolunteerHours        float64   `json:"volunteer_hours"`
	CommunityInvestment   float64   `json:"community_investment"`
	SafetyIncidents       int       `json:"safety_incidents"`
	Notes                 *string   `json:"notes"`
	CreatedAt             time.Time `json:"created_at"`
}

type GovernanceMetric struct {
	ID                     string    `json:"id"`
	OrganizationID         string    `json:"organization_id"`
	ReportedBy             *string   `json:"reported_by"`
	PeriodStart            string    `json:"period_start"`
	PeriodEnd              string    `json:"period_end"`
	BoardIndependencePct   float64   `json:"board_independence_pct"`
	BoardDiversityPct      float64   `json:"board_diversity_pct"`
	EthicsTrainingPct      float64   `json:"ethics_training_pct"`
	DataBreaches           int       `json:"data_breaches"`
	ComplianceViolations   int       `json:"compliance_violations"`
	AuditCompleted         bool      `json:"audit_completed"`
	Notes                  *string   `json:"notes"`
	CreatedAt              time.Time `json:"created_at"`
}

type Policy struct {
	ID             string         `json:"id"`
	OrganizationID string         `json:"organization_id"`
	Title          string         `json:"title"`
	Description    *string        `json:"description"`
	Category       string         `json:"category"`
	Status         string         `json:"status"`
	ApprovedBy     *string        `json:"approved_by"`
	ApprovedAt     *pgtype.Timestamptz `json:"approved_at"`
	CreatedBy      *string        `json:"created_by"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
}

type Badge struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Description *string `json:"description"`
	IconURL   *string   `json:"icon_url"`
	XPReward  int       `json:"xp_reward"`
	Category  string    `json:"category"`
	Tier      string    `json:"tier"`
	CreatedAt time.Time `json:"created_at"`
}

type UserBadge struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	BadgeID   string    `json:"badge_id"`
	Badge     Badge     `json:"badge"`
	EarnedAt  time.Time `json:"earned_at"`
}

type Reward struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	XPCost      int       `json:"xp_cost"`
	Stock       int       `json:"stock"`
	ImageURL    *string   `json:"image_url"`
	CreatedAt   time.Time `json:"created_at"`
}

type Notification struct {
	ID        string          `json:"id"`
	UserID    string          `json:"user_id"`
	Title     string          `json:"title"`
	Message   *string         `json:"message"`
	Type      string          `json:"type"`
	Read      bool            `json:"read"`
	Data      json.RawMessage `json:"data"`
	CreatedAt time.Time       `json:"created_at"`
}

type RedemptionResult struct {
	Success     bool   `json:"success"`
	RedemptionID string `json:"redemption_id,omitempty"`
	Error       string `json:"error,omitempty"`
}

// ============================================
// Auth Functions
// ============================================

func hashPassword(password string) string {
	h := sha256.Sum256([]byte(password))
	return hex.EncodeToString(h[:])
}

func CreateUser(email, password, fullName string) (*User, string, error) {
	ctx := context.Background()
	id := pgtype.UUID{}
	_ = id.Scan([]byte(""))

	var user User
	err := DB.QueryRow(ctx,
		`INSERT INTO profiles (full_name, role, xp, level)
		 VALUES ($1, 'member', 0, 1)
		 RETURNING id, full_name, avatar_url, organization_id, role, xp, level, created_at, updated_at`,
		fullName,
	).Scan(&user.ID, &user.FullName, &user.AvatarURL, &user.OrganizationID,
		&user.Role, &user.XP, &user.Level, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, "", fmt.Errorf("failed to create user: %w", err)
	}

	token := hashPassword(email + password + time.Now().String())
	tokenStore.Store(token, user.ID)

	return &user, token, nil
}

func AuthenticateUser(email, password string) (*User, string, error) {
	ctx := context.Background()

	var user User
	err := DB.QueryRow(ctx,
		`SELECT id, full_name, avatar_url, organization_id, role, xp, level, created_at, updated_at
		 FROM profiles LIMIT 1`,
	).Scan(&user.ID, &user.FullName, &user.AvatarURL, &user.OrganizationID,
		&user.Role, &user.XP, &user.Level, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, "", fmt.Errorf("authentication failed: %w", err)
	}

	token := hashPassword(email + password + time.Now().String())
	tokenStore.Store(token, user.ID)
	return &user, token, nil
}

func GetUserByToken(token string) (string, error) {
	if userID, ok := tokenStore.Load(token); ok {
		return userID.(string), nil
	}
	return "", fmt.Errorf("token validation not implemented")
}

// ============================================
// Profile Functions
// ============================================

func GetProfile(userID string) (*User, error) {
	ctx := context.Background()

	var user User
	err := DB.QueryRow(ctx,
		`SELECT id, full_name, avatar_url, organization_id, role, xp, level, created_at, updated_at
		 FROM profiles WHERE id = $1`, userID,
	).Scan(&user.ID, &user.FullName, &user.AvatarURL, &user.OrganizationID,
		&user.Role, &user.XP, &user.Level, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("profile not found: %w", err)
	}

	return &user, nil
}

// ============================================
// Organization Functions
// ============================================

func GetOrganization(orgID string) (*Organization, error) {
	ctx := context.Background()

	var org Organization
	err := DB.QueryRow(ctx,
		`SELECT id, name, industry, description, logo_url, created_at
		 FROM organizations WHERE id = $1`, orgID,
	).Scan(&org.ID, &org.Name, &org.Industry, &org.Description, &org.LogoURL, &org.CreatedAt)

	if err != nil {
		return nil, fmt.Errorf("organization not found: %w", err)
	}

	return &org, nil
}

// ============================================
// Metrics Functions
// ============================================

func GetEnvironmentalMetrics(orgID, startDate, endDate string) ([]EnvironmentalMetric, error) {
	ctx := context.Background()
	query := `SELECT id, organization_id, reported_by, period_start, period_end,
		carbon_emissions_tons, energy_consumption_kwh, renewable_energy_pct,
		water_usage_liters, waste_generated_kg, waste_recycled_kg, notes, created_at
		FROM environmental_metrics WHERE organization_id = $1`
	args := []interface{}{orgID}
	argIdx := 2

	if startDate != "" {
		query += fmt.Sprintf(" AND period_start >= $%d", argIdx)
		args = append(args, startDate)
		argIdx++
	}
	if endDate != "" {
		query += fmt.Sprintf(" AND period_end <= $%d", argIdx)
		args = append(args, endDate)
		argIdx++
	}

	query += " ORDER BY period_start DESC"

	rows, err := DB.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var metrics []EnvironmentalMetric
	for rows.Next() {
		var m EnvironmentalMetric
		if err := rows.Scan(&m.ID, &m.OrganizationID, &m.ReportedBy, &m.PeriodStart, &m.PeriodEnd,
			&m.CarbonEmissionsTons, &m.EnergyConsumptionKwh, &m.RenewableEnergyPct,
			&m.WaterUsageLiters, &m.WasteGeneratedKg, &m.WasteRecycledKg, &m.Notes, &m.CreatedAt); err != nil {
			return nil, err
		}
		metrics = append(metrics, m)
	}

	return metrics, nil
}

func GetSocialMetrics(orgID, startDate, endDate string) ([]SocialMetric, error) {
	ctx := context.Background()
	query := `SELECT id, organization_id, reported_by, period_start, period_end,
		employee_count, employee_satisfaction_pct, diversity_pct, training_hours,
		volunteer_hours, community_investment, safety_incidents, notes, created_at
		FROM social_metrics WHERE organization_id = $1`
	args := []interface{}{orgID}
	argIdx := 2

	if startDate != "" {
		query += fmt.Sprintf(" AND period_start >= $%d", argIdx)
		args = append(args, startDate)
		argIdx++
	}
	if endDate != "" {
		query += fmt.Sprintf(" AND period_end <= $%d", argIdx)
		args = append(args, endDate)
		argIdx++
	}

	query += " ORDER BY period_start DESC"

	rows, err := DB.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var metrics []SocialMetric
	for rows.Next() {
		var m SocialMetric
		if err := rows.Scan(&m.ID, &m.OrganizationID, &m.ReportedBy, &m.PeriodStart, &m.PeriodEnd,
			&m.EmployeeCount, &m.EmployeeSatisfactionPct, &m.DiversityPct, &m.TrainingHours,
			&m.VolunteerHours, &m.CommunityInvestment, &m.SafetyIncidents, &m.Notes, &m.CreatedAt); err != nil {
			return nil, err
		}
		metrics = append(metrics, m)
	}

	return metrics, nil
}

func GetGovernanceMetrics(orgID, startDate, endDate string) ([]GovernanceMetric, error) {
	ctx := context.Background()
	query := `SELECT id, organization_id, reported_by, period_start, period_end,
		board_independence_pct, board_diversity_pct, ethics_training_pct,
		data_breaches, compliance_violations, audit_completed, notes, created_at
		FROM governance_metrics WHERE organization_id = $1`
	args := []interface{}{orgID}
	argIdx := 2

	if startDate != "" {
		query += fmt.Sprintf(" AND period_start >= $%d", argIdx)
		args = append(args, startDate)
		argIdx++
	}
	if endDate != "" {
		query += fmt.Sprintf(" AND period_end <= $%d", argIdx)
		args = append(args, endDate)
		argIdx++
	}

	query += " ORDER BY period_start DESC"

	rows, err := DB.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var metrics []GovernanceMetric
	for rows.Next() {
		var m GovernanceMetric
		if err := rows.Scan(&m.ID, &m.OrganizationID, &m.ReportedBy, &m.PeriodStart, &m.PeriodEnd,
			&m.BoardIndependencePct, &m.BoardDiversityPct, &m.EthicsTrainingPct,
			&m.DataBreaches, &m.ComplianceViolations, &m.AuditCompleted, &m.Notes, &m.CreatedAt); err != nil {
			return nil, err
		}
		metrics = append(metrics, m)
	}

	return metrics, nil
}

// ============================================
// Policies Functions
// ============================================

func GetPolicies(orgID, category string) ([]Policy, error) {
	ctx := context.Background()
	query := `SELECT id, organization_id, title, description, category, status,
		approved_by, approved_at, created_by, created_at, updated_at
		FROM policies WHERE organization_id = $1`
	args := []interface{}{orgID}

	if category != "" {
		query += " AND category = $2"
		args = append(args, category)
	}

	query += " ORDER BY created_at DESC"

	rows, err := DB.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var policies []Policy
	for rows.Next() {
		var p Policy
		if err := rows.Scan(&p.ID, &p.OrganizationID, &p.Title, &p.Description, &p.Category,
			&p.Status, &p.ApprovedBy, &p.ApprovedAt, &p.CreatedBy, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		policies = append(policies, p)
	}

	return policies, nil
}

func CreatePolicy(policy Policy) (*Policy, error) {
	ctx := context.Background()

	var created Policy
	err := DB.QueryRow(ctx,
		`INSERT INTO policies (organization_id, title, description, category, status, created_by)
		 VALUES ($1, $2, $3, $4, 'draft', $5)
		 RETURNING id, organization_id, title, description, category, status, approved_by, approved_at, created_by, created_at, updated_at`,
		policy.OrganizationID, policy.Title, policy.Description, policy.Category, policy.CreatedBy,
	).Scan(&created.ID, &created.OrganizationID, &created.Title, &created.Description, &created.Category,
		&created.Status, &created.ApprovedBy, &created.ApprovedAt, &created.CreatedBy, &created.CreatedAt, &created.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create policy: %w", err)
	}

	return &created, nil
}

// ============================================
// Gamification Functions
// ============================================

func GetBadges() ([]Badge, error) {
	ctx := context.Background()

	rows, err := DB.Query(ctx,
		`SELECT id, name, description, icon_url, xp_reward, category, tier, created_at
		 FROM badges ORDER BY xp_reward DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var badges []Badge
	for rows.Next() {
		var b Badge
		if err := rows.Scan(&b.ID, &b.Name, &b.Description, &b.IconURL, &b.XPReward,
			&b.Category, &b.Tier, &b.CreatedAt); err != nil {
			return nil, err
		}
		badges = append(badges, b)
	}

	return badges, nil
}

func GetUserBadges(userID string) ([]UserBadge, error) {
	ctx := context.Background()

	rows, err := DB.Query(ctx,
		`SELECT ub.id, ub.user_id, ub.badge_id, ub.earned_at,
			b.id, b.name, b.description, b.icon_url, b.xp_reward, b.category, b.tier, b.created_at
		 FROM user_badges ub
		 JOIN badges b ON b.id = ub.badge_id
		 WHERE ub.user_id = $1
		 ORDER BY ub.earned_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var userBadges []UserBadge
	for rows.Next() {
		var ub UserBadge
		if err := rows.Scan(&ub.ID, &ub.UserID, &ub.BadgeID, &ub.EarnedAt,
			&ub.Badge.ID, &ub.Badge.Name, &ub.Badge.Description, &ub.Badge.IconURL,
			&ub.Badge.XPReward, &ub.Badge.Category, &ub.Badge.Tier, &ub.Badge.CreatedAt); err != nil {
			return nil, err
		}
		userBadges = append(userBadges, ub)
	}

	return userBadges, nil
}

func GetRewards() ([]Reward, error) {
	ctx := context.Background()

	rows, err := DB.Query(ctx,
		`SELECT id, name, description, xp_cost, stock, image_url, created_at
		 FROM rewards ORDER BY xp_cost ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rewards []Reward
	for rows.Next() {
		var r Reward
		if err := rows.Scan(&r.ID, &r.Name, &r.Description, &r.XPCost, &r.Stock,
			&r.ImageURL, &r.CreatedAt); err != nil {
			return nil, err
		}
		rewards = append(rewards, r)
	}

	return rewards, nil
}

func RedeemReward(userID, rewardID string) (*RedemptionResult, error) {
	ctx := context.Background()

	var result RedemptionResult
	err := DB.QueryRow(ctx,
		`SELECT redeem_reward($1, $2)`, userID, rewardID,
	).Scan(&result)

	if err != nil {
		return nil, fmt.Errorf("redemption failed: %w", err)
	}

	return &result, nil
}

// ============================================
// Notification Functions
// ============================================

func GetNotifications(userID string) ([]Notification, error) {
	ctx := context.Background()

	rows, err := DB.Query(ctx,
		`SELECT id, user_id, title, message, type, read, data, created_at
		 FROM notifications WHERE user_id = $1
		 ORDER BY created_at DESC LIMIT 50`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []Notification
	for rows.Next() {
		var n Notification
		if err := rows.Scan(&n.ID, &n.UserID, &n.Title, &n.Message, &n.Type,
			&n.Read, &n.Data, &n.CreatedAt); err != nil {
			return nil, err
		}
		notifications = append(notifications, n)
	}

	return notifications, nil
}

func MarkNotificationRead(notificationID, userID string) error {
	ctx := context.Background()

	_, err := DB.Exec(ctx,
		`UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2`,
		notificationID, userID)
	return err
}

// ============================================
// WebSocket Hub for Real-Time Notifications
// ============================================

type Client struct {
	conn   *websocket.Conn
	userID string
}

var clients = make(map[string][]*websocket.Conn)

func RegisterWebSocket(userID string, conn *websocket.Conn) {
	clients[userID] = append(clients[userID], conn)
}

func UnregisterWebSocket(userID string, conn *websocket.Conn) {
	conns := clients[userID]
	for i, c := range conns {
		if c == conn {
			clients[userID] = append(conns[:i], conns[i+1:]...)
			break
		}
	}
}

func BroadcastNotification(userID string, notification Notification) {
	conns := clients[userID]
	for _, conn := range conns {
		conn.WriteJSON(notification)
	}
}

func StartNotificationListener() {
	ctx := context.Background()

	_, err := DB.Exec(ctx, `LISTEN notifications_channel`)
	if err != nil {
		return
	}

	for {
		time.Sleep(1 * time.Second)
	}
}
