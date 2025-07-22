# Blog avec Nuxt 3, Pinia et shadcn-vue

Un blog moderne développé avec Nuxt 3, utilisant Pinia pour la gestion d'état, shadcn-vue pour l'interface utilisateur, et une architecture API centralisée.

## 🚀 Fonctionnalités

- **Authentification complète** avec gestion des tokens JWT
- **Gestion des articles** (CRUD complet)
- **Interface moderne** avec Tailwind CSS et shadcn-vue
- **Architecture scalable** avec stores Pinia
- **Gestion d'erreurs centralisée**
- **Responsive design**

## 🛠️ Technologies utilisées

- **Nuxt 3** - Framework Vue.js
- **Pinia** - Gestion d'état
- **shadcn-vue** - Composants UI
- **Tailwind CSS** - Framework CSS
- **TypeScript** - Typage statique

## 📁 Structure du projet

```
app/
├── components/
│   ├── layouts/
│   │   └── default/
│   │       └── header/
│   │           └── Header.vue      # Composant header
│   ├── utils/
│   │   └── LoginModal.vue          # Modal de connexion
│   └── ui/           # Composants shadcn-vue
├── layouts/
│   └── default.vue   # Layout par défaut
├── plugins/
│   └── api.ts        # Plugin pour les appels API
├── pages/
│   ├── index.vue     # Page d'accueil
│   └── admin.vue     # Page d'administration
├── stores/
│   ├── auth.ts       # Store d'authentification
│   └── articles.ts   # Store des articles
├── types/
│   └── authTypes.ts  # Types TypeScript pour l'authentification
└── app.vue           # Point d'entrée de l'application
```

## 🔧 Installation

1. **Cloner le projet**

   ```bash
   git clone <repository-url>
   cd blog-site
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

## 📖 Utilisation des Stores Pinia

### Store d'authentification (`useAuthStore`)

```typescript
// Dans un composant
const authStore = useAuthStore();

// Connexion
await authStore.login({
  username: "user",
  password: "password",
});

// Vérifier l'état d'authentification
if (authStore.isAuthenticated) {
  // Utilisateur connecté
}

// Déconnexion
await authStore.logout();
```

**Propriétés disponibles :**

- `isAuthenticated` - État de connexion (computed)
- `user` - Informations de l'utilisateur
- `formLoading` - État de chargement des formulaires
- `formErrors` - Erreurs de validation des formulaires
- `token` - Token JWT

### Store des articles (`useArticlesStore`)

```typescript
// Dans un composant
const articlesStore = useArticlesStore();

// Charger tous les articles
await articlesStore.fetchArticles();

// Créer un article
await articlesStore.createArticle({
  title: "Nouvel article",
  excerpt: "Résumé...",
  content: "Contenu...",
});

// Modifier un article
await articlesStore.updateArticle(1, {
  title: "Titre modifié",
});

// Supprimer un article
await articlesStore.deleteArticle(1);
```

**Propriétés disponibles :**

- `articles` - Liste des articles
- `loading` - État de chargement
- `error` - Messages d'erreur

## 🔌 Configuration API

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
NUXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Plugin API

Les appels API sont gérés par le plugin `app/plugins/api.ts` qui :

- Configure automatiquement l'URL de base
- Ajoute automatiquement le token d'authentification
- Gère les erreurs 401 (redirection automatique)
- Utilise `$fetch` de Nuxt pour les appels HTTP

### Utilisation dans les stores

```typescript
// Dans un store
const { $api } = useNuxtApp();

// Appel GET
const articles = await $api("/articles");

// Appel POST
const newArticle = await $api("/articles", {
  method: "POST",
  body: articleData,
});

// Appel PUT
await $api(`/articles/${id}`, {
  method: "PUT",
  body: updateData,
});

// Appel DELETE
await $api(`/articles/${id}`, {
  method: "DELETE",
});
```

## 🎨 Interface utilisateur

### Composants disponibles

Le projet utilise shadcn-vue avec les composants suivants :

- `Button` - Boutons avec variantes
- `Card` - Cartes pour afficher le contenu
- `Input` - Champs de saisie
- `Label` - Labels pour les formulaires
- `Textarea` - Zones de texte

### Ajouter de nouveaux composants

```bash
npx shadcn-vue@latest add <component-name>
```

## 🔒 Authentification

### Fonctionnement

1. **Connexion** : L'utilisateur saisit ses identifiants
2. **Validation** : Les données sont validées côté client
3. **Token** : Un token JWT est généré et stocké
4. **Persistance** : Le token est sauvegardé en localStorage
5. **Vérification** : L'état d'authentification est vérifié au chargement

### Protection des routes

La page d'administration (`/admin`) est protégée et redirige vers l'accueil si l'utilisateur n'est pas connecté.

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

### Variables d'environnement en production

Assurez-vous de configurer `NUXT_PUBLIC_API_URL` avec l'URL de votre API en production.

## 📝 Notes de développement

### Simulation des API

Pour le développement, les stores utilisent des données simulées. Pour connecter à une vraie API :

1. Décommentez les appels API dans les stores (utilisez `$api` du plugin)
2. Configurez l'URL de votre API dans les variables d'environnement
3. Adaptez les types de données selon votre API

### Persistance automatique

L'état d'authentification est automatiquement persisté grâce à `pinia-plugin-persistedstate`. Les données sont sauvegardées en localStorage et restaurées au rechargement de la page.

### Gestion des erreurs

Les erreurs sont gérées de manière centralisée via le service API et affichées à l'utilisateur de manière conviviale.

### Performance

- Les stores Pinia utilisent la réactivité de Vue 3
- Les données sont mises en cache dans les stores
- Les appels API sont optimisés avec gestion des états de chargement

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
