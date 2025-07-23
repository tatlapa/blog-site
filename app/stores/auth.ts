import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import type {
  LoginForm,
  RegisterForm,
  FormErrors,
  User,
  ApiResponseUser,
  ApiError,
} from "@/types/authTypes";

// @ts-ignore
export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
    formErrors: {} as FormErrors,
    formLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async register(form: RegisterForm) {
      const { $api } = useNuxtApp();

      this.formErrors = {} as FormErrors;
      this.formLoading = true;

      try {
        const response = await $api<ApiResponseUser>("/auth/register", {
          method: "POST",
          body: form,
        });
        this.token = response.access_token;
        this.user = response.user;
        toast.success("Inscription réussie !");
        return true;
      } catch (error: any) {
        if (error.status === 422) {
          this.formErrors = error.data.errors as FormErrors;
        } else {
          this.formErrors = { global: error.message } as FormErrors;
        }
        throw error;
      } finally {
        this.formLoading = false;
      }
    },
    async login(form: LoginForm) {
      const { $api } = useNuxtApp();

      this.formErrors = {} as FormErrors;
      this.formLoading = true;

      try {
        const response = await $api<ApiResponseUser>("/auth/login", {
          method: "POST",
          body: form,
        });
        this.token = response.access_token;
        this.user = response.user;
        toast.success("Connexion réussie !");
        return true;
      } catch (error: any) {
        if (error.status === 400) {
          this.formErrors = error.data.errors as FormErrors;
        } else if (error.status === 401) {
          this.formErrors = error.data.message as FormErrors;
        } else if (error.status === 500) {
          this.formErrors = error.data.message as FormErrors;
        }
        throw error;
      } finally {
        this.formLoading = false;
      }
    },
    logout() {
      const { $api } = useNuxtApp();

      try {
        $api("/auth/logout", {
          method: "POST",
        });
        this.token = null;
        this.user = null;
        localStorage.clear();
        navigateTo("/");
        toast.success("Déconnexion réussie !");
      } catch (error) {
        console.error("Logout failed", error);
      }
    },
  },
  persist: {
    key: "auth-store",
  },
});
