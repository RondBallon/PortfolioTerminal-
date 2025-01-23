package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

// GererDonneesPortfolio gère les requêtes API pour les données du portfolio
func GererDonneesPortfolio(w http.ResponseWriter, r *http.Request) {
	// Configuration des headers CORS et type de contenu
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	// Gestion des requêtes OPTIONS (CORS preflight)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Vérification de la méthode HTTP
	if r.Method != "GET" {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	log.Printf("Chargement des données du portfolio pour %s", r.RemoteAddr)
	portfolio, err := servicePortfolio.ChargerDonneesPortfolio()
	if err != nil {
		log.Printf("Erreur de chargement des données: %v", err)
		http.Error(w, "Erreur lors du chargement des données", http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(portfolio); err != nil {
		log.Printf("Erreur d'encodage JSON: %v", err)
		http.Error(w, "Erreur lors de l'encodage JSON", http.StatusInternalServerError)
		return
	}

	log.Printf("Données du portfolio envoyées avec succès à %s", r.RemoteAddr)
}
