package services

import (
	"encoding/json"
	"log"
	"os"
	"portfolio-terminal/internal/models"
)

// ServicePortfolio gère le chargement et la manipulation des données du portfolio
type ServicePortfolio struct {
	cheminDonnees string // Chemin vers le fichier JSON des données
}

// NouveauServicePortfolio crée une nouvelle instance du service
func NouveauServicePortfolio(cheminDonnees string) *ServicePortfolio {
	return &ServicePortfolio{
		cheminDonnees: cheminDonnees,
	}
}

// ChargerDonneesPortfolio lit le fichier JSON et retourne les données du portfolio
func (s *ServicePortfolio) ChargerDonneesPortfolio() (*models.Portfolio, error) {
	log.Printf("Chargement des données depuis: %s", s.cheminDonnees)

	// Lecture du fichier JSON
	fichier, err := os.ReadFile(s.cheminDonnees)
	if err != nil {
		log.Printf("Erreur de lecture: %v", err)
		return nil, err
	}

	// Conversion du JSON en structure Go
	var portfolio models.Portfolio
	if err := json.Unmarshal(fichier, &portfolio); err != nil {
		log.Printf("Erreur de parsing JSON: %v", err)
		return nil, err
	}

	log.Println("Données chargées avec succès")
	return &portfolio, nil
}
