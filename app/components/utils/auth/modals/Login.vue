<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore() as any;

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court"),
  })
);

const emit = defineEmits<{ (e: "login-success"): void; (e: "close"): void }>();

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values);
    emit("login-success");
  } catch (error) {
    // L'erreur est déjà gérée par le store
  }
});
</script>

<template>
  <form class="space-y-4" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            type="email"
            placeholder="Votre email"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="Votre mot de passe"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div
      v-if="authStore.formErrors"
      class="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
    >
      {{ authStore.formErrors }}
    </div>
    <DialogFooter>
      <Button type="submit" :disabled="authStore.formLoading">
        {{ authStore.formLoading ? "Connexion..." : "Se connecter" }}
      </Button>
    </DialogFooter>
  </form>
</template>
