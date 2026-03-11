#!/usr/bin/env python3
"""
Veille IA dans l'Education - Générateur hebdomadaire
Collecte des flux RSS + synthèse via Google Gemini
"""

import os
import json
import re
import requests
import feedparser
import sys
from datetime import datetime, timezone

# UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# ─────────────────────────────────────────────
# SOURCES RSS - IA & Education
# ─────────────────────────────────────────────
RSS_SOURCES = [
    {"name": "EdSurge",                "url": "https://www.edsurge.com/feeds/news",               "lang": "en"},
    {"name": "E-Learning Industry",    "url": "https://elearningindustry.com/feed",                "lang": "en"},
    {"name": "Educavox",               "url": "https://www.educavox.fr/feed",                      "lang": "fr"},
    {"name": "The Hechinger Report",   "url": "https://hechingerreport.org/feed/",                 "lang": "en"},
    {"name": "Times Higher Education", "url": "https://www.timeshighereducation.com/rss.xml",      "lang": "en"},
    {"name": "Educpros (L'Etudiant)",  "url": "https://www.letudiant.fr/educpros/rss.xml",         "lang": "fr"},
    {"name": "MIT News - Education",   "url": "https://news.mit.edu/rss/topic/education",          "lang": "en"},
    {"name": "VentureBeat AI",         "url": "https://venturebeat.com/category/ai/feed/",         "lang": "en"},
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
                    matched.append({"source": source["name"], "title": title,
                                    "summary": summary[:500], "url": link, "lang": source["lang"]})

            # Assouplir si aucun match
            if not matched:
                for entry in feed.entries[:max_per_source]:
                    matched.append({
                        "source": source["name"],
                        "title": entry.get("title", ""),
                        "summary": entry.get("summary", entry.get("description", ""))[:500],
                        "url": entry.get("link", ""),
                        "lang": source["lang"]
                    })

            for item in matched[:max_per_source]:
                articles.append(item)
            print(f"✅ {source['name']} : {min(len(matched), max_per_source)} articles")
        except Exception as e:
            print(f"⚠️  {source['name']} : erreur - {e}")
    return articles


def clean_json_response(raw: str) -> str:
    """Nettoie robustement la réponse Gemini pour extraire le JSON."""
    raw = raw.strip()
    # Supprimer les blocs ```json ... ``` ou ``` ... ```
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    raw = raw.strip()
    # Extraire le premier objet JSON {} si du texte traîne avant/après
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        return match.group(0)
    return raw


def generate_article_with_gemini(articles, api_key):
    articles_text = ""
    for i, a in enumerate(articles[:20], 1):
        articles_text += f"\n{i}. [{a['source']}] {a['title']}\n   {a['summary']}\n   URL: {a['url']}\n"

    prompt = f"""Tu es un expert en éducation et en intelligence artificielle.
Tu dois rédiger un article de veille hebdomadaire en FRANÇAIS sur l'IA dans l'éducation.

Voici les articles collectés cette semaine :
{articles_text}

Rédige un article de veille structuré ainsi :
1. Un titre accrocheur pour la semaine
2. Une introduction courte (2-3 phrases)
3. Entre 3 et 5 "brèves" avec titre, résumé (3-4 phrases), source et lien
4. Une conclusion/perspective en 2 phrases

Contraintes : français uniquement, ton accessible, format court (5 min de lecture).

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

    # Modèle actuel — gemini-2.0-flash (gemini-2.0-flash est déprécié)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2048}
    }

    print("📡 Appel API Gemini (gemini-2.0-flash)...")
    response = requests.post(url, json=payload, timeout=60)

    if not response.ok:
        print(f"❌ Erreur API Gemini {response.status_code} : {response.text[:500]}")
        response.raise_for_status()

    data = response.json()
    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
    print(f"📥 Réponse brute Gemini ({len(raw_text)} chars)")

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

    new_entry = {
        "id": datetime.now(timezone.utc).strftime("%Y%m%d"),
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "date_affichage": datetime.now(timezone.utc).strftime("%d %B %Y"),
        **article_data
    }

    existing.insert(0, new_entry)
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