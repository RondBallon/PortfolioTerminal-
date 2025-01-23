// Package handlers gère toutes les requêtes HTTP du portfolio
package handlers

import (
	"log"
	"net/http"
	"path/filepath"
	"portfolio-terminal/internal/services"
	"time"
)

var (
	// cheminProjet stocke le chemin racine du projet
	cheminProjet string
	// servicePortfolio gère les opérations liées aux données du portfolio
	servicePortfolio *services.ServicePortfolio
	// timeout pour les requêtes
	timeout = 10 * time.Second
)

// InitialiserHandlers configure les gestionnaires de requêtes
// en initialisant les chemins et services nécessaires
func InitialiserHandlers(chemin string) {
	log.Printf("Initialisation des handlers avec le chemin: %s", chemin)
	cheminProjet = chemin

	// Initialisation du service portfolio
	servicePortfolio = services.NouveauServicePortfolio(
		filepath.Join(chemin, "web/static/data/portfolio.json"),
	)
}

// ConfigurerTimeouts définit les timeouts pour les requêtes
func ConfigurerTimeouts(srv *http.Server) {
	srv.ReadTimeout = timeout
	srv.WriteTimeout = timeout
	srv.IdleTimeout = timeout
}
