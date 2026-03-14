"""
Générateur automatique de sitemap.xml pour DéclicIA
- Parcourt tous les fichiers .html publics du dépôt
- Récupère la date du dernier commit git pour chaque fichier
- Exclut les dossiers non publics (Assistant_prompt, doc/)
- Génère sitemap.xml à la racine

Priorités appliquées :
- 1.0  : page d'accueil
- 0.8  : pages principales (LIA, Cadre, Carousel)
- 0.7  : générateur de cadre
- 0.6  : outils, sous-pages, veille
- 0.4  : contact, ressources téléchargeables
"""

import os
import subprocess
from datetime import datetime, timezone
from urllib.parse import quote

BASE_URL = "https://declicia.pages.dev"

# Dossiers à exclure du sitemap
EXCLUDE_DIRS = {"Assistant_prompt", "doc", ".github"}

# Fichiers à exclure
EXCLUDE_FILES = {"404.html"}

# Priorités par chemin (correspondance partielle)
PRIORITIES = {
    "index.html":                    ("1.0", "weekly"),
    "LIA_cest_quoi":                 ("0.8", "monthly"),
    "Cadre_et_d":                    ("0.8", "monthly"),
    "Generateur_cadre":              ("0.7", "monthly"),
    "Carousel_outilsIA/Carousel":    ("0.8", "monthly"),
    "Carousel_outilsIA":             ("0.6", "monthly"),
    "veille-ia":                     ("0.6", "weekly"),
    "subPages":                      ("0.6", "monthly"),
    "Contact":                       ("0.4", "yearly"),
}

def get_last_commit_date(filepath):
    """Récupère la date ISO du dernier commit git pour un fichier."""
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%ai", "--", filepath],
            capture_output=True, text=True
        )
        date_str = result.stdout.strip()
        if date_str:
            return date_str[:10]  # Garde uniquement YYYY-MM-DD
    except Exception:
        pass
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")

def get_priority(filepath):
    """Retourne (priority, changefreq) selon le chemin du fichier."""
    for pattern, values in PRIORITIES.items():
        if pattern in filepath:
            return values
    return ("0.5", "monthly")

def file_to_url(filepath):
    """Convertit un chemin de fichier en URL encodée."""
    # Chemin relatif depuis la racine du dépôt
    rel = os.path.relpath(filepath, start=os.getcwd())
    # Encodage URL des caractères spéciaux (accents, espaces)
    encoded = quote(rel, safe="/")
    # Page d'accueil → URL propre sans nom de fichier
    if encoded == "index.html":
        return BASE_URL + "/"
    return BASE_URL + "/" + encoded

def collect_html_files():
    """Parcourt le dépôt et retourne tous les fichiers HTML publics."""
    html_files = []
    for root, dirs, files in os.walk("."):
        # Exclure les dossiers non publics (modification en place pour os.walk)
        dirs[:] = [
            d for d in dirs
            if d not in EXCLUDE_DIRS and not d.startswith(".")
        ]
        for filename in files:
            if filename.endswith(".html") and filename not in EXCLUDE_FILES:
                filepath = os.path.join(root, filename)
                # Normaliser le chemin (supprimer le ./ initial)
                filepath = filepath.lstrip("./")
                html_files.append(filepath)
    return sorted(html_files)

def collect_pdf_files():
    """Retourne les PDF du dossier doc/ (ressources téléchargeables)."""
    pdf_files = []
    doc_dir = "doc"
    if os.path.isdir(doc_dir):
        for filename in os.listdir(doc_dir):
            if filename.endswith(".pdf"):
                pdf_files.append(os.path.join(doc_dir, filename))
    return sorted(pdf_files)

def generate_sitemap():
    html_files = collect_html_files()
    pdf_files = collect_pdf_files()
    all_files = html_files + pdf_files

    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    for filepath in all_files:
        url = file_to_url(filepath)
        lastmod = get_last_commit_date(filepath)
        if filepath.endswith(".pdf"):
            priority, changefreq = "0.4", "yearly"
        else:
            priority, changefreq = get_priority(filepath)

        lines.append("")
        lines.append("  <url>")
        lines.append(f"    <loc>{url}</loc>")
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
        lines.append(f"    <priority>{priority}</priority>")
        lines.append(f"    <changefreq>{changefreq}</changefreq>")
        lines.append("  </url>")

    lines.append("")
    lines.append("</urlset>")

    sitemap_content = "\n".join(lines) + "\n"

    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_content)

    print(f"✅ sitemap.xml généré avec {len(all_files)} URLs")
    for filepath in all_files:
        print(f"   → {file_to_url(filepath)}")

if __name__ == "__main__":
    generate_sitemap()