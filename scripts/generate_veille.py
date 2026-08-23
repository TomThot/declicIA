"""
Veille IA dans l'Education - Générateur hebdomadaire
Collecte des flux RSS + synthèse via Mistral (mistral-small-latest)

Améliorations :
- Date affichée en français
- Sources RSS vérifiées et à jour
- Prompt recentré sur l'éducation scolaire (enseignants/élèves)

Le fichier fait 4 choses :
1. COLLECTER   → lit les flux RSS des 11 sources
2. FILTRER     → garde uniquement les articles liés à l'IA et l'éducation
3. GÉNÉRER     → envoie les articles à Mistral qui rédige la synthèse en JSON
4. SAUVEGARDER → insère l'article en tête de data/veille.json
"""

import os
import json
import re
import requests
import feedparser
import sys
from datetime import datetime, timezone

# UTF-8 output indispensable pour que le script ne plante pas avec les émojis
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# ─────────────────────────────────────────────
# SOURCES RSS - IA & Education
# ─────────────────────────────────────────────
RSS_SOURCES = [
    {"name": "EdSurge",                  "url": "https://www.edsurge.com/articles_rss",                                                         "lang": "en"},
    {"name": "E-Learning Industry",      "url": "https://elearningindustry.com/feed",                                                           "lang": "en"},
    {"name": "The Hechinger Report",     "url": "https://hechingerreport.org/feed/",                                                            "lang": "en"},
    {"name": "Educpros (L'Etudiant)",    "url": "https://www.letudiant.fr/educpros/rss.xml",                                                    "lang": "fr"},
    {"name": "MIT News - Education",     "url": "https://news.mit.edu/rss/topic/education",                                                     "lang": "en"},
    {"name": "VentureBeat AI",           "url": "https://venturebeat.com/category/ai/feed/",                                                    "lang": "en"},
    {"name": "Inside Higher Ed",         "url": "https://www.insidehighered.com/rss.xml",                                                       "lang": "en"},
    {"name": "Le Café Pédagogique",      "url": "https://www.cafepedagogique.net/feed/",                                                        "lang": "fr"},
    {"name": "eSchool News",             "url": "https://www.eschoolnews.com/feed/",                                                            "lang": "en"},
    {"name": "Educavox",                 "url": "https://www.educavox.fr/feed",                                                                 "lang": "fr"},
    {"name": "éduscol Veille numérique", "url": "https://eduscol.education.fr/186/veille-education-numerique?format=feed&type=rss",             "lang": "fr"},
]

KEYWORDS = [
    "artificial intelligence", "AI", "machine learning", "ChatGPT", "LLM",
    "intelligence artificielle", "apprentissage automatique",
    "education", "learning", "teaching", "classroom", "student", "teacher",
    "école", "enseignement", "apprentissage", "élève", "professeur", "pédagogie",
    "edtech", "e-learning", "elearning"
]


def fetch_rss_articles(max_per_source=5):
    articles = []
    for source in RSS_SOURCES:
        try:
            feed = feedparser.parse(source["url"])
            matched = []
            for entry in feed.entries:
                title   = entry.get("title", "")
                summary = entry.get("summary", entry.get("description", ""))
                link    = entry.get("link", "")
                if any(kw.lower() in (title + " " + summary).lower() for kw in KEYWORDS):
                    matched.append({
                        "source":  source["name"],
                        "title":   title,
                        "summary": summary[:900],
                        "url":     link,
                        "lang":    source["lang"]
                    })

            # Filet de sécurité : si aucun match, on prend les 5 premiers quand même
            if not matched:
                for entry in feed.entries[:max_per_source]:
                    matched.append({
                        "source":  source["name"],
                        "title":   entry.get("title", ""),
                        "summary": entry.get("summary", entry.get("description", ""))[:900],
                        "url":     entry.get("link", ""),
                        "lang":    source["lang"]
                    })

            for item in matched[:max_per_source]:
                articles.append(item)
            print(f"✅ {source['name']} : {min(len(matched), max_per_source)} articles")
        except Exception as e:
            print(f"⚠️  {source['name']} : erreur - {e}")
    return articles


def clean_json_response(raw: str) -> str:
    """Extrait proprement le JSON de la réponse du LLM."""
    # Cherche directement le premier { et le dernier } — ignore tout ce qui précède
    start = raw.find("{")
    end   = raw.rfind("}")
    if start != -1 and end != -1 and end > start:
        return raw[start:end + 1]
    # Fallback : nettoyage balises markdown
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return raw.strip()


def generate_article_with_mistral(articles, api_key):
    """Envoie les articles à Mistral (mistral-small-latest) et récupère la synthèse."""

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

    # Appel de l'API Mistral
    url = "https://api.mistral.ai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "mistral-small-latest",
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

    print("📡 Appel API Mistral (mistral-small-latest)...")
    response = requests.post(url, headers=headers, json=payload, timeout=60)

    if not response.ok:
        print(f"❌ Erreur API Mistral {response.status_code} : {response.text[:500]}")
        response.raise_for_status()

    data = response.json()
    raw_text = data["choices"][0]["message"]["content"]
    print(f"📥 Réponse brute Mistral ({len(raw_text)} chars)")

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

    MOIS_FR = ["", "janvier", "février", "mars", "avril", "mai", "juin",
               "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    now = datetime.now(timezone.utc)
    date_fr = f"{now.day} {MOIS_FR[now.month]} {now.year}"

    new_entry = {
        "id":             now.strftime("%Y%m%d"),
        "date":           now.strftime("%Y-%m-%d"),
        "date_affichage": date_fr,
        **article_data
    }

    existing.insert(0, new_entry)
    existing = existing[:52]

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"✅ Article sauvegardé dans {output_path}")
    return new_entry


def main():
    api_key = os.environ.get("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("❌ MISTRAL_API_KEY manquante dans les variables d'environnement")

    print("🔍 Collecte des articles RSS...")
    articles = fetch_rss_articles()
    print(f"📦 {len(articles)} articles collectés au total")

    if len(articles) < 3:
        raise ValueError("❌ Pas assez d'articles collectés pour générer une veille")

    print("🤖 Génération de l'article via Mistral...")
    article_data = generate_article_with_mistral(articles, api_key)

    print("💾 Sauvegarde dans data/veille.json...")
    entry = save_to_json(article_data)

    print(f"🎉 Veille générée avec succès : \"{entry['titre']}\"")


if __name__ == "__main__":
    main()