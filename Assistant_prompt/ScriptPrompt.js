
 
 
 
 
 
 // Current active method
        let currentMethod = 'actif';

        // Toggle method switch
        document.getElementById('methodSwitch').addEventListener('change', function() {
            if (this.checked) {
                // Switch to CAFé
                currentMethod = 'cafe';
                document.getElementById('actifMethod').classList.add('hidden');
                document.getElementById('cafeMethod').classList.remove('hidden');
                document.getElementById('logoText').textContent = 'CAFÉ';
                document.getElementById('subtitleText').textContent = 'Modèle CAFÉ - Générateur de prompts pour l\'éducation';
                document.getElementById('outputTitle').textContent = 'Votre prompt CAFÉ';
                document.getElementById('actifLabel').classList.remove('active');
                document.getElementById('cafeLabel').classList.add('active');
                document.getElementById('outputSection').classList.add('hidden');
            } else {
                // Switch to ACTIF
                currentMethod = 'actif';
                document.getElementById('actifMethod').classList.remove('hidden');
                document.getElementById('cafeMethod').classList.add('hidden');
                document.getElementById('logoText').textContent = 'ACTIF';
                document.getElementById('subtitleText').textContent = 'Modèle ACTIF - Générateur de prompts pour l\'éducation';
                document.getElementById('outputTitle').textContent = 'Votre prompt ACTIF';
                document.getElementById('actifLabel').classList.add('active');
                document.getElementById('cafeLabel').classList.remove('active');
                document.getElementById('outputSection').classList.add('hidden');
            }
        });

        // Templates prédéfinis ACTIF
        const templates = {
            quiz: {
                identity: 'Tu es un professeur de sciences',
                context: 'Pour des élèves de collège',
                action: 'Crée un quiz de 10 questions à choix multiples sur [THÈME]. Inclus les réponses correctes et des explications courtes pour chaque réponse',
                tone: 'Sur un ton enthousiaste et passionné',
                format: 'Sous forme de liste ordonnée avec les réponses à la fin'
            },
            correction: {
                identity: 'Tu es un professeur de français',
                context: 'Pour des élèves de lycée',
                action: 'Corrige ce texte et propose des améliorations constructives. Identifie les points forts et les axes d\'amélioration',
                tone: 'Sur un ton empathique',
                format: 'Sous forme de commentaire détaillé avec : 1) Points positifs, 2) Corrections nécessaires, 3) Conseils d\'amélioration'
            },
            exercice: {
                identity: 'Tu es un professeur de mathématiques',
                context: 'Pour des élèves de collège',
                action: 'Crée 3 versions d\'exercices sur [THÈME] avec des niveaux de difficulté croissants : facile, moyen, difficile. Chaque exercice doit avoir 5 questions',
                tone: 'Sur un ton sérieux',
                format: 'Sous forme de tableau avec colonnes : Niveau | Exercice | Solution'
            },
            ludique: {
                identity: 'Tu es un professeur d\'histoire',
                context: 'Pour des élèves de primaire',
                action: 'Propose une activité ludique et interactive pour faire découvrir [THÈME]. Inclus les règles du jeu, le matériel nécessaire et le déroulement',
                tone: 'Sur un ton enthousiaste et passionné',
                format: 'Sous forme de guide étape par étape avec sections : Objectif | Matériel | Règles | Déroulement'
            },
            evaluation: {
                identity: 'Tu es un professeur',
                context: 'Pour des élèves de lycée',
                action: 'Crée une grille d\'évaluation détaillée pour [TYPE D\'EXERCICE]. Inclus les critères d\'évaluation, les niveaux de maîtrise et le barème de notation',
                tone: 'Sur un ton académique',
                format: 'Sous forme de tableau avec critères, descripteurs et points'
            },
            debat: {
                identity: 'Tu es un professeur de philosophie',
                context: 'Pour des élèves de lycée',
                action: 'Prépare un débat en classe sur [THÈME]. Fournis 5 arguments pour et 5 arguments contre, avec des questions de relance',
                tone: 'Sur un ton académique',
                format: 'Sous forme de deux colonnes : Arguments POUR | Arguments CONTRE, puis Questions de débat'
            },
            resume: {
                identity: 'Tu es un professeur',
                context: 'Pour des élèves de collège',
                action: 'Crée une fiche de révision synthétique sur [CHAPITRE]. Inclus : définitions clés, dates importantes, concepts essentiels, et schémas à retenir',
                tone: 'Sur un ton sérieux',
                format: 'Sous forme de fiche structurée avec sections claires et points essentiels'
            },
            projet: {
                identity: 'Tu es un professeur de technologie',
                context: 'Pour des élèves de lycée',
                action: 'Conçois un projet de groupe sur [THÈME]. Définis les objectifs, les étapes, les rôles de chacun, le calendrier et les critères d\'évaluation',
                tone: 'Sur un ton enthousiaste et passionné',
                format: 'Sous forme de cahier des charges avec : Objectifs | Équipes | Planning | Livrables | Évaluation'
            }
        };

        // Templates prédéfinis CAFé
        const cafeTemplates = {
            planCours: {
                context: 'Tu es enseignant de [MATIÈRE] pour des élèves de [NIVEAU]. Tu prépares une séquence sur [THÈME].',
                action: 'Crée un plan de cours détaillé avec objectifs pédagogiques, activités et évaluation.',
                format: 'Sous forme de document structuré en sections : Objectifs | Déroulement (3 phases) | Matériel | Évaluation. Environ 800 mots.',
                exchange: 'Peux-tu préciser les activités différenciées pour les élèves en difficulté ?'
            },
            synthese: {
                context: 'Tu es un expert en analyse de textes. Tu dois résumer un document de [TYPE] sur [THÈME].',
                action: 'Synthétise les idées principales et les arguments clés du texte.',
                format: 'En 300 mots maximum, sous forme de paragraphes avec titres. Style académique.',
                exchange: 'Peux-tu ajouter les citations les plus importantes du texte original ?'
            },
            explications: {
                context: 'Tu es un vulgarisateur scientifique qui s\'adresse à [PUBLIC CIBLE]. Le concept à expliquer est [CONCEPT].',
                action: 'Explique ce concept de manière claire et accessible avec des exemples concrets.',
                format: 'En 500 mots, avec introduction, développement en 3 points, et conclusion. Utilise des analogies.',
                exchange: 'Peux-tu vérifier l\'exactitude scientifique et citer tes sources ?'
            },
            comparaison: {
                context: 'Tu es un analyste comparatif dans le domaine de [DOMAINE]. Tu compares [ÉLÉMENT A] et [ÉLÉMENT B].',
                action: 'Compare ces deux éléments en identifiant points communs, différences et implications.',
                format: 'Sous forme de tableau comparatif puis analyse en 400 mots. Format markdown.',
                exchange: 'Propose des critères de comparaison supplémentaires que j\'aurais pu oublier.'
            },
            problematique: {
                context: 'Tu es chercheur en [DISCIPLINE] travaillant sur [SUJET LARGE].',
                action: 'Formule 5 problématiques de recherche pertinentes et justifie leur intérêt.',
                format: 'Liste numérotée avec pour chaque problématique : question, enjeux, méthodologie suggérée. 600 mots total.',
                exchange: 'Quelles sont les limites de chaque problématique proposée ?'
            },
            sources: {
                context: 'Tu es documentaliste spécialisé en [DOMAINE]. Recherche sur [THÈME].',
                action: 'Propose une bibliographie commentée de 10 sources fiables (livres, articles, sites).',
                format: 'Pour chaque source : référence complète, résumé en 2-3 phrases, pertinence. Format APA.',
                exchange: 'Peux-tu vérifier la fiabilité de ces sources et proposer des alternatives si nécessaire ?'
            },
            adaptation: {
                context: 'Tu es enseignant adaptant un contenu de [NIVEAU ACTUEL] vers [NIVEAU CIBLE].',
                action: 'Réécris ce texte/exercice en l\'adaptant au nouveau niveau tout en conservant les objectifs.',
                format: 'Texte adapté + tableau des modifications (vocabulaire, structures, exemples). 500 mots.',
                exchange: 'Le niveau de difficulté est-il approprié ? Propose des ajustements.'
            },
            verification: {
                context: 'Tu es expert en fact-checking dans le domaine de [DOMAINE].',
                action: 'Vérifie l\'exactitude des informations suivantes et corrige les erreurs.',
                format: 'Pour chaque affirmation : Vrai/Faux/Partiellement vrai, explication, sources. Liste à puces.',
                exchange: 'Peux-tu fournir des sources académiques pour valider ces corrections ?'
            }
        };

        function loadCafeTemplate(templateName) {
            const template = cafeTemplates[templateName];
            if (!template) return;

            // Remplir les champs CAFé
            document.getElementById('cafe_context').value = template.context;
            document.getElementById('cafe_action').value = template.action;
            document.getElementById('cafe_format').value = template.format;
            document.getElementById('cafe_exchange').value = template.exchange;

            // Scroll vers le formulaire
            document.getElementById('cafeForm').scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Afficher une notification
            showNotification('✅ Template CAFÉ chargé ! Personnalisez-le selon vos besoins.');
        }

        function loadTemplate(templateName) {
            const template = templates[templateName];
            if (!template) return;

            // Remplir les champs
            document.getElementById('identity').value = template.identity;
            document.getElementById('context').value = template.context;
            document.getElementById('action').value = template.action;
            document.getElementById('tone').value = template.tone;
            document.getElementById('format').value = template.format;

            // Activer les boutons correspondants
            activateMatchingButtons();

            // Scroll vers le formulaire
            document.getElementById('actifForm').scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Afficher une notification
            showNotification('✅ Template chargé ! Personnalisez-le selon vos besoins.');
        }

        function showNotification(message) {
            // Créer une notification temporaire
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        function activateMatchingButtons() {
            // Désactiver tous les boutons d'abord
            document.querySelectorAll('.preset-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Activer les boutons correspondants aux valeurs
            const identity = document.getElementById('identity').value.toLowerCase();
            const context = document.getElementById('context').value.toLowerCase();
            const tone = document.getElementById('tone').value.toLowerCase();
            const format = document.getElementById('format').value.toLowerCase();

            document.querySelectorAll('.preset-btn').forEach(btn => {
                const value = btn.getAttribute('data-value').toLowerCase();
                if (identity.includes(value) || context.includes(value) || 
                    tone.includes(value) || format.includes(value)) {
                    btn.classList.add('active');
                }
            });
        }

        // Gestion des boutons préréglés
        function setupPresetButtons(containerId, textareaId) {
            const container = document.getElementById(containerId);
            const textarea = document.getElementById(textareaId);
            const buttons = container.querySelectorAll('.preset-btn');

            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    // Retirer la classe active de tous les boutons du groupe
                    buttons.forEach(btn => btn.classList.remove('active'));
                    
                    // Ajouter la classe active au bouton cliqué
                    this.classList.add('active');
                    
                    // Mettre à jour la valeur du textarea
                    const currentValue = textarea.value.trim();
                    const buttonValue = this.getAttribute('data-value');
                    
                    // Si le textarea est vide ou contient une valeur prédéfinie, remplacer
                    if (!currentValue || isPresetValue(currentValue, containerId)) {
                        textarea.value = getFormattedValue(textareaId, buttonValue);
                    } else {
                        // Sinon, ajouter à la suite
                        textarea.value = currentValue + ', ' + buttonValue;
                    }
                });
            });
        }

        function isPresetValue(value, containerId) {
            const container = document.getElementById(containerId);
            const buttons = container.querySelectorAll('.preset-btn');
            const lowerValue = value.toLowerCase();
            
            for (let button of buttons) {
                if (lowerValue.includes(button.getAttribute('data-value').toLowerCase())) {
                    return true;
                }
            }
            return false;
        }

        function getFormattedValue(textareaId, value) {
            const prefixes = {
                'identity': 'Tu es un ',
                'context': 'Pour des ',
                'tone': 'Sur un ton ',
                'format': 'Sous forme de '
            };
            
            const prefix = prefixes[textareaId] || '';
            return prefix + value;
        }

        // Initialiser les boutons préréglés
        setupPresetButtons('identityButtons', 'identity');
        setupPresetButtons('contextButtons', 'context');
        setupPresetButtons('toneButtons', 'tone');
        setupPresetButtons('formatButtons', 'format');

        // Gestion de la soumission du formulaire ACTIF
        document.getElementById('actifForm').addEventListener('submit', function(e) {
            e.preventDefault();
            generatePrompt();
        });

        // Gestion de la soumission du formulaire CAFé
        document.getElementById('cafeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            generateCafePrompt();
        });

        function generatePrompt() {
            const identity = document.getElementById('identity').value.trim();
            const context = document.getElementById('context').value.trim();
            const action = document.getElementById('action').value.trim();
            const tone = document.getElementById('tone').value.trim();
            const format = document.getElementById('format').value.trim();

            if (!identity || !action) {
                alert('Veuillez remplir au minimum les champs Identité et Action (marqués par *)');
                return;
            }

            let prompt = '';

            // Construire le prompt
            if (identity) {
                prompt += identity + '.\n\n';
            }

            if (context) {
                prompt += context + '.\n\n';
            }

            prompt += action + '.';

            if (tone) {
                prompt += '\n\n' + tone + '.';
            }

            if (format) {
                prompt += '\n\n' + format + '.';
            }

            // Afficher le résultat
            document.getElementById('promptOutput').textContent = prompt;
            document.getElementById('outputSection').classList.remove('hidden');

            // Scroll vers le résultat
            document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function generateCafePrompt() {
            const context = document.getElementById('cafe_context').value.trim();
            const action = document.getElementById('cafe_action').value.trim();
            const format = document.getElementById('cafe_format').value.trim();
            const exchange = document.getElementById('cafe_exchange').value.trim();

            if (!context || !action || !format) {
                alert('Veuillez remplir au minimum les champs Contexte, Action et Format (marqués par *)');
                return;
            }

            let prompt = '';

            // Construire le prompt CAFé
            prompt += '**Contexte :**\n' + context + '\n\n';
            prompt += '**Action :**\n' + action + '\n\n';
            prompt += '**Format :**\n' + format;

            if (exchange) {
                prompt += '\n\n**Échange :**\n' + exchange;
            }

            // Afficher le résultat
            document.getElementById('promptOutput').textContent = prompt;
            document.getElementById('outputSection').classList.remove('hidden');

            // Scroll vers le résultat
            document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function copyPrompt() {
            const promptText = document.getElementById('promptOutput').textContent;
            const copyBtn = event.target;

            navigator.clipboard.writeText(promptText).then(function() {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓ Copié !';
                copyBtn.classList.add('copied');

                setTimeout(function() {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                alert('Erreur lors de la copie : ' + err);
            });
        }

        function resetForm() {
            if (confirm('Voulez-vous vraiment effacer tous les champs ?')) {
                if (currentMethod === 'actif') {
                    document.getElementById('actifForm').reset();
                } else {
                    document.getElementById('cafeForm').reset();
                }
                document.getElementById('outputSection').classList.add('hidden');
                
                // Retirer toutes les classes active des boutons
                document.querySelectorAll('.preset-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
            }
        }