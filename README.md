# Au masculin — site web

Site vitrine de la clinique **Au masculin** (clinique médico-esthétique pour hommes, Montréal).
HTML / CSS / JS purs, aucune dépendance, aucun build. On dépose les fichiers sur
l'hébergeur et c'est en ligne.

Palette claire : marbre, blanc et or, écriture noire. Le fond marbre est une texture
SVG générée (`assets/marbre.svg`), pas une photo.

---

## Structure

```
.
├── index.html                 Accueil (héros à carrousel, 4 services)
├── hormonotherapie.html       Service 01 — TRT (parcours à distance)
├── prf-capillaire.html        Service 02 — PRF
├── greffe-de-cheveux.html     Service 03 — Greffe de cheveux FUE + NeoGraft
├── soins-esthetiques.html     Service 04 — Soins de l'homme (9 traitements)
├── equipe.html                Les 4 professionnels
├── contact.html               Formulaire + coordonnées + FAQ
├── 404.html
├── robots.txt · sitemap.xml · site.webmanifest
├── assets/                    Photos du client, logo et texture marbre
├── styles/
│   ├── styles.css             Tout le design
│   └── mediaqueries.css       Points de rupture uniquement
└── scripts/
    └── script.js              Menu, accordéons, révélation, carrousel, formulaire
```

---

## À remplir avant la mise en ligne

### 1. Coordonnées — cherchez `À CONFIRMER` dans les fichiers

Le téléphone (514 887-8877), l'adresse (415, rue Sainte-Hélène, Montréal) et les heures
(lundi au vendredi, 9 h à 17 h) sont ceux fournis par le client. Restent à confirmer :

| Élément | Valeur actuelle | Où |
|---|---|---|
| Courriel | `info@cliniqueaumasculin.ca` | toutes les pages |
| Code postal | absent du JSON-LD | `index.html`, `contact.html` |
| Domaine | `https://www.cliniqueaumasculin.ca` | balises `canonical`, `og:url`, `sitemap.xml` |
| Réseaux sociaux | `href="#"` | pied de page, `contact.html` |

### 2. Images

`assets/` contient les photos fournies par le client, extraites de `modifs.pdf`. Elles sont
**basse résolution** : demandez les originaux avant toute refonte des visuels.

| Fichier | Usage | Format |
|---|---|---|
| `hero-1/2/3.jpg` | Visuels déroulants du héros | 3:4 |
| `equipe-lapointe/kannab/gomez/fortier.jpg` | Portraits détourés, cadrage uniforme | 3:4 |
| `hormonotherapie-affiche.jpg` | Page TRT | 2:3 |
| `prf-promo.jpg` · `prf-conditions.jpg` | Page PRF | 3:4 |
| `greffe-avant-apres.jpg` | Avant / après NeoGraft | 850 × 550 |
| `neograft.png` | Appareil détouré | PNG à canal alpha |
| `greffe-complement.jpg` | Section « en complément » | 3:4 |
| `og-cover.jpg` | Aperçu réseaux sociaux | 1200 × 630 |
| `logo-am.svg` · `favicon.svg` · `marbre.svg` | Logo, icône, texture de fond | vectoriels |
| `soins-homme.svg` | **Dernier gabarit** — à remplacer par une photo | 5:4 |

### 3. Formulaire de rendez-vous

`contact.html` → le `<form id="rdv-form">` n'a **pas** d'attribut `action`. Tant qu'il
n'en a pas, le JS affiche une confirmation visuelle sans rien envoyer.

Ajoutez l'`action` du service choisi (Formspree, Netlify Forms, Web3Forms, script PHP)
et l'envoi se fera normalement — la validation côté client reste active dans les deux cas.

### 4. Tarifs à valider

Cherchez `PRIX À VALIDER` dans `soins-esthetiques.html`. Les montants de la section
« Soins médico-esthétiques » proviennent de la page de référence fournie par le client et
**doivent être confirmés** par la clinique avant publication.

Les tarifs des services principaux sont ceux fournis par le client :
TRT 325 $ / 175 $ · PRF 549,99 $ / 549,99 $ / 449,99 $ (100 $ de rabais à la 3ᵉ séance).
**La greffe de cheveux est affichée à partir de 7 999 $, PRF capillaire inclus** : le montant final se détermine en consultation,
selon le nombre de greffons, et des méthodes de financement sont offertes.

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
  que les mêmes composants fonctionnent sur marbre comme sur blanc.
- **Carrousel du héros** : `[data-slider]` dans `index.html`, piloté par `scripts/script.js`.
  Sans JS, la première image reste affichée ; l'animation se coupe si `prefers-reduced-motion`.
- **Portraits de l'équipe** : détourés puis recomposés en 3:4 sur un fond uniforme, avec
  un fondu du bas — les cadrages d'origine n'ont pas la même coupe.
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
