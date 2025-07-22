<script setup lang="ts">
import { ref, watch } from "vue";

import Login from "./modals/Login.vue";
import Register from "./modals/Register.vue";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "close"): void; (e: "login-success"): void }>();

watch(
  () => props.open,
  (val) => {
    console.log("Auth.vue: prop open changed", val);
  }
);

const isRegister = ref(false);

const handleSwitch = () => {
  isRegister.value = !isRegister.value;
};

const handleLoginSuccess = () => {
  emit("login-success");
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
      <Register v-else />
      <div class="text-center mt-4">
        <button
          class="text-sm text-primary underline hover:opacity-80"
          type="button"
          @click="handleSwitch"
        >
          {{
            isRegister
              ? "Déjà un compte ? Se connecter"
              : "Pas encore de compte ? Créer un compte"
          }}
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
