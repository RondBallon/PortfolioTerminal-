Documentation de main.go

1. Déclarations des packages importés 

import (
	"encoding/json"
	"html/template"
	"net/http"
)

encoding/json : 
Ce package est utilisé pour encoder et décoder des données en JSON. 
Il permet de convertir des structures Go en format JSON et vice-versa.

html/template : 
Ce package permet de gérer les templates HTML dans Go. Il aide à séparer la logique 
de l'application de l'affichage (le front-end).

net/http :
Ce package est essentiel pour la création d'un serveur web en Go. Il fournit 
des outils pour gérer les requêtes HTTP et les réponses, ainsi que pour configurer un serveur HTTP.

2. Déclaration des structures de données

Structure Project :
type Project struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	URL         string   `json:"url"`
	Tech        []string `json:"tech"`
}

Cette structure définit un projet dans le portfolio. Chaque projet a :
- Name : Le nom du projet.
- Description : Une brève description du projet.
- URL : L'URL vers le projet (par exemple, un lien vers un dépôt GitHub).
- Tech : Une liste de technologies utilisées dans le projet (sous forme de tableau de chaînes de caractères/et ou icônes ?)

Les balises json:"nom_du_champ" indiquent comment cette structure sera encodée en JSON 
(par exemple, le champ Name sera transformé en "name" dans le JSON).

type Portfolio struct {
	Projects []Project
	Github   string
	CV       string
}

Cette structure représente un portfolio qui contient :
- Projects : Un tableau de projets (Project), représentant tous les projets du portfolio.
- Github : Un lien vers le profil GitHub de la personne (par exemple, un lien vers son compte GitHub).
- CV : Un lien vers le CV de la personne (probablement un fichier PDF dans le dossier static).

3. Fonction main

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", handleHome)
	http.HandleFunc("/api/data", handleData)

	println("Serveur démarré sur http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

- http.FileServer : 
Cette fonction crée un gestionnaire de fichiers statiques. 
Elle permet de servir des fichiers comme des images, des CSS ou des fichiers JavaScript situés dans 
un dossier donné (static dans ce cas).

- http.Handle : 
Cette fonction lie un chemin d'URL à un gestionnaire de fichiers ou une fonction spécifique. Dans ce cas :
/static/ est lié à un gestionnaire de fichiers statiques.

- http.StripPrefix("/static/", fs) : 
Supprime le préfixe /static/ des URL demandées et les redirige vers le dossier static où les fichiers sont stockés.

- http.HandleFunc("/", handleHome) : 
Cette ligne lie la route racine (/) au gestionnaire handleHome, qui sert la page d'accueil.

- http.HandleFunc("/api/data", handleData) : 
Cette ligne lie la route /api/data au gestionnaire handleData, qui renvoie des données JSON.

- println : 
Affiche un message de confirmation dans la console indiquant que le serveur a démarré.

- http.ListenAndServe(":8080", nil) : 
Lance le serveur web sur le port 8080. Il écoute toutes les requêtes entrantes et 
les traite selon les gestionnaires définis.

4. Gestionnaire de la page d'accueil (handleHome)

func handleHome(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("templates/index.html"))
	tmpl.Execute(w, nil)
}


- template.Must : 
Cette fonction est utilisée pour vérifier si le fichier template index.html est bien chargé. 
Si le fichier est invalide ou absent, le programme panique (termine brutalement).

- template.ParseFiles("templates/index.html") : 
Cette fonction charge le fichier index.html situé dans le dossier templates. 
Ce fichier contient probablement le code HTML qui sera envoyé comme réponse.

- tmpl.Execute(w, nil) : 
Cette méthode exécute le template et écrit le résultat dans la réponse HTTP (w), sans passer de données supplémentaires (d'où le nil).


5. Gestionnaire pour la route /api/data (handleData)

func handleData(w http.ResponseWriter, r *http.Request) {
	portfolio := Portfolio{
		Projects: []Project{
			{
				Name:        "Projet 1",
				Description: "Description du projet 1",
				URL:         "https://github.com/user/projet1",
				Tech:        []string{"Go", "JavaScript"},
			},
		},
		Github: "https://github.com/RondBallon",
		CV:     "/static/cv.pdf",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(portfolio)
}


- Création de l'objet Portfolio : 
Un objet de type Portfolio est créé avec des informations fictives sur un projet et des liens vers un profil GitHub et un CV.

- w.Header().Set("Content-Type", "application/json") : 
Cette ligne définit l'en-tête HTTP de la réponse, spécifiant que le contenu de la réponse est au format JSON.

- json.NewEncoder(w).Encode(portfolio) : 
Cette ligne convertit l'objet portfolio en JSON et l'envoie dans la réponse HTTP.


                                    // En résumé : // 

- Le serveur Go créé dans ce fichier sert des fichiers statiques (comme des images ou un CV PDF) à partir du dossier static.

- Il rend également une page HTML (probablement une page d'accueil) à la route /.

- À la route /api/data, il renvoie des données sous forme de JSON concernant un portfolio avec des projets et des liens.

- Le serveur écoute sur le port 8080 et gère les requêtes HTTP.