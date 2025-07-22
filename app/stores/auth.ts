import { defineStore } from "pinia";
import type {
  LoginForm,
  RegisterForm,
  FormErrors,
  User,
  ApiResponseUser,
  ApiError,
  UpdatePasswordForm,
  UpdateProfileForm,
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
        return true;
      } catch (error: any) {
        const apiError = error as ApiError;
        if (apiError.status === 422 && apiError.data) {
          this.formErrors = apiError.data.errors as FormErrors;
        } else {
          this.formErrors = { global: apiError.message } as FormErrors;
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
        console.log(response);
        this.token = response.access_token;
        this.user = response.user;
        return true;
      } catch (error: any) {
        const apiError = error as ApiError;
        if (apiError.status === 422 && apiError.data && apiError.data.errors) {
          this.formErrors = apiError.data.errors as FormErrors;
        } else {
          this.formErrors = { global: apiError.message } as FormErrors;
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
      } catch (error) {
        console.error("Logout failed", error);
      }
    },
    async refreshUser() {
      const { $api } = useNuxtApp();

      try {
        const response = await $api<User>("/user", {
          method: "GET",
        });

        if (response) {
          this.user = response;
        }
      } catch (error: any) {
        console.error("Failed to refresh user", error);
      }
    },
    async updateProfile(form: UpdateProfileForm) {
      const { $api } = useNuxtApp();

      this.formErrors = {} as FormErrors;
      this.formLoading = true;

      try {
        const response = await $api<User>("/user", {
          method: "POST",
          body: form,
        });

        if (response) {
          this.user = response;
          return true;
        }
        return false;
      } catch (error: any) {
        const apiError = error as ApiError;
        if (apiError.status === 422 && apiError.data && apiError.data.errors) {
          this.formErrors = apiError.data.errors as FormErrors;
        } else {
          this.formErrors = { global: apiError.message } as FormErrors;
        }
        throw error;
      } finally {
        this.formLoading = false;
      }
    },
    async updatePassword(form: UpdatePasswordForm) {
      const { $api } = useNuxtApp();

      this.formErrors = {} as FormErrors;
      this.formLoading = true;

      try {
        const response = await $api("/user/password", {
          method: "POST",
          body: form,
        });

        if (response) {
          this.user = response as User;
          return true;
        }
        return false;
      } catch (error: any) {
        const apiError = error as ApiError;
        if (apiError.status === 422 && apiError.data && apiError.data.errors) {
          this.formErrors = apiError.data.errors as FormErrors;
        } else {
          this.formErrors = { global: apiError.message } as FormErrors;
        }
        throw error;
      } finally {
        this.formLoading = false;
      }
    },
  },
  persist: true,
});
