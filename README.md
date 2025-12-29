<div align="center">

# SendLove

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=mit&logoColor=white)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)](https://ffmpeg.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

[![Build Status](https://img.shields.io/github/actions/workflow/status/Djochrist/SendLove/ci.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/Djochrist/SendLove/actions)
[![Code Coverage](https://img.shields.io/codecov/c/github/Djochrist/SendLove?style=for-the-badge&logo=codecov&logoColor=white)](https://codecov.io/gh/Djochrist/SendLove)
[![GitHub Issues](https://img.shields.io/github/issues/Djochrist/SendLove?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Djochrist/SendLove/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Djochrist/SendLove?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Djochrist/SendLove/pulls)
---

**Creer des messages romantiques personnalises pour vos proches. Magnifiquement animes, instantanement generes.**

[Voir la démonstration](#demonstration) • [Documentation](doc/) • [Signaler un bug](https://github.com/Djochrist/SendLove/issues) • [Demander une fonctionnalite](https://github.com/Djochrist/SendLove/issues)

</div>

---

## Fonctionnalites

<div align="center">

| Videos cinematiques | Musique personnalisee | Messages personnalises |
|:----------------------:|:------------------:|:---------------------------:|
| Creer de magnifiques videos animees avec animation mot par mot | Choisir parmi des pistes romantiques integrees ou telecharger votre propre musique | Rediger des messages touchants jusqu'a 1000 mots |
| Transitions et effets fluides | Formats audio multiples supportes | Options de formatage de texte riche |
| Style cinematographique professionnel | Mixage de musique de fond | Support multilingue |

| Generation instantanee | Design responsive | Confidentialite d'abord |
|:------------------------:|:----------------------:|:-------------------:|
| Generer des videos en quelques secondes | Fonctionne parfaitement sur tous les appareils | Aucune donnee stockee de maniere permanente | 

</div>

## Qu'est-ce que SendLove ?

SendLove est une application web moderne qui permet aux utilisateurs de creer des apercus de messages romantiques personnalises. Les utilisateurs peuvent :

1. **Saisir les details** : Specifier les noms de l'expediteur et du destinataire
2. **Ecrire le message** : Rediger des messages touchants jusqu'a 1000 mots
3. **Choisir la musique** : Selectionner des pistes romantiques integrees ou telecharger une musique personnalisee
4. **Generer l'aperçu** : Creer des apercus HTML animes avec animation de texte
5. **Partager** : Partager instantanement l'aperçu genere via un lien

**Statut actuel** : Ceci est un MVP qui genere des apercus HTML. La generation complete de videos MP4 est prevue pour les versions futures.

L'application utilise FFmpeg.wasm pour le traitement video futur, React pour le frontend, et Express.js pour le backend, avec stockage de fichiers JSON (MVP) et PostgreSQL prevu pour la production.

## Demonstration

<div align="center">

### Aperçu de SendLove en action

![SendLove](demo.gif)

*La démonstration animée montre le fonctionnement de l'interface web et la création de messages romantiques.*

📹 [Voir la vidéo complète (MP4)](demo.mp4)
---

</div>

## Demarrage rapide

### Pre-requis

- **Node.js** 18+ ([Telechargement](https://nodejs.org/))
- **PostgreSQL** 13+ ([Telechargement](https://www.postgresql.org/download/))
- **Git** ([Telechargement](https://git-scm.com/))

### Installation

1. **Cloner le depot**
   ```bash
   git clone https://github.com/Djochrist/SendLove.git
   cd sendlove
   ```

2. **Installer les dependances**
   ```bash
   npm install
   ```
3. **Demarrer le serveur de developpement**
   ```bash
   npm run dev
   ```

4. **Ouvrir votre navigateur**
   ```
   http://localhost:5000
   ```

## Structure du projet

```
sendlove/
├── client/                 # Application frontend React
│   ├── src/
│   │   ├── components/     # Composants UI reutilisables
│   │   ├── pages/         # Composants de page
│   │   ├── hooks/         # Hooks React personnalises
│   │   ├── lib/           # Bibliotheques utilitaires
│   │   └── ...
│   ├── public/            # Ressources statiques
│   └── index.html
├── server/                 # Application backend Express
│   ├── index.ts           # Fichier serveur principal
│   ├── routes.ts          # Routes API
│   ├── storage.ts         # Couche de persistance des donnees
│   ├── video-processor.ts # Traitement video FFmpeg
│   └── ...
├── shared/                 # Code partage
│   ├── schema.ts          # Schemas de validation Zod
│   └── routes.ts          # Definitions de routes partagees
├── doc/                   # Documentation
├── script/                # Scripts de construction
└── ...
```

## Documentation

Une documentation complete est disponible dans le dossier [`doc/`](doc/) :

- [Reference API](doc/api.md) - Documentation complete de l'API
- [Architecture](doc/architecture.md) - Conception et modeles systeme
- [Deploiement](doc/deployment.md) - Guides de deploiement pour diverses plateformes
- [Contribution](doc/contributing.md) - Comment contribuer au projet
- [Securite](doc/security.md) - Directives et meilleures pratiques de securite
- [Performance](doc/performance.md) - Guide d'optimisation des performances
- [Depannage](doc/troubleshooting.md) - Problemes courants et solutions

## Developpement

### Scripts disponibles

```bash
# Developpement
npm run dev          # Demarrer le serveur de developpement
npm run build        # Construire pour la production
npm run start        # Demarrer le serveur de production
npm run check        # Verification des types

## Contribution

Nous accueillons les contributions ! Veuillez consulter notre [Guide de contribution](doc/contributing.md) pour plus de details.

### Processus de developpement

1. Forker le depot
2. Creer une branche de fonctionnalite : `git checkout -b fonctionnalite/nouvelle-fonctionnalite`
3. Commiter vos changements : `git commit -m 'Ajouter une fonctionnalite incroyable'`
4. Pousser vers la branche : `git push origin fonctionnalite/nouvelle-fonctionnalite`
5. Ouvrir une Pull Request

### Style de code

Ce projet utilise ESLint et Prettier pour le formatage du code. Assurez-vous que votre code respecte les modeles etablis :

- Utiliser TypeScript pour tout nouveau code
- Suivre les modeles de composants existants
- Ecrire des messages de commit significatifs
- Ajouter des tests pour les nouvelles fonctionnalites

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de details.

---

<div align="center">

**Made with for spreading love through technology**

[⬆ Back to Top](#-sendlove)

</div>
