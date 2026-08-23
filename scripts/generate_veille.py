"""
Veille IA dans l'Education - Générateur hebdomadaire
Collecte des flux RSS + synthèse via Groq (LLaMA 3.3 70B - gratuit)

Améliorations :
- Date affichée en français
- Sources RSS vérifiées et à jour
- Prompt recentré sur l'éducation scolaire (enseignants/élèves)

Le fichier fait 4 choses : 
1. COLLECTER   → lit les flux RSS des 9 sources
2. FILTRER     → garde uniquement les articles liés à l'IA et l'éducation
3. GÉNÉRER     → envoie les articles à Groq qui rédige la synthèse en JSON
4. SAUVEGARDER → insère l'article en tête de data/veille.json
"""

import os           #lit la variable d'environnement API_KEY
import json 
import re           # permet de nétoyer la réponse JSON
import requests     # fait l'appel HTTP vers l'API
import feedparser   # Lit le flux RSS des sources
import sys
import locale
from datetime import datetime, timezone

# UTF-8 output indispensable pour que le script ne plante pas avec les émojis
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# ─────────────────────────────────────────────
# SOURCES RSS - IA & Education
# ─────────────────────────────────────────────
# C'est simplement une liste de dictionnaires. Chaque source a 3 clés : son nom (pour l'affichage dans les logs), son URL de flux RSS, et sa langue.
RSS_SOURCES = [
    # ✅ URLs vérifiées et fonctionnelles
    {"name": "EdSurge",              "url": "https://www.edsurge.com/articles_rss",             "lang": "en"},
    {"name": "E-Learning Industry",  "url": "https://elearningindustry.com/feed",               "lang": "en"},
    {"name": "The Hechinger Report", "url": "https://hechingerreport.org/feed/",                "lang": "en"},
    {"name": "Educpros (L'Etudiant)","url": "https://www.letudiant.fr/educpros/rss.xml",        "lang": "fr"},
    {"name": "MIT News - Education", "url": "https://news.mit.edu/rss/topic/education",         "lang": "en"},
    {"name": "VentureBeat AI",       "url": "https://venturebeat.com/category/ai/feed/",        "lang": "en"},
    # Nouvelles sources en remplacement des sources cassées
    {"name": "Inside Higher Ed",     "url": "https://www.insidehighered.com/rss.xml",           "lang": "en"},
    {"name": "Le Café Pédagogique",  "url": "https://www.cafepedagogique.net/feed/",            "lang": "fr"},
    {"name": "eSchool News",         "url": "https://www.eschoolnews.com/feed/",                "lang": "en"},
    # Sources françaises ajoutées pour rééquilibrer vers le contexte scolaire français
    {"name": "Educavox",             "url": "https://www.educavox.fr/feed",                     "lang": "fr"},
    {"name": "éduscol Veille numérique", "url": "https://eduscol.education.fr/186/veille-education-numerique?format=feed&type=rss", "lang": "fr"},
]
# La liste de mots-clés qui sert de filtre
KEYWORDS = [
    "artificial intelligence", "AI", "machine learning", "ChatGPT", "LLM",
    "intelligence artificielle", "apprentissage automatique",
    "education", "learning", "teaching", "classroom", "student", "teacher",
    "école", "enseignement", "apprentissage", "élève", "professeur", "pédagogie",
    "edtech", "e-learning", "elearning"
]

# C'est la fonction de collecte. Elle boucle sur chaque source
def fetch_rss_articles(max_per_source=5):
    articles = []
    for source in RSS_SOURCES:
        try:
            feed = feedparser.parse(source["url"]) # télécharge et analyse le flux RSS automatiquement
            matched = []
            for entry in feed.entries:
                title   = entry.get("title", "")
                summary = entry.get("summary", entry.get("description", ""))
                link    = entry.get("link", "")
                if any(kw.lower() in (title + " " + summary).lower() for kw in KEYWORDS): #Pour chaque article, on concatène titre + résumé et on vérifie si un mot-clé apparaît dedans. Si oui, l'article est gardé.
                    matched.append({"source": source["name"], "title": title,
                                    "summary": summary[:900], "url": link, "lang": source["lang"]})

            # Assouplir si aucun match
            # Filet de sécurité : si aucun article de cette source ne passe le filtre (source généraliste ce jour-là), 
            # on prend quand même les 5 premiers articles plutôt que de passer à côté de la source entièrement.
            if not matched:
                for entry in feed.entries[:max_per_source]:
                    matched.append({
                        "source": source["name"],
                        "title": entry.get("title", ""),
                        "summary": entry.get("summary", entry.get("description", ""))[:900],
                        "url": entry.get("link", ""),
                        "lang": source["lang"]
                    })

            for item in matched[:max_per_source]:
                articles.append(item)
            print(f"✅ {source['name']} : {min(len(matched), max_per_source)} articles")
        except Exception as e:
            print(f"⚠️  {source['name']} : erreur - {e}")
    return articles

# Les LLM ont tendance à entourer leur réponse JSON de balises markdown (```json ... ```) malgré les instructions. 
# Cette fonction les supprime proprement, puis extrait le premier bloc {...} trouvé même si du texte traîne avant 
# ou après.
def clean_json_response(raw: str) -> str:
    """Extrait proprement le JSON de la réponse du LLM."""
    # Cherche directement le premier { et le dernier } — ignore tout ce qui précède
    start = raw.find("{")
    end   = raw.rfind("}")
    if start != -1 and end != -1 and end > start:
        return raw[start:end + 1]
    # Fallback : nettoyage classique markdown
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return raw.strip()

# On formate les 20 premiers articles collectés en texte numéroté, avec source, titre, résumé et URL. 
# C'est ce texte qui est envoyé au LLM.
def generate_article_with_groq(articles, api_key):
    """Envoie les articles à Groq (LLaMA 3.3 70B) et récupère la synthèse."""

    articles_text = ""
    for i, a in enumerate(articles[:20], 1):
        articles_text += f"\n{i}. [{a['source']}] {a['title']}\n   {a['summary']}\n   URL: {a['url']}\n"

    prompt = f"""Tu es un expert en intelligence artificielle appliquée à l'éducation scolaire et universitaire.
Tu dois rédiger un article de veille hebdomadaire en FRANÇAIS, destiné aux enseignants du primaire, secondaire et supérieur.

Voici les articles collectés cette semaine :
{articles_text}

Rédige un article de veille structuré ainsi :
1. Un titre accrocheur pour la semaine
2. Une introduction (5-6 phrases) qui contextualise les enjeux de l'IA pour les enseignants
3. Entre 3 et 5 "brèves" avec titre, résumé (7-9 phrases en français), source et lien
4. Une conclusion/perspective en 4-5 phrases orientée pratiques pédagogiques

Contraintes :
- Français uniquement, ton accessible pour des enseignants non spécialistes de l'IA
- Format 900-1200 mots
- Privilégie les articles sur : outils IA pour la classe, impacts sur les élèves, politiques éducatives, formation des enseignants
- Écarte les articles purement technologiques ou business sans lien avec la salle de classe
- Inclus systématiquement au moins une brève issue d'une source française (Le Café Pédagogique, Educavox, éduscol, Letudiant/Educpros)
- Inclus si possible au moins un outil concret ou une ressource directement utilisable en classe

IMPORTANT : réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte avant ou après.
Structure exacte :
{{
  "titre": "...",
  "introduction": "...",
  "breves": [
    {{
      "titre": "...",
      "contenu": "...",
      "source": "...",
      "url": "..."
    }}
  ],
  "conclusion": "..."
}}"""
# appel de l'api
    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "qwen/qwen3.6-27b",
        "messages": [
            {
                "role": "system",
                "content": "Tu es un expert en IA et éducation. Tu réponds toujours en JSON valide uniquement, sans markdown ni backticks."
            },
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 4096
    }

    print("📡 Appel API Groq (qwen/qwen3.6-27b)...")
    response = requests.post(url, headers=headers, json=payload, timeout=60)

    if not response.ok:
        print(f"❌ Erreur API Groq {response.status_code} : {response.text[:500]}")
        response.raise_for_status()

    data = response.json()
    raw_text = data["choices"][0]["message"]["content"]
    print(f"📥 Réponse brute Groq ({len(raw_text)} chars)")

    cleaned = clean_json_response(raw_text)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"❌ Échec parsing JSON : {e}")
        print(f"--- Texte nettoyé ---\n{cleaned[:800]}\n---")
        raise


def save_to_json(article_data, output_path="data/veille.json"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    existing = []
    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            existing = json.load(f)

    # Date en français construite manuellement car strftime("%B") retourne le mois en anglais sur le runner GitHub 
    MOIS_FR = ["", "janvier", "février", "mars", "avril", "mai", "juin",
               "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    now = datetime.now(timezone.utc)
    date_fr = f"{now.day} {MOIS_FR[now.month]} {now.year}"

    new_entry = {
        "id": now.strftime("%Y%m%d"),
        "date": now.strftime("%Y-%m-%d"),
        "date_affichage": date_fr,
        **article_data
    }

    existing.insert(0, new_entry) # Le nouvel article est inséré en tête du tableau, 
    existing = existing[:52] # et on tronque à 52 entrées pour ne pas faire grossir le fichier indéfiniment.

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"✅ Article sauvegardé dans {output_path}")
    return new_entry


def main():
    # La clé API est lue depuis les variables d'environnement 
    # jamais écrite en dur dans le code. GitHub Actions l'injecte automatiquement depuis les Secrets.
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("❌ GROQ_API_KEY manquante dans les variables d'environnement")

    print("🔍 Collecte des articles RSS...")
    articles = fetch_rss_articles()
    print(f"📦 {len(articles)} articles collectés au total")

    if len(articles) < 3: # garde fou si les sources sont en panne on stop plutôt que d'envoyer un prompt vide.
        raise ValueError("❌ Pas assez d'articles collectés pour générer une veille")

    print("🤖 Génération de l'article via Groq...")
    article_data = generate_article_with_groq(articles, api_key)

    print("💾 Sauvegarde dans data/veille.json...")
    entry = save_to_json(article_data)

    print(f"🎉 Veille générée avec succès : \"{entry['titre']}\"")


if __name__ == "__main__":
    main()
