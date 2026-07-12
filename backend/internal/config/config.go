package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                string
	DatabaseURL         string
	SupabaseURL         string
	SupabaseAnonKey     string
	SupabaseServiceKey  string
	CORSOrigin          string
}

func Load() *Config {
	godotenv.Load()

	return &Config{
		Port:               getEnv("PORT", "8080"),
		DatabaseURL:        os.Getenv("DATABASE_URL"),
		SupabaseURL:        os.Getenv("VITE_SUPABASE_URL"),
		SupabaseAnonKey:    os.Getenv("VITE_SUPABASE_ANON_KEY"),
		SupabaseServiceKey: os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
		CORSOrigin:         getEnv("CORS_ORIGIN", "http://localhost:5173"),
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
