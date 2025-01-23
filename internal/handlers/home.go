package handlers

import (
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

// GererPageAccueil affiche la page principale du portfolio
// C'est la première page que les visiteurs voient
func GererPageAccueil(w http.ResponseWriter, r *http.Request) {
	log.Printf("Gestion de la requête d'accueil depuis %s", r.RemoteAddr)
	cheminTemplate := filepath.Join(cheminProjet, "web/templates/index.html")
	log.Printf("Chargement du template depuis: %s", cheminTemplate)

	tmpl := template.Must(template.ParseFiles(cheminTemplate))
	if err := tmpl.Execute(w, nil); err != nil {
		log.Printf("Erreur d'exécution du template: %v", err)
		http.Error(w, "Erreur lors du rendu de la page", http.StatusInternalServerError)
		return
	}
	log.Println("Template rendu avec succès")
}
