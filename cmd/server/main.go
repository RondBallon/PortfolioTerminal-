package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"portfolio-terminal/internal/handlers"
	"strings"
)

func main() {
	cheminProjet, err := obtenirCheminProjet()
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Chemin racine du projet: %s", cheminProjet)
	log.Printf("Chemin des fichiers statiques: %s", filepath.Join(cheminProjet, "web/static"))
	log.Printf("Chemin du template: %s", filepath.Join(cheminProjet, "web/templates/index.html"))

	handlers.InitialiserHandlers(cheminProjet)
	configurerRoutes(cheminProjet)

	log.Println("Serveur démarré sur http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("Erreur serveur:", err)
	}
}

func obtenirCheminProjet() (string, error) {
	cheminActuel, err := os.Getwd()
	if err != nil {
		return "", err
	}

	if strings.HasSuffix(cheminActuel, "cmd/server") {
		cheminActuel = filepath.Join(cheminActuel, "..", "..")
	} else if strings.HasSuffix(cheminActuel, "cmd") {
		cheminActuel = filepath.Join(cheminActuel, "..")
	}

	return filepath.Abs(cheminActuel)
}

func configurerRoutes(cheminProjet string) {
	fichiersStatiques := http.FileServer(http.Dir(filepath.Join(cheminProjet, "web/static")))
	http.Handle("/static/", http.StripPrefix("/static/", fichiersStatiques))

	http.HandleFunc("/", handlers.GererPageAccueil)
	http.HandleFunc("/api/data", handlers.GererDonneesPortfolio)
}
