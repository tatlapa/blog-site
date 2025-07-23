<script setup lang="ts">
import { ref, watch } from "vue";

import Login from "./modals/Login.vue";
import Register from "./modals/Register.vue";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "login-success"): void;
  (e: "register-success"): void;
}>();

const authStore = useAuthStore() as any;
const isRegister = ref(false);

// Nettoyer les erreurs quand la modale s'ouvre
watch(
  () => props.open,
  () => {
    authStore.formErrors = null;
  }
);

const handleSwitch = () => {
  isRegister.value = !isRegister.value;
};

const handleLoginSuccess = () => {
  emit("login-success");
  emit("close");
};

const handleRegisterSuccess = () => {
  emit("register-success");
  emit("close");
};

const handleOpenChange = (value: boolean) => {
  if (!value) emit("close");
};
</script>

<template>
  <Dialog :open="props.open" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{
          isRegister ? "Créer un compte" : "Connexion"
        }}</DialogTitle>
        <DialogDescription>
          {{
            isRegister
              ? "Remplissez le formulaire pour créer un compte."
              : "Connectez-vous à votre compte pour accéder à toutes les fonctionnalités."
          }}
        </DialogDescription>
      </DialogHeader>
      <Login v-if="!isRegister" @login-success="handleLoginSuccess" />
      <Register v-else @register-success="handleRegisterSuccess" />
      <Button
        variant="link"
        type="button"
        @click="handleSwitch"
        class="justify-end m-0 p-0"
      >
        {{
          isRegister
            ? "Déjà un compte ? Se connecter"
            : "Pas encore de compte ? Créer un compte"
        }}
      </Button>
    </DialogContent>
  </Dialog>
</template>
