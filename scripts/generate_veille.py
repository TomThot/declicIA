#!/usr/bin/env python3
"""
Veille IA dans l'Education - Générateur hebdomadaire
Collecte des flux RSS + synthèse via Google Gemini
"""

import os
import json
import requests
import feedparser
import sys
from datetime import datetime, timezone

# Ensure UTF-8 output to avoid Windows console encoding issues with emojis.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# ─────────────────────────────────────────────
# SOURCES RSS - IA & Education
# ─────────────────────────────────────────────
RSS_SOURCES = [
    {
        "name": "EdSurge",
        "url": "https://www.edsurge.com/feeds/news",
        "lang": "en"
    },
    {
        "name": "E-Learning Industry",
        "url": "https://elearningindustry.com/feed",
        "lang": "en"
    },
    {
        "name": "Educavox",
        "url": "https://www.educavox.fr/feed",
        "lang": "fr"
    },
    {
        "name": "The Hechinger Report",
        "url": "https://hechingerreport.org/feed/",
        "lang": "en"
    },
    {
        "name": "Times Higher Education",
        "url": "https://www.timeshighereducation.com/rss.xml",
        "lang": "en"
    },
    {
        "name": "Educpros (L'Etudiant)",
        "url": "https://www.letudiant.fr/educpros/rss.xml",
        "lang": "fr"
    },
    {
        "name": "MIT News - Education",
        "url": "https://news.mit.edu/rss/topic/education",
        "lang": "en"
    },
    {
        "name": "VentureBeat AI",
        "url": "https://venturebeat.com/category/ai/feed/",
        "lang": "en"
    },
]

KEYWORDS = [
    "artificial intelligence", "AI", "machine learning", "ChatGPT", "LLM",
    "intelligence artificielle", "apprentissage automatique",
    "education", "learning", "teaching", "classroom", "student", "teacher",
    "école", "enseignement", "apprentissage", "élève", "professeur", "pédagogie",
    "edtech", "e-learning", "elearning"
]


def fetch_rss_articles(max_per_source=5, relax_if_empty=True):
    """Collecte les articles récents depuis les flux RSS.

    Si aucun article ne correspond aux mots-cles pour une source, on peut
    assouplir le filtre et prendre les premiers articles.
    """
    articles = []

    for source in RSS_SOURCES:
        try:
            feed = feedparser.parse(source["url"])
            count = 0
            matched = []
            for entry in feed.entries:
                title = entry.get("title", "")
                summary = entry.get("summary", entry.get("description", ""))
                link = entry.get("link", "")

                # Filtrer par mots-clés
                text_to_check = (title + " " + summary).lower()
                if any(kw.lower() in text_to_check for kw in KEYWORDS):
                    matched.append({
                        "source": source["name"],
                        "title": title,
                        "summary": summary[:500],
                        "url": link,
                        "lang": source["lang"]
                    })

            # Assouplir le filtre si rien ne match
            if not matched and relax_if_empty:
                for entry in feed.entries[:max_per_source]:
                    title = entry.get("title", "")
                    summary = entry.get("summary", entry.get("description", ""))
                    link = entry.get("link", "")
                    matched.append({
                        "source": source["name"],
                        "title": title,
                        "summary": summary[:500],
                        "url": link,
                        "lang": source["lang"]
                    })

            for item in matched[:max_per_source]:
                articles.append(item)
                count += 1

            print(f"✅ {source['name']} : {count} articles collectés")
        except Exception as e:
            print(f"⚠️  {source['name']} : erreur - {e}")

    return articles


def generate_article_with_gemini(articles, api_key):
    """Envoie les articles à Gemini et récupère la synthèse."""

    articles_text = ""
    for i, a in enumerate(articles[:20], 1):  # Max 20 articles
        articles_text += f"\n{i}. [{a['source']}] {a['title']}\n   {a['summary']}\n   URL: {a['url']}\n"

    today = datetime.now(timezone.utc).strftime("%d %B %Y")

    prompt = f"""Tu es un expert en éducation et en intelligence artificielle. 
Tu dois rédiger un article de veille hebdomadaire en FRANÇAIS sur l'IA dans l'éducation.

Voici les articles collectés cette semaine :
{articles_text}

Rédige un article de veille structuré ainsi :
1. Un titre accrocheur pour la semaine
2. Une introduction courte (2-3 phrases)
3. Entre 3 et 5 "brèves" - chaque brève doit avoir :
   - Un titre court
   - Un résumé de 3-4 phrases maximum en français
   - La source et le lien original
4. Une conclusion/perspective en 2 phrases

Contraintes :
- Français uniquement
- Ton accessible, pas trop technique
- Format court (5 minutes de lecture maximum)
- Sélectionne uniquement les articles vraiment liés à l'IA ET à l'éducation

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown ni backticks, avec cette structure exacte :
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

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 2048
        }
    }

    response = requests.post(url, json=payload, timeout=60)
    response.raise_for_status()

    data = response.json()
    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]

    # Nettoyage du JSON si besoin
    raw_text = raw_text.strip()
    if raw_text.startswith("```"):
        raw_text = raw_text.split("```")[1]
        if raw_text.startswith("json"):
            raw_text = raw_text[4:]
    raw_text = raw_text.strip()

    return json.loads(raw_text)


def save_to_json(article_data, output_path="data/veille.json"):
    """Ajoute le nouvel article au fichier JSON existant."""

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Charger les articles existants
    existing = []
    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            existing = json.load(f)

    # Ajouter le nouvel article avec métadonnées
    new_entry = {
        "id": datetime.now(timezone.utc).strftime("%Y%m%d"),
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "date_affichage": datetime.now(timezone.utc).strftime("%d %B %Y"),
        **article_data
    }

    # Insérer en tête de liste (plus récent en premier)
    existing.insert(0, new_entry)

    # Garder seulement les 52 dernières semaines
    existing = existing[:52]

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"✅ Article sauvegardé dans {output_path}")
    return new_entry


def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("❌ GEMINI_API_KEY manquante dans les variables d'environnement")

    print("🔍 Collecte des articles RSS...")
    articles = fetch_rss_articles()
    print(f"📦 {len(articles)} articles collectés au total")

    if len(articles) < 3:
        raise ValueError("❌ Pas assez d'articles collectés pour générer une veille")

    print("🤖 Génération de l'article via Gemini...")
    article_data = generate_article_with_gemini(articles, api_key)

    print("💾 Sauvegarde dans data/veille.json...")
    entry = save_to_json(article_data)

    print(f"🎉 Veille générée avec succès : \"{entry['titre']}\"")


if __name__ == "__main__":
    main()
