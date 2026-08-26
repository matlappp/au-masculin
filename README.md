# Au masculin — site web

Site vitrine de la clinique **Au masculin** (esthétique et santé masculine, Montréal).
HTML / CSS / JS purs, aucune dépendance, aucun build. On dépose les fichiers sur
l'hébergeur et c'est en ligne.

---

## Structure

```
.
├── index.html                 Accueil
├── hormonotherapie.html       Service 01 — TRT
├── prf-capillaire.html        Service 02 — PRF
├── greffe-de-cheveux.html     Service 03 — Greffe FUE + NeoGraft
├── soins-esthetiques.html     Soins de l'homme (9 traitements)
├── equipe.html                Les 3 professionnels
├── contact.html               Formulaire + coordonnées + FAQ
├── 404.html
├── robots.txt · sitemap.xml · site.webmanifest
├── assets/                    Images (SVG de remplacement pour l'instant)
├── styles/
│   ├── styles.css             Tout le design
│   └── mediaqueries.css       Points de rupture uniquement
└── scripts/
    └── script.js              Menu, accordéons, révélation, formulaire
```

---

## À remplir avant la mise en ligne

### 1. Coordonnées — cherchez `À CONFIRMER` dans les fichiers

| Élément | Valeur actuelle (fictive) | Où |
|---|---|---|
| Téléphone | `514 000-0000` / `tel:+15140000000` | toutes les pages |
| Courriel | `info@aumasculin.ca` | toutes les pages |
| Adresse | « Adresse à confirmer, Montréal, QC » | `contact.html`, pied de page, JSON-LD |
| Heures | « heures à confirmer » | `contact.html` |
| Domaine | `https://www.aumasculin.ca` | balises `canonical`, `og:url`, `sitemap.xml` |
| Réseaux sociaux | `href="#"` | pied de page, `contact.html` |

Remplacement en un coup :

```bash
grep -rl '514 000-0000' . --include='*.html' | xargs sed -i '' 's/514 000-0000/VOTRE NUMÉRO/g'
grep -rl '+15140000000' . --include='*.html' | xargs sed -i '' 's/+15140000000/+1514XXXXXXX/g'
```

### 2. Images

`assets/` contient des SVG de remplacement, dimensionnés au bon ratio. Remplacez-les
par de vraies photos en gardant les mêmes noms **ou** changez l'extension dans le HTML.

| Fichier | Usage | Ratio |
|---|---|---|
| `hero.svg` | Fond du héros d'accueil | 1600 × 1100 |
| `trt.svg` · `prf.svg` · `greffe.svg` | Visuels de service | 4:5 |
| `soins-homme.svg` · `clinique.svg` | Sections illustrées | 5:4 / 4:5 |
| `equipe-kannab.svg` · `equipe-gomez.svg` · `equipe-fortier.svg` | Portraits | 3:4 |
| `og-cover.svg` | Aperçu réseaux sociaux | 1200 × 630 — **à refaire en JPG/PNG**, plusieurs plateformes ignorent le SVG |
| `favicon.svg` | Onglet du navigateur | — |

### 3. Formulaire de rendez-vous

`contact.html` → le `<form id="rdv-form">` n'a **pas** d'attribut `action`. Tant qu'il
n'en a pas, le JS affiche une confirmation visuelle sans rien envoyer.

Ajoutez l'`action` du service choisi (Formspree, Netlify Forms, Web3Forms, script PHP)
et l'envoi se fera normalement — la validation côté client reste active dans les deux cas.

### 4. Tarifs à valider

Cherchez `PRIX À VALIDER` dans `soins-esthetiques.html`. Les montants de la section
« Soins esthétiques » proviennent de la page de référence fournie par le client et
**doivent être confirmés** par la clinique avant publication.

Les tarifs des trois services principaux sont ceux fournis par le client :
TRT 325 $ / 175 $ · PRF 549 $ / 549 $ / 449 $ · Greffe à partir de 7 999 $.

---

## Notes techniques

- **Polices** : Archivo, Inter et Instrument Serif via Google Fonts. Pour héberger
  les fichiers localement, téléchargez les `.woff2` et remplacez le `<link>` par des
  règles `@font-face`.
- **Accessibilité** : lien d'évitement, `aria-expanded` sur le menu et les accordéons,
  `aria-current` sur l'onglet actif, focus visible, `prefers-reduced-motion` respecté.
- **SEO** : `<title>`/`description` uniques par page, Open Graph, canoniques,
  JSON-LD (`MedicalClinic`, `MedicalTherapy`, `MedicalProcedure`, `FAQPage`, `Physician`),
  `sitemap.xml` et `robots.txt`.
- **Séparateurs de grille** : réalisés en bordures, pas en `gap` + fond opaque, pour
  que les mêmes composants fonctionnent sur fond sombre comme sur fond clair.
- **Mentions médicales** : chaque page de service porte un encadré `.notice` précisant
  que le contenu est informatif, que les résultats varient et qu'aucun traitement n'est
  amorcé sans évaluation et consentement éclairé. À faire relire par la clinique.

---

## Développement local

Aucun outil requis. Pour un aperçu avec des chemins propres :

```bash
python3 -m http.server 8000
```

Puis <http://localhost:8000>.

---

Site conçu par [Matlap Design](https://www.matlapdesign.com).
