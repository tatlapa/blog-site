<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";
import { useAuthStore } from "~/stores/auth";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const authStore = useAuthStore();

const formSchema = toTypedSchema(
  z
    .object({
      email: z.string().email("Email invalide"),
      password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    })
);

const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.register(values);
    // gestion du succès (emit, etc.)
  } catch (error) {
    // gestion de l'erreur dans le store
  }
});
</script>

<template>
  <Form class="space-y-4" @submit="onSubmit">
    <FormField
      v-slot="{ componentField }"
      name="email"
      :validate-on-blur="!isFieldDirty"
    >
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
    <FormField
      v-slot="{ componentField }"
      name="password"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="Mot de passe"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField
      v-slot="{ componentField }"
      name="confirmPassword"
      :validate-on-blur="!isFieldDirty"
    >
      <FormItem>
        <FormLabel>Confirmer le mot de passe</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="Confirmez le mot de passe"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div
      v-if="authStore.formErrors.global"
      class="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
    >
      {{ authStore.formErrors.global[0] }}
    </div>
    <DialogFooter>
      <Button type="submit" :disabled="authStore.formLoading">
        {{ authStore.formLoading ? "Création..." : "Créer le compte" }}
      </Button>
    </DialogFooter>
  </Form>
</template>
