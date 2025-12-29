# Reference API

## Vue d'ensemble

SendLove fournit une API REST pour creer et gerer des messages video personnalises. L'API est construite avec Express.js et utilise TypeScript pour la securite des types.

## URL de base

```
https://votre-domaine.com/api
```

## Authentification

Actuellement, l'API ne necessite pas d'authentification. Tous les points de terminaison sont accessibles publiquement.

## Format de requete/reponse

- **Content-Type** : `application/json`
- **Format de reponse** : JSON
- **Format d'erreur** : JSON avec `message` et champ `field` optionnel

## Points de terminaison

### Demandes video

#### Creer une demande video

Creer une nouvelle demande video avec message personnalise et parametres.

```http
POST /api/requests
Content-Type: application/json

{
  "senderName": "Alice",
  "receiverName": "Bob",
  "message": "Cher Bob, tu es la lumière de ma vie...",
  "music": "romantic",
  "customMusicUrl": "https://example.com/audio.mp3"
}
```

**Parametres :**

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `senderName` | string | | Nom de l'expediteur |
| `receiverName` | string | | Nom du destinataire |
| `message` | string | | Message personnalise (max 1000 mots) |
| `music` | string | | Selection musique : "romantic", "acoustic", "cinematic", ou "custom" |
| `customMusicUrl` | string | | URL du fichier musique personnalise (requis si music est "custom") |

**Reponse (201 Cree) :**

```json
{
  "id": "req_1234567890",
  "senderName": "Alice",
  "receiverName": "Bob",
  "message": "Cher Bob, tu es la lumière de ma vie...",
  "music": "romantic",
  "customMusicUrl": null,
  "status": "pending",
  "progress": 0,
  "videoUrl": null,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Reponses d'erreur :**

- `400 Mauvaise requete` : Erreur de validation
  ```json
  {
    "message": "Le nom de l'expediteur est requis",
    "field": "senderName"
  }
  ```

- `400 Mauvaise requete` : Nombre de mots depasse
  ```json
  {
    "message": "Le message ne doit pas dépasser 1000 mots."
  }
  ```

#### Obtenir une demande video

Recuperer les details d'une demande video specifique.

```http
GET /api/requests/:id
```

**Parametres :**

| Parametre | Type | Description |
|-----------|------|-------------|
| `id` | string | Identifiant unique de la demande |

**Reponse (200 OK) :**

```json
{
  "id": "req_1234567890",
  "senderName": "Alice",
  "receiverName": "Bob",
  "message": "Cher Bob, tu es la lumière de ma vie...",
  "music": "romantic",
  "customMusicUrl": null,
  "status": "completed",
  "progress": 100,
  "videoUrl": "/api/requests/req_1234567890/video",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Reponse d'erreur (404 Non trouve) :**

```json
{
  "message": "Request not found"
}
```

#### Obtenir le statut de la demande video

Obtenir le statut de traitement d'une demande video.

```http
GET /api/requests/:id/status
```

**Parametres :**

| Parametre | Type | Description |
|-----------|------|-------------|
| `id` | string | Identifiant unique de la demande |

**Reponse (200 OK) :**

```json
{
  "status": "processing",
  "progress": 75,
  "videoUrl": null
}
```

**Valeurs de statut :**
- `pending` : Demande creee, en attente de traitement
- `processing` : Video en cours de generation
- `completed` : Video prete
- `failed` : Echec de generation video

#### Obtenir l'aperçu de message genere

Recuperer l'aperçu de message genere pour une demande terminee. **Note** : Ce MVP retourne une page HTML avec texte anime, pas un fichier video.

```http
GET /api/requests/:id/video
```

**Parametres :**

| Parametre | Type | Description |
|-----------|------|-------------|
| `id` | string | Identifiant unique de la demande |

**Reponse (200 OK) :** Page HTML avec aperçu de message anime

**Format de reponse :**
```html
<html>
<body style="background: black; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
  <h1>Vidéo de [senderName] pour [receiverName]</h1>
  <p style="font-size: 1.5rem; max-width: 600px; text-align: center; font-style: italic;">"[message]"</p>
  <div style="margin-top: 2rem; border: 2px solid pink; padding: 2rem; border-radius: 1rem;">
    Musique : [music]
  </div>
  <p style="margin-top: 2rem; color: #666;">Ceci est un aperçu généré pour votre démonstration.</p>
</body>
</html>
```

**Reponse d'erreur (404 Non trouve) :** Si la demande n'est pas prete ou n'existe pas

### Telechargement musique

#### Telecharger musique personnalisee

Telecharger un fichier audio personnalise pour utilisation dans la generation video.

```http
POST /api/upload-music
Content-Type: multipart/form-data

file: [fichier audio]
```

**Exigences fichier :**

| Propriete | Exigence |
|-----------|----------|
| Format | MP3, WAV, M4A, OGG |
| Taille | Maximum 10MB |
| Type | audio/* |

**Reponse (201 Cree) :**

```json
{
  "url": "/uploads/audio-1705312200000-123456789.mp3"
}
```

**Reponses d'erreur :**

- `400 Mauvaise requete` : Aucun fichier telecharge
  ```json
  {
    "message": "No file uploaded"
  }
  ```

- `400 Mauvaise requete` : Type de fichier invalide
  ```json
  {
    "message": "Only audio files are allowed"
  }
  ```

## Types de donnees

### VideoRequest

```typescript
interface VideoRequest {
  id: string;
  senderName: string;
  receiverName: string;
  message: string;
  music: string;
  customMusicUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number; // 0-100
  videoUrl?: string;
  createdAt: string; // Chaine de date ISO 8601
}
```

### CreateVideoRequest

```typescript
interface CreateVideoRequest {
  senderName: string;
  receiverName: string;
  message: string;
  music: string;
  customMusicUrl?: string;
}
```

## Gestion d'erreurs

Toutes les erreurs de l'API suivent un format coherent :

```json
{
  "message": "Description de l'erreur",
  "field": "nom_champ" // Optionnel, pour les erreurs de validation
}
```

### Codes de statut HTTP

- `200 OK` : Requete reussie
- `201 Cree` : Ressource creee avec succes
- `400 Mauvaise requete` : Donnees de requete invalides
- `404 Non trouve` : Ressource non trouvee
- `500 Erreur interne serveur` : Erreur serveur

## Limitation du taux

Actuellement, aucune limitation du taux n'est implementee. Cela peut changer dans les versions futures.

## CORS

L'API supporte le partage de ressources cross-origin (CORS) pour les applications web.

## SDK et bibliotheques

### JavaScript/TypeScript

```typescript
// Exemple d'utilisation avec fetch
async function createVideoRequest(data: CreateVideoRequest) {
  const response = await fetch('/api/requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Echec de creation de la demande video');
  }

  return response.json();
}

// Exemple d'utilisation avec React Query (comme utilise dans le frontend)
import { useMutation } from '@tanstack/react-query';

function useCreateRequest() {
  return useMutation({
    mutationFn: createVideoRequest,
  });
}
```

## Webhooks

Les webhooks ne sont actuellement pas implementes mais peuvent etre ajoutes dans les versions futures pour les mises a jour de statut en temps reel.

## Versionnement

L'API n'est actuellement pas versionnee. Quand le versionnement sera introduit, il utilisera le versionnement de chemin URL (ex. : `/api/v1/requests`).

## Journal des modifications

### v1.0.0 (Actuelle)
- Version initiale de l'API
- Operations CRUD de base pour les demandes video
- Fonctionnalite de telechargement musique
- Suivi de statut

## Support

Pour le support API ou questions :
- Email : api@sendlove.app
- Issues : [GitHub Issues](https://github.com/Djochrist/SendLove/issues)
- Docs : [Documentation API](https://docs.sendlove.app/api)

---

<div align="center">

[← Back to Documentation](../README.md#📚-documentation) • [Architecture →](architecture.md)

</div>
