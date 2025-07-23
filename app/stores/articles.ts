import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import type {
  Article,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/articleTypes";

// @ts-ignore
export const useArticlesStore = defineStore("articles", {
  state: () => ({
    articles: [] as Article[],
    loading: false,
    formLoading: false,
  }),
  actions: {
    async fetchArticles() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const response = (await $api("/articles")) as {
          data: { articles: Article[] };
        };
        this.articles = response.data.articles ?? [];
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // async fetchArticle(id: number) {
    //   this.loading = true;
    //     const { $api } = useNuxtApp();
    //   try {
    //     const response = await $api(`/articles/${id}`);
    //     return response as Article;
    //   } catch (error) {
    //     throw error;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    async createArticle(articleData: CreateArticleData) {
      this.formLoading = true;
      const { $api } = useNuxtApp();
      try {
        const response = await $api("/articles", {
          method: "POST",
          body: articleData,
        });
        toast.success("Article créé avec succès !");
        await (this as any).fetchArticles(); // Refresh la liste
        return response;
      } catch (error) {
        toast.error("Erreur lors de la création de l'article");
        throw error;
      } finally {
        this.formLoading = false;
      }
    },
    async updateArticle(id: string, articleData: UpdateArticleData) {
      this.formLoading = true;
      const { $api } = useNuxtApp();
      try {
        const response = await $api<Article>(`/articles/${id}`, {
          method: "PUT",
          body: articleData,
        });
        toast.success("Article mis à jour avec succès !");
        await (this as any).fetchArticles(); // Refresh la liste
        return response;
      } catch (error) {
        toast.error("Erreur lors de la mise à jour de l'article");
        throw error;
      } finally {
        this.formLoading = false;
      }
    },
    async deleteArticle(id: string) {
      this.formLoading = true;
      const { $api } = useNuxtApp();
      try {
        await $api(`/articles/${id}`, { method: "DELETE" });
        // Remove the deleted article from the local state
        this.articles = this.articles.filter((article) => article.id !== id);
        toast.success("Article supprimé avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la suppression de l'article");
        throw error;
      } finally {
        this.formLoading = false;
      }
    },
  },
  persist: {
    key: "articles-store",
  },
});
