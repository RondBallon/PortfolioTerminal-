/**
 * Classe Terminal
 * Gère toute la logique du terminal interactif
 */
class Terminal {
    constructor() {
        // Éléments DOM principaux
        this.input = document.getElementById('terminal-input');
        this.output = document.getElementById('terminal-output');
        this.setupEventListeners();
        
        // Liste des commandes disponibles
        // Chaque commande est associée à une méthode
        this.commands = {
            'help': () => this.showHelp(),          // Affiche l'aide
            'whoiam': this.whoIAm.bind(this),       // Informations personnelles // j'ai du bind.
            'projets': () => this.showProjects(),   // Liste des projets
            'cv': () => this.showCV(),              // Ouvre le CV
            'github': () => this.openGithub(),      // Profil GitHub
            'clear': () => this.clear(),            // Efface l'écran
            'skills': () => this.showSkills(),      // Compétences
            'contact': () => this.showContact(),    // Coordonnées
            'theme': () => this.toggleTheme(),      // Change le thème
            'sudo': () => this.print("Ca donne envie hein ! 😄", 'error'),
            '42': () => this.show42Answer()         // Easter egg
        };

        // Configuration des thèmes de couleur
        this.themes = {
            dark: {
                background: '#1e1e1e',
                text: '#f0f0f0',
                prompt: '#00ff00'
            },
            light: {
                background: '#e9c46a',
                text: 'e76f51',
                prompt: '#008800'
            },
            warp: {
                background: 'linear-gradient(to right, #f0f0f0 0%, #f0f0f0 100%)',
                text: '#1e1e1e',
                prompt: '#008800'
            },
        };
        this.currentTheme = 'dark';

        // Initialisation de l'interface
        this.terminalWindow = document.querySelector('.terminal-window');
        this.cmdButton = document.querySelector('.cmd-button');
        this.setupWindowControls();
        this.printWelcome();  // Affiche le message de bienvenue

        // Historique des commandes
        this.commandHistory = [];
        this.historyIndex = -1;
    }

    /**
     * Gestion des événements
     * Principalement la saisie des commandes
     */
    setupEventListeners() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value.trim();
                this.executeCommand(command);
                this.input.value = '';
            }
        });

        // Écouter les événements de touches
        document.addEventListener('keydown', (event) => {
            // Vérifier si la touche pressée est la flèche haut
            if (event.key === 'ArrowUp') {
                // Si l'index de l'historique est supérieur à 0, afficher la commande précédente
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.input.value = this.commandHistory[this.historyIndex];
                }
            } 
            // Vérifier si la touche pressée est la flèche bas
            else if (event.key === 'ArrowDown') {
                // Si l'index de l'historique est inférieur au nombre total de commandes, afficher la commande suivante
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    this.input.value = this.commandHistory[this.historyIndex];
                }
            }
        });
    }

    /**
     * Affiche du texte dans le terminal
     * @param {string} texte - Texte à afficher
     * @param {string} classe - Classe CSS pour le style
     * @param {boolean} withTypingEffect - Active l'effet de frappe
     */
    async print(texte, classe = '', withTypingEffect = false) {
        const ligne = document.createElement('div');
        ligne.className = classe;
        
        if (!withTypingEffect) {
            ligne.innerHTML = texte;
            this.output.appendChild(ligne);
            this.output.scrollTop = this.output.scrollHeight;
            return;
        }

        // Effet de frappe caractère par caractère
        this.output.appendChild(ligne);
        const lignes = texte.split('\n');
        
        for (const texteLigne of lignes) {
            if (texteLigne.trim() === '') {
                await this.waitMs(100);
                ligne.innerHTML += '<br>';
                continue;
            }
            
            for (const caractere of texteLigne) {
                ligne.textContent += caractere;
                await this.waitMs(5);
            }
            ligne.innerHTML += '<br>';
            await this.waitMs(25);
        }

        this.output.scrollTop = this.output.scrollHeight;
    }

    waitMs(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async executeCommand(command) {
        await this.print(`visitor@portfolio:~$ ${command}`, 'command');
        
        if (this.commands[command]) {
            await this.commands[command]();
        } else {
            await this.print(`Commande non reconnue: ${command}. Tapez 'help' pour voir les commandes disponibles.`, 'error');
        }

        // Ajouter la commande à l'historique
        if (command) {
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length; // Réinitialiser l'index
        }
    }

    showHelp() {
        this.print(`Commandes disponibles :`, 'output');
        
        const commands = [
            ['whoiam', 'Affiche des informations sur moi 👀'],
            ['help', 'Affiche cette aide 👮..💬'],
            ['projets', 'Liste les projets ⚙️'],
            ['cv', 'Affiche le CV ✍️'],
            ['github', 'Ouvre le profil GitHub ♟️'],
            ['clear', 'Efface l\'écran ⏹'],
            ['skills', 'Affiche mes compétences techniques ⛏️'],
            ['contact', 'Affiche mes informations de contact 🕵️'],
            ['theme', 'Change le thème du terminal 🌖..🌘']
        ];

        commands.forEach(([cmd, desc]) => {
            this.print(`• ${cmd.padEnd(12)} - ${desc}`, 'output');
        });

        this.print(`\nEaster eggs :`, 'output');
        
        const eggs = [
            ['sudo', 'Tentative d\'élévation de privilèges ✅'],
            ['42', 'Si tu as du temps et du cerveau à perdre..🤨..🤯']
        ];

        eggs.forEach(([cmd, desc]) => {
            this.print(`• ${cmd.padEnd(12)} - ${desc}`, 'output');
        });
    }

    async showProjects() {
        try {
            const response = await fetch('/api/data');
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            
            await this.print("\n", "output");
            
            data.projects.forEach((project, index) => {
                this.print(`
• ${project.name}
  📝 Description: ${project.description}
  🛠️  Technologies: ${project.tech.join(", ")}
  🔗 URL: <a href="${project.url}" target="_blank" rel="noopener noreferrer">${project.url}</a>

`, "project-item");
            });
            
            if (data.projects.length === 0) {
                this.print("\nAucun projet disponible pour le moment.", "info");
            } else {
                this.print("\nTapez 'github' pour voir tous mes projets sur GitHub.", "info");
            }
            
        } catch (error) {
            this.print("⚠️ Erreur lors du chargement des projets: " + error.message, "error");
        }
    }

    clear() {
        this.output.innerHTML = ''; // Effacer le contenu
        this.showHelp(); // Afficher l'aide après avoir effacé l'écran !
    }

    showCV() {
        window.open('/static/ress/cv.pdf', '_blank');
    }

    whoIAm() {
        this.print(`
À propos de moi :

• Prénom       : Clément 
• Âge          : Surement trop vieux pour faire un portfolio terminal :)
• Localisation : France, Lyon 

Stack technique :
• Frontend     : JavaScript (Vue.js), HTML, CSS
• Backend      : GoLang, Node.js, Symfony
• Infra        : GitHub, Docker

Je suis un développeur passionné par la création et la résolution de problèmes,
avec un background unique en menuiserie et restauration qui m'apporte une 
perspective différente sur la conception et la réalisation de projets.
    `, 'output');
    }

    async openGithub() {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            window.open(data.github, '_blank');
        } catch (error) {
            this.print('Erreur lors de l\'ouverture du profil GitHub.', 'error');
        }
    }

    /**
     * Gestion des contrôles de la fenêtre (minimiser/fermer)
     */
    setupWindowControls() {
        const closeBtn = document.querySelector('.control.close');
        const minimizeBtn = document.querySelector('.control.minimize');
        
        closeBtn.addEventListener('click', () => {
            this.terminalWindow.classList.add('closing');
            setTimeout(() => {
                this.terminalWindow.style.display = 'none';
                this.terminalWindow.classList.remove('closing');
                this.showCmdButton();
            }, 280);
        });

        minimizeBtn.addEventListener('click', () => {
            this.terminalWindow.classList.add('minimizing');
            setTimeout(() => {
                this.terminalWindow.style.display = 'none';
                this.terminalWindow.classList.remove('minimizing');
                this.showCmdButton();
            }, 280);
        });

        this.cmdButton.addEventListener('click', () => {
            this.restoreTerminal();
        });
    }

    showCmdButton() {
        this.cmdButton.style.display = 'block';
        this.cmdButton.classList.add('opening');
    }

    restoreTerminal() {
        this.cmdButton.style.display = 'none';
        this.cmdButton.classList.remove('opening');
        this.terminalWindow.style.display = 'block';
        this.terminalWindow.classList.add('opening');
        
        setTimeout(() => {
            this.terminalWindow.classList.remove('opening');
        }, 280);

        document.getElementById('terminal-input').focus();
    }

    showSkills() {
        this.print(`
             ╔═══════════════════════════════════════════════════════════════════╗
             ║                    Compétences Techniques                         ║
             ╚═══════════════════════════════════════════════════════════════════╝

Frontend :
  • JavaScript  ★★★☆☆
  • HTML5/CSS3  ★★★☆☆
  • Vue.js      ★★★☆☆

Backend :
  • Go          ★★☆☆☆  (en apprentissage)
  • Node.js     ★★★☆☆
  • PHP/Symfony ★★★☆☆

Outils & Méthodes :
  • Git                ★★★☆☆
  • Docker             ★★☆☆☆  (en apprentissage)
  • Méthodologie Agile ★★★☆☆

Points forts :
  • Apprentissage rapide
  • Passionné par les nouvelles technologies
  • Bonne capacité d'adaptation
  • Travail en équipe

En cours d'apprentissage :
  • Architecture logicielle
  • Bonnes pratiques de développement
  • Tests unitaires
  • CI/CD
`, 'skills');
    }

    showContact() {
        this.print(`
📧 Email: clement.ferrandery@gmail.com
📱 LinkedIn: <a class ="a1" href="https://www.linkedin.com/in/clément-ferr/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/clément-ferr/</a>
🌐 Site Web: rdballon.com
    `, 'contact');
    }

    toggleTheme() {
        const themeNames = Object.keys(this.themes);
        const currentIndex = themeNames.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        this.currentTheme = themeNames[nextIndex];
        
        const theme = this.themes[this.currentTheme];
        document.body.style.background = theme.background;
        document.body.style.color = theme.text;
        document.querySelector('.prompt').style.color = theme.prompt;
        
        if (this.currentTheme === 'warp') {
            document.body.style.backgroundImage = 'linear-gradient(to top, rgba(128, 128, 128, 0.8) 0%, rgba(240, 240, 240, 0.8) 100%)';
            this.terminalWindow.style.backgroundImage = 'linear-gradient(to top, rgba(128, 128, 128, 0.8) 0%, rgba(240, 240, 240, 0.8) 100%)';
        } else {
            document.body.style.backgroundImage = '';
            this.terminalWindow.style.backgroundImage = '';
        }
        
        this.print(`Changement de thème vers: ${this.currentTheme}`, 'info');
    }

    printWelcome() {
        this.print(`
Bienvenue sur mon portfolio ! 👋 Je suis Clément, développeur web en reconversion professionnelle depuis début 2024. 💻

 Mon parcours est un peu atypique : j'ai été menuisier et j'ai travaillé dans la restauration. Ces expériences m'ont appris la précision, l'importance des détails et le travail d'équipe. 

J'aime particulièrement la phase de conception et la construction de solutions, que ce soit en bois ou en code. 🛠️ 
 
Cette passion pour la création et la résolution de problèmes m'a naturellement conduit vers le développement web. 🚀            

 Tapez 'help' pour découvrir les commandes disponibles. 📜`, 'welcome-message', true);
    }

    show42Answer() {
        this.print(`
"O Deep Thought computer," he said, "the task we have designed you to perform is this.
We want you to tell us...." he paused, "The Answer."

• "The Answer?" said Deep Thought. "The Answer to what?"

• "Life!" urged Fook.
• "The Universe!" said Lunkwill.
• "Everything!" they said in chorus.

Deep Thought paused for a moment's reflection.
"Tricky," he said finally.

• "But can you do it?"

Again, a significant pause.

• "Yes," said Deep Thought, "I can do it."
• "There is an answer?" said Fook with breathless excitement.
• "Yes," said Deep Thought. "Life, the Universe, and Everything. There is an answer. 
  But, I'll have to think about it."

...

Fook glanced impatiently at his watch.
• "How long?" he said.
• "Seven and a half million years," said Deep Thought.

Lunkwill and Fook blinked at each other.
• "Seven and a half million years...!" they cried in chorus.
• "Yes," declaimed Deep Thought, "I said I'd have to think about it, didn't I?"

[Seven and a half million years later.... 
 Fook and Lunkwill are long gone, but their descendents continue what they started]

• "We are the ones who will hear," said Phouchg, 
  "the answer to the great question of Life....!"
• "The Universe...!" said Loonquawl.
• "And Everything...!"

"Shhh," said Loonquawl with a slight gesture. 
"I think Deep Thought is preparing to speak!"

There was a moment's expectant pause while panels slowly came to life on the front of the console. 
Lights flashed on and off experimentally and settled down into a businesslike pattern. 
A soft low hum came from the communication channel.

• "Good Morning," said Deep Thought at last.
• "Er..good morning, O Deep Thought" said Loonquawl nervously, 
  "do you have...er, that is..."
• "An Answer for you?" interrupted Deep Thought majestically. 
  "Yes, I have."

The two men shivered with expectancy. Their waiting had not been in vain.

• "There really is one?" breathed Phouchg.
• "There really is one," confirmed Deep Thought.
• "To Everything? To the great Question of Life, the Universe and everything?"
• "Yes."

Both of the men had been trained for this moment, their lives had been a preparation for it,
they had been selected at birth as those who would witness the answer, but even so they
found themselves gasping and squirming like excited children.

• "And you're ready to give it to us?" urged Loonsuawl.
• "I am."
• "Now?"
• "Now," said Deep Thought.

They both licked their dry lips.

• "Though I don't think," added Deep Thought. "that you're going to like it."
• "Doesn't matter!" said Phouchg. "We must know it! Now!"
• "Now?" inquired Deep Thought.
• "Yes! Now..."

"All right," said the computer, and settled into silence again.
The two men fidgeted. The tension was unbearable.

• "You're really not going to like it," observed Deep Thought.
• "Tell us!"
• "All right," said Deep Thought. "The Answer to the Great Question..."
• "Yes..!"
• "Of Life, the Universe and Everything..." said Deep Thought.
• "Yes...!"
• "Is..." said Deep Thought, and paused.
• "Yes...!"
• "Is..."
• "Yes...!!!...?"

"Forty-two," said Deep Thought, with infinite majesty and calm.

― Douglas Adams, The Hitchhiker's Guide to the Galaxy`, 'special');
    }
}

// Initialisation du terminal
new Terminal();