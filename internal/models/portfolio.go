// Package models définit les structures de données du portfolio
package models

// Project représente un projet dans le portfolio
type Project struct {
	Name        string   `json:"name"`        // Nom du projet
	Description string   `json:"description"` // Description du projet
	URL         string   `json:"url"`         // Lien vers le projet
	Tech        []string `json:"tech"`        // Technologies utilisées
}

// Portfolio contient toutes les données du portfolio
type Portfolio struct {
	Projects []Project `json:"projects"` // Liste des projets
	Github   string    `json:"github"`   // Lien GitHub
	CV       string    `json:"cv"`       // Lien vers le CV
}
