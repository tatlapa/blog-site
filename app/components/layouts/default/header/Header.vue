<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import Auth from "~/components/utils/auth/Auth.vue";

// Utilisation du store d'authentification
const authStore = useAuthStore();

// État local pour la modal
const showLoginModal = ref(false);

// Fonction pour gérer la connexion réussie
const handleLoginSuccess = () => {
  console.log("Connexion réussie");
};
</script>

<template>
  <header class="bg-white shadow-sm border-b">
    <div class="container mx-auto">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Titre -->
        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Mon Blog
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="flex items-center space-x-4">
          <NuxtLink
            to="/"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Accueil
          </NuxtLink>

          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/admin"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Gestion Articles
          </NuxtLink>

          <!-- Boutons d'authentification -->
          <Button
            v-if="!authStore.isAuthenticated"
            @click="showLoginModal = true"
            variant="outline"
            size="sm"
            :disabled="authStore.formLoading"
          >
            {{ authStore.formLoading ? "Connexion..." : "Connexion" }}
          </Button>
          <Button
            v-else
            @click="authStore.logout()"
            variant="outline"
            size="sm"
            :disabled="authStore.formLoading"
          >
            {{ authStore.formLoading ? "Déconnexion..." : "Déconnexion" }}
          </Button>
        </nav>
      </div>
    </div>
  </header>
  <!-- Nouvelle modale d'authentification -->
  <Auth
    :open="showLoginModal"
    @close="showLoginModal = false"
    @login-success="handleLoginSuccess"
  />
</template>
